from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from fractions import Fraction
from scipy.linalg import eig

app = Flask(__name__)
CORS(app)

# Constants
CRITERIA = [
    "Складність догляду",
    "Тривалість життя",
    "Адаптивність до життя в помешканні",
    "Медичні ризики",
    "Соціальна активність",
    "Потреба у вигулюванні/фізичній активності",
    "Популярність"
]

ALTERNATIVES = ["Хом'як", "Черепаха", "Папуга", "Кролик", "Кіт", "Собака"]

SAATY_SCALE = [1, 3, 5, 7, 9]
CONSISTENCY_INDICES = [0, 0, 0.52, 0.89, 1.11, 1.25, 1.35, 1.4, 1.45, 1.49]

# Predefined comparison matrices for alternatives
ALTERNATIVE_MATRICES = [
    # Criterion 1: Care complexity
    [
        [1, 3, 2, 4, 6, 2],
        [1/3, 1, 1/2, 2, 4, 1/2],
        [1/2, 2, 1, 3, 5, 1],
        [1/4, 1/2, 1/3, 1, 3, 1/3],
        [1/6, 1/4, 1/5, 1/3, 1, 1/5],
        [1/2, 2, 1, 3, 5, 1]
    ],
    # Criterion 2: Lifespan
    [
        [1, 1/4, 1/3, 1/5, 1/3, 1/7],
        [4, 1, 3, 2, 3, 1/3],
        [3, 1/3, 1, 1/2, 1, 1/5],
        [5, 1/2, 2, 1, 2, 1/3],
        [3, 1/3, 1, 1/2, 1, 1/5],
        [7, 3, 5, 3, 5, 1]
    ],
    # Criterion 3: Adaptability
    [
        [1, 3, 5, 4, 7, 2],
        [1/3, 1, 3, 2, 5, 1/2],
        [1/5, 1/3, 1, 1/2, 3, 1/4],
        [1/4, 1/2, 2, 1, 4, 1/3],
        [1/7, 1/5, 1/3, 1/4, 1, 1/6],
        [1/2, 2, 4, 3, 6, 1]
    ],
    # Criterion 4: Medical risks
    [
        [1, 1/3, 1/2, 1/4, 1/5, 1/3],
        [3, 1, 2, 1/2, 1/3, 2],
        [2, 1/2, 1, 1/3, 1/4, 1/2],
        [4, 2, 3, 1, 1/2, 3],
        [5, 3, 4, 2, 1, 4],
        [3, 1/2, 2, 1/3, 1/4, 1]
    ],
    # Criterion 5: Social activity
    [
        [1, 1/3, 1/4, 1/5, 1/7, 1/2],
        [3, 1, 1/2, 1/3, 1/5, 2],
        [4, 2, 1, 1/2, 1/3, 3],
        [5, 3, 2, 1, 1/2, 4],
        [7, 5, 3, 2, 1, 6],
        [2, 1/2, 1/3, 1/4, 1/6, 1]
    ],
    # Criterion 6: Exercise needs
    [
        [1, 1/4, 1/5, 1/6, 1/8, 1/2],
        [4, 1, 1/2, 1/3, 1/5, 3],
        [5, 2, 1, 1/2, 1/3, 4],
        [6, 3, 2, 1, 1/2, 5],
        [8, 5, 3, 2, 1, 7],
        [2, 1/3, 1/4, 1/5, 1/7, 1]
    ],
    # Criterion 7: Popularity
    [
        [1, 3, 2, 4, 1/3, 2],
        [1/3, 1, 1/2, 2, 1/5, 1/2],
        [1/2, 2, 1, 3, 1/4, 1],
        [1/4, 1/2, 1/3, 1, 1/6, 1/3],
        [3, 5, 4, 6, 1, 4],
        [1/2, 2, 1, 3, 1/4, 1]
    ]
]

class AHPAnalyzer:
    @staticmethod
    def get_closest_saaty_value(ratio):
        """Round ratio to nearest Saaty scale value"""
        if ratio == 1:
            return Fraction(1, 1)
        if ratio >= 9:
            return 9
        if ratio <= 1/9:
            return Fraction(1, 9)

        valid_values = [x for x in SAATY_SCALE if x != 1] + [Fraction(1, x) for x in SAATY_SCALE if x != 1]
        closest = min(valid_values, key=lambda x: abs(float(x) - ratio))
        return closest if ratio != 1 and closest != 1 else min(
            [x for x in valid_values if x != 1],
            key=lambda x: abs(float(x) - ratio)
        )

    @staticmethod
    def build_pairwise_matrix(user_ratings):
        """Build pairwise comparison matrix"""
        n = len(CRITERIA)
        matrix = [[Fraction(1, 1) for _ in range(n)] for _ in range(n)]

        for i in range(n):
            for j in range(i+1, n):
                ratio = user_ratings[i] / user_ratings[j]
                saaty_ratio = AHPAnalyzer.get_closest_saaty_value(ratio)
                matrix[i][j] = saaty_ratio
                matrix[j][i] = Fraction(1) / saaty_ratio
        return matrix

    @staticmethod
    def calculate_weights(matrix):
        """Calculate criteria weights using eigenvalue method"""
        float_matrix = np.array([[float(x) for x in row] for row in matrix])
        eigenvalues, eigenvectors = eig(float_matrix)
        max_idx = np.argmax(eigenvalues.real)
        eigenvector = eigenvectors[:, max_idx].real
        return eigenvector / eigenvector.sum()

    @staticmethod
    def check_consistency(matrix, weights):
        """Check matrix consistency"""
        n = len(matrix)
        float_matrix = np.array([[float(x) for x in row] for row in matrix])
        lambda_max = (float_matrix @ weights).sum() / weights.sum()
        ci = (lambda_max - n) / (n - 1)
        return ci / CONSISTENCY_INDICES[n-1]  # Using RI for n=7

    @staticmethod
    def power_iteration(matrix, max_iter=1000, tol=1e-6):
        """Power iteration method for eigenvalue calculation"""
        n = matrix.shape[0]
        x = np.random.rand(n)
        x /= np.linalg.norm(x)

        for _ in range(max_iter):
            x_new = matrix @ x
            x_new /= np.linalg.norm(x_new)
            if np.linalg.norm(x_new - x) < tol:
                break
            x = x_new
        return (x.T @ matrix @ x) / (x.T @ x)

    @staticmethod
    def normalize_matrix(matrix):
        """Normalize matrix using geometric mean"""
        n = matrix.shape[0]
        weights = np.ones(n)
        for i in range(n):
            product = 1.0
            for j in range(n):
                product *= matrix[i, j]
            weights[i] = product ** (1/n)
        return weights / weights.sum()

    @staticmethod
    def analyze_alternatives():
        """Analyze alternatives for each criterion"""
        weights = np.zeros((len(ALTERNATIVES), len(CRITERIA)))
        
        for crit_idx in range(len(CRITERIA)):
            matrix = np.array(ALTERNATIVE_MATRICES[crit_idx])
            weights[:, crit_idx] = AHPAnalyzer.normalize_matrix(matrix)
        return weights

    @staticmethod
    def perform_analysis(user_ratings):
        """Perform complete AHP analysis"""
        # 1. Build pairwise matrix
        pairwise_matrix = AHPAnalyzer.build_pairwise_matrix(user_ratings)
        
        # 2. Calculate criteria weights
        weights_cr = AHPAnalyzer.calculate_weights(pairwise_matrix)
        
        # 3. Check consistency
        cr = AHPAnalyzer.check_consistency(pairwise_matrix, weights_cr)
        
        # 4. Analyze alternatives
        weights_alt = AHPAnalyzer.analyze_alternatives()
        
        # 5. Calculate global weights
        global_weights = weights_alt @ weights_cr
        
        # 6. Rank alternatives
        ranked_indices = np.argsort(global_weights)[::-1]
        
        return {
            "criteria_weights": dict(zip(CRITERIA, weights_cr)),
            "alternative_weights": dict(zip(ALTERNATIVES, global_weights)),
            "ranking": [ALTERNATIVES[i] for i in ranked_indices],
            "consistency_ratio": float(cr)
        }

@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        data = request.json
        answers = data.get('answers', [])
        
        if len(answers) != len(CRITERIA):
            return jsonify({"error": f"Expected {len(CRITERIA)} answers"}), 400
            
        user_ratings = [int(answer) for answer in answers]
        result = AHPAnalyzer.perform_analysis(user_ratings)
        
        # Calculate percentages
        total = sum(result['alternative_weights'].values())
        percentages = {
            alt: f"{(weight/total)*100:.1f}%"
            for alt, weight in result['alternative_weights'].items()
        }
        
        result.update({
            'status': 'success',
            'percentage_weights': percentages,
            'ranking_with_percentages': [
                f"{alt} ({percentages[alt]})"
                for alt in result['ranking']
            ]
        })
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)