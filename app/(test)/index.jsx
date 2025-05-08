import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import axios from 'axios';

const questions = [
  "Складність догляду (1 - простий, 9 - складний)",
  "Тривалість життя (1 - коротка, 9 - довга)",
  "Адаптивність до життя в помешканні (1 - погана, 9 - відмінна)",
  "Медичні ризики (1 - високі, 9 - низькі)",
  "Соціальна активність (1 - низька, 9 - висока)",
  "Потреба у вигулюванні (1 - мінімальна, 9 - висока)",
  "Популярність (1 - рідкісна, 9 - популярна)"
];

export default function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentRating, setCurrentRating] = useState(5);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const sendResultsToServer = async (answers) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://10.0.2.2:5000/api/analyze', {
        answers: answers
      });
      
      if (response.data.status === "success") {
        setResult(response.data);
        Alert.alert("Успіх", response.data.message);
      } else {
        Alert.alert("Помилка", response.data.message);
      }
      
    } catch (error) {
      console.error(error);
      Alert.alert("Помилка", "Не вдалося зв'язатись з сервером");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    const newAnswers = [...answers, currentRating];
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentRating(5);
    } else {
      sendResultsToServer(newAnswers);
      setShowResults(true);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Аналізуємо ваші відповіді...</Text>
      </View>
    );
  }

  if (showResults && result) {
    // Отримуємо топ-3 тварин з відсотками
    const topPets = result.ranking_with_percentages.slice(0, 3);
    
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Результати аналізу</Text>
        
        <Text style={styles.successMessage}>{result.message}</Text>
        
        {/* П'єдестал */}
        <View style={styles.podiumContainer}>
          {/* Друге місце (лівий стовпець) */}
          {topPets[1] && (
            <View style={[styles.podiumItem, styles.secondPlace]}>
              <Text style={styles.podiumPlace}>2</Text>
              <Text style={styles.podiumPetName}>{topPets[1].split(' (')[0]}</Text>
              <Text style={styles.podiumPercentage}>
                {parseFloat(topPets[1].split('(')[1].replace('%)', '')).toFixed(1)}%
              </Text>
            </View>
          )}
          
          {/* Перше місце (центральний стовпець) */}
          {topPets[0] && (
            <View style={[styles.podiumItem, styles.firstPlace]}>
              <Text style={styles.podiumPlace}>1</Text>
              <Text style={styles.podiumPetName}>{topPets[0].split(' (')[0]}</Text>
              <Text style={styles.podiumPercentage}>
                {parseFloat(topPets[0].split('(')[1].replace('%)', '')).toFixed(1)}%
              </Text>
            </View>
          )}
          
          {/* Третє місце (правий стовпець) */}
          {topPets[2] && (
            <View style={[styles.podiumItem, styles.thirdPlace]}>
              <Text style={styles.podiumPlace}>3</Text>
              <Text style={styles.podiumPetName}>{topPets[2].split(' (')[0]}</Text>
              <Text style={styles.podiumPercentage}>
                {parseFloat(topPets[2].split('(')[1].replace('%)', '')).toFixed(1)}%
              </Text>
            </View>
          )}
        </View>
        
        {/* Інші тварини (якщо є) */}
        {result.ranking_with_percentages.length > 3 && (
          <>
            <Text style={styles.subTitle}>Інші варіанти:</Text>
            {result.ranking_with_percentages.slice(3).map((item, index) => {
              const parts = item.split(' (');
              const name = parts[0];
              const percentage = parseFloat(parts[1].replace('%)', '')).toFixed(1);
              return (
                <Text key={index + 3} style={styles.otherPetText}>
                  {index + 4}. {name} ({percentage}%)
                </Text>
              );
            })}
          </>
        )}
        
        <Button 
          title="Почати знову" 
          onPress={() => {
            setCurrentQuestion(0);
            setAnswers([]);
            setCurrentRating(5);
            setShowResults(false);
            setResult(null);
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
          step={2}
          value={currentRating}
          onValueChange={setCurrentRating}
          minimumTrackTintColor="#1fb28a"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#1a9274"
        />
        
        <View style={styles.ratingLabels}>
          <Text>1</Text>
          <Text>5</Text>
          <Text>9</Text>
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
  successMessage: {
    fontSize: 18,
    color: 'green',
    textAlign: 'center',
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  question: {
    fontSize: 18,
    marginBottom: 40,
    textAlign: 'center',
  },
  resultText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  criterionText: {
    fontSize: 16,
    marginBottom: 5,
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
  counter: {
    textAlign: 'center',
    marginTop: 20,
  },

  detailText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    color: '#555',
  },

  podiumContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 200,
    marginVertical: 20,
  },
  podiumItem: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    width: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  firstPlace: {
    height: 180,
    backgroundColor: '#FFD700', // золотий
  },
  secondPlace: {
    height: 140,
    backgroundColor: '#C0C0C0', // срібний
  },
  thirdPlace: {
    height: 100,
    backgroundColor: '#CD7F32', // бронзовий
  },
  podiumPlace: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  podiumPetName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  podiumPercentage: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },
  otherPetText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
});