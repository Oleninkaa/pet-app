import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Slider from '@react-native-community/slider';



const questions = [
  "Я готовий доглядати за тваринкою, водити на грумінг, мити її місце, гуляти з нею.",
  "Я приймаю закони життя та розумію, що тваринка колись помре.",
  "Я можу забезпечити тваринці належні умови, такі як великий будинок та двір.",
  "Мені важливо знати про хронічні захворювання, що характерні для тварини.",
  "Я хочу собі улюбленця, аби брати його з собою на соціальні заходи та навіть подорожі.",
  "Я можу приділити достатньо часу для прогулянок та ігор з тваринкою.",
  "Я хочу незвичайного улюбленця, який є нестандартним вибором для інших.",
];

export default function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentRating, setCurrentRating] = useState(5);
  const [showResults, setShowResults] = useState(false); // Додано стан для відображення результатів

  const handleNext = () => {
    // Додаємо поточну відповідь до масиву
    const newAnswers = [...answers, currentRating];
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentRating(5);
    } else {
      setShowResults(true); // Встановлюємо показ результатів
    }
  };
  console.log(answers);

  if (showResults) {
    const totalScore = answers.reduce((sum, answer) => sum + answer, 0);
    const maxScore = questions.length * 9;
    const percentage = Math.round((totalScore / maxScore * 100));

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Результати тесту</Text>
        
       
        
        <View style={styles.totalScore}>
          <Text style={styles.scoreText}>Загальний бал: {totalScore}/{maxScore}</Text>
          <Text style={styles.scoreText}>Відсоток: {percentage}%</Text>
        </View>
        
        <Button 
          title="Почати знову" 
          onPress={() => {
            setCurrentQuestion(0);
            setAnswers([]);
            setCurrentRating(5);
            setShowResults(false);
          }} 
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.question}>
        {questions[currentQuestion]}
      </Text>
      
      <View style={styles.sliderContainer}>
        <Text style={styles.ratingText}>
          Поточний вибір: {currentRating}
        </Text>
        
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={9}
          step={1}
          value={currentRating}
          onValueChange={setCurrentRating}
          minimumTrackTintColor="#1fb28a"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#1a9274"
        />
        
        <View style={styles.ratingLabels}>
          <Text>1 (Не погоджуюсь)</Text>
          <Text>5 (Середнє)</Text>
          <Text>9 (Повністю погоджуюсь)</Text>
        </View>
      </View>
      
      <Button
        title={currentQuestion < questions.length - 1 ? "Далі" : "Завершити"}
        onPress={handleNext}
      />
      
      <Text style={styles.counter}>
        Питання {currentQuestion + 1} з {questions.length}
      </Text>
    </View>
  );
}

// Стилі залишаються незмінними

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  question: {
    fontSize: 18,
    marginBottom: 40,
    textAlign: 'center',
  },
  counter: {
    textAlign: 'center',
    marginTop: 20,
  },
  sliderContainer: {
    marginBottom: 40,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  ratingText: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 20,
  },
  ratingLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  resultItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  questionText: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  totalScore: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#e0f7fa',
    borderRadius: 8,
  },
  scoreText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 5,
  },
});