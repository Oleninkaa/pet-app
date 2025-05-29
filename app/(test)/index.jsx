import { useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import axios from "axios";
import { theme } from "./../../constants/Colors";
import { TouchableOpacity } from "react-native";
import ButtonPressable from "../../components/ButtonPressable";

const questions = [
  "Я готовий доглядати за тваринкою, водити на грумінг, мити її місце, гуляти з нею.",
  "Я приймаю закони життя та розумію, що тваринка колись помре.",
  "Я можу забезпечити тваринці належні умови, такі як великий будинок та двір.",
  "Мені важливо знати про хронічні захворювання, що характерні для тварини.",
  "Я хочу собі улюбленця, аби брати його з собою на соціальні заходи та навіть подорожі.",
  "Я можу приділити достатньо часу для прогулянок та ігор з тваринкою.",
  "Я хочу незвичайного улюбленця, який є нестандартним вибором для інших.",
];

const RATING_VALUES = [1, 3, 5, 7, 9];

const getCircleStyle = (value, selected) => {
  const index = RATING_VALUES.indexOf(value);
  const size = 20 + index * 10;
  let color;
  switch (index) {
    case 0:
      color = theme.colors.gray;
      break;
    case 1:
      color = theme.colors.gray_light;
      break;

    case 2:
      color = theme.colors.primary;
      break;

    case 3:
      color = theme.colors.primary_light;
      break;

    case 4:
      color = theme.colors.accent;
      break;
    default:
      color = "#ccc";
  }

  return {
    width: size,
    height: size,
    borderRadius: size / 2,
    marginHorizontal: 8,
    borderWidth: 2,
    borderColor: selected ? color : "#ccc",
    backgroundColor: selected ? color : "transparent",
  };
};

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
      const response = await axios.post("http://10.0.2.2:5000/api/analyze", {
        answers: answers,
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
              <Text style={styles.podiumPetName}>
                {topPets[1].split(" (")[0]}
              </Text>
              <Text style={styles.podiumPercentage}>
                {parseFloat(topPets[1].split("(")[1].replace("%)", "")).toFixed(
                  1
                )}
                %
              </Text>
            </View>
          )}

          {/* Перше місце (центральний стовпець) */}
          {topPets[0] && (
            <View style={[styles.podiumItem, styles.firstPlace]}>
              <Text style={styles.podiumPlace}>1</Text>
              <Text style={styles.podiumPetName}>
                {topPets[0].split(" (")[0]}
              </Text>
              <Text style={styles.podiumPercentage}>
                {parseFloat(topPets[0].split("(")[1].replace("%)", "")).toFixed(
                  1
                )}
                %
              </Text>
            </View>
          )}

          {/* Третє місце (правий стовпець) */}
          {topPets[2] && (
            <View style={[styles.podiumItem, styles.thirdPlace]}>
              <Text style={styles.podiumPlace}>3</Text>
              <Text style={styles.podiumPetName}>
                {topPets[2].split(" (")[0]}
              </Text>
              <Text style={styles.podiumPercentage}>
                {parseFloat(topPets[2].split("(")[1].replace("%)", "")).toFixed(
                  1
                )}
                %
              </Text>
            </View>
          )}
        </View>

        {/* Інші тварини (якщо є) */}
        {result.ranking_with_percentages.length > 3 && (
          <>
            <Text style={styles.subTitle}>Інші варіанти:</Text>
            {result.ranking_with_percentages.slice(3).map((item, index) => {
              const parts = item.split(" (");
              const name = parts[0];
              const percentage = parseFloat(parts[1].replace("%)", "")).toFixed(
                1
              );
              return (
                <Text key={index + 3} style={styles.otherPetText}>
                  {index + 4}. {name} ({percentage}%)
                </Text>
              );
            })}
          </>
        )}
        <ButtonPressable
          text="Почати знову"
          onPress={() => {
            setCurrentQuestion(0);
            setAnswers([]);
            setCurrentRating(5);
            setShowResults(false);
            setResult(null);
          }}
          style={{ marginVertical: theme.spacing.large }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{questions[currentQuestion]}</Text>

      <View style={styles.sliderContainer}>
        <View>
          <View style={styles.scaleContainer}>
            <View style={styles.circlesRow}>
              {RATING_VALUES.map((value) => (
                <TouchableOpacity
                  key={value}
                  onPress={() => setCurrentRating(value)}
                  style={getCircleStyle(value, currentRating === value)}
                />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.agreementLabels}>
          <Text style={styles.agreementLabel}>Не погоджуюсь</Text>
          <Text style={styles.agreementLabel}>Повністю погоджуюсь</Text>
        </View>
      </View>
      <ButtonPressable
        text={currentQuestion < questions.length - 1 ? "Далі" : "Завершити"}
        onPress={handleNext}
        style={
          currentQuestion >= questions.length - 1 && {
            backgroundColor: theme.colors.accent,
          }
        }
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
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: theme.fontSize.xlarge,
    fontFamily: "inter-bold",
    marginBottom: 20,
    textAlign: "center",
    color: theme.colors.primary,
  },
  successMessage: {
    fontSize: theme.fontSize.medium,
    fontFamily: "inter-semiBold",
    textAlign: "center",
    color: theme.colors.primary_light,
    marginBottom: 20,
  },
  subTitle: {
    fontSize: theme.fontSize.large,
    fontFamily: "inter-semiBold",
    color: theme.colors.primary,
    marginTop: 20,
    marginBottom: 10,
  },
  question: {
    fontSize: theme.fontSize.large,
    fontFamily: "inter",
    marginBottom: theme.spacing.small,
    textAlign: "center",
    color: theme.colors.gray,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.small,
    borderRadius: theme.borderRadius.normal,
  },
  resultText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  criterionText: {
    fontSize: 16,
    marginBottom: 5,
  },
  sliderContainer: {
    display: "flex",
    marginBottom: 40,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  ratingText: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 20,
  },
  ratingLabels: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    flexWrap: "wrap",
    backgroundColor: "green",
  },
  counter: {
    textAlign: "center",
    marginTop: 20,
  },

  detailText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
    color: "#555",
  },

  podiumContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    height: 200,
    marginVertical: 20,
  },
  podiumItem: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    width: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  firstPlace: {
    height: 200,
    backgroundColor: theme.colors.accent,
  },
  secondPlace: {
    height: 160,
    backgroundColor: theme.colors.primary_light,
  },
  thirdPlace: {
    height: 120,
    backgroundColor: theme.colors.gray_ultra_light,
  },
  podiumPlace: {
    fontSize: theme.fontSize.xlarge,
    fontFamily: "inter-bold",
    textAlign: "center",
    color: theme.colors.white,
    marginBottom: 5,
  },
  podiumPetName: {
    fontSize: theme.fontSize.medium,
    fontFamily: "inter-semiBold",
    textAlign: "center",
    color: theme.colors.light,
  },
  podiumPercentage: {
    fontSize: theme.fontSize.small,
    fontFamily: "inter-semiBold",
    textAlign: "center",
    color: theme.colors.light,
    marginTop: 5,
  },
  otherPetText: {
    fontSize: theme.fontSize.medium,
    fontFamily: "inter-semiBold",
    textAlign: "center",
    color: theme.colors.gray,
    marginBottom: 10,
  },

  slider: {
    width: "100%",
    height: 40,
  },
  markerContainer: {
    position: "absolute",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    top: 10, // Підлаштуйте під ваш слайдер
    paddingHorizontal: 12, // Відповідає внутрішнім відступам слайдера
  },
  marker: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: theme.colors.accent,
  },
  ratingLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 10, // Щоб відповідало положенню міток
  },
  sliderContainer: {
    marginBottom: 40,
  },

  slider: {
    width: "100%",
    height: 40,
  },
  markerContainer: {
    position: "absolute",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    top: 18,
    paddingHorizontal: 12,
  },

  valueLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 8,
  },
  agreementLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  agreementLabel: {
    fontSize: theme.fontSize.medium,
    fontFamily: "inter",
    color: theme.colors.gray_light,
  },

  scaleContainer: {
    alignItems: "center",
    marginTop: theme.spacing.large,
  },
  circlesRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  scaleLabel: {
    fontSize: 14,
    color: "#4A4A4A",
    marginVertical: 4,
  },
});
