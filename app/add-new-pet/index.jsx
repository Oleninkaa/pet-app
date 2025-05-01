import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Pressable,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { theme } from "../../constants/Colors"
import { Picker } from "@react-native-picker/picker";
import { db, storage } from "../../config/FirebaseConfig";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useUser } from "@clerk/clerk-expo";

// Initial form state
const initialFormData = {
  name: "",
  category: "Dogs",
  breed: "",
  age: "",
  sex: "Male",
  weight: "",
  address: "",
  about: "",
};

export default function AddNewPet() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState(initialFormData);
  const [gender, setGender] = useState("Male");
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Dogs");
  const [image, setImage] = useState(null);
  const [loader, setLoader] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const handleInputChange = (fieldName, fieldValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const getCategories = async () => {
    const snapshot = await getDocs(collection(db, "Category"));
    const categories = snapshot.docs.map((doc) => doc.data());
    setCategoriesList(categories);
  };

  const imagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Add New Pet",
      headerBackVisible: true,
    });
    getCategories();
  }, []);

  const onSubmit = () => {
    if (
      Object.keys(formData).length != 8 ||
      !formData.name ||
      !formData.breed ||
      !formData.age ||
      !formData.weight ||
      !formData.address ||
      !formData.about ||
      !image
    ) {
      ToastAndroid.show("Please fill all fields", ToastAndroid.SHORT);
      return;
    }
    UploadImage();
  };

  const UploadImage = async () => {
    setLoader(true);
    try {
      const response = await fetch(image);
      const blobImage = await response.blob();
      const storageRef = ref(storage, "/PetAdopt/" + Date.now() + ".jpg");

      await uploadBytes(storageRef, blobImage);
      const downloadUrl = await getDownloadURL(storageRef);
      await SaveFromData(downloadUrl);
    } catch (error) {
      console.error("Error uploading image: ", error);
      setLoader(false);
      ToastAndroid.show("Error uploading image", ToastAndroid.SHORT);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setImage(null);
    setSelectedCategory("Dogs");
    setGender("Male");
  };

  const SaveFromData = async (imageUrl) => {
    try {
      const docId = Date.now().toString();
      await setDoc(doc(db, "Pets", docId), {
        ...formData,
        imageUrl: imageUrl,
        username: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        userImage: user?.imageUrl,
        id: docId,
      });

      // Reset form after successful submission
      resetForm();

      setLoader(false);
      router.replace("/(tabs)/home");
    } catch (error) {
      console.error("Error saving data: ", error);
      setLoader(false);
      ToastAndroid.show("Error saving pet data", ToastAndroid.SHORT);
    }
  };

  return (
    <ScrollView style={styles.wrapper}>
      <Text style={styles.header}>Add new pet for adoption</Text>
      <Pressable onPress={imagePicker}>
        {!image ? (
          <Image
            style={styles.image}
            source={require("./../../assets/images/paw.jpg")}
          />
        ) : (
          <Image style={styles.image} source={{ uri: image }} />
        )}
      </Pressable>

      <TouchableOpacity onPress={resetForm} style={styles.clearForm}>
        <Text style={styles.clearFormText}>{"Clear form"}</Text>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pet Name *</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleInputChange("name", value)}
          value={formData.name}
          placeholder="Enter pet name"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pet Category *</Text>
        <Picker
          selectedValue={formData.category}
          onValueChange={(itemValue) => {
            setSelectedCategory(itemValue);
            handleInputChange("category", itemValue);
          }}
          style={styles.input}
        >
          {categoriesList.map((category, index) => (
            <Picker.Item
              key={index}
              label={category.name}
              value={category.name}
            />
          ))}
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Breed *</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleInputChange("breed", value)}
          value={formData.breed}
          placeholder="Enter breed"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Age *</Text>
        <TextInput
          keyboardType="number-pad"
          style={styles.input}
          onChangeText={(value) => handleInputChange("age", value)}
          value={formData.age}
          placeholder="Enter age in years"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Gender *</Text>
        <Picker
          selectedValue={formData.sex}
          onValueChange={(itemValue) => {
            setGender(itemValue);
            handleInputChange("sex", itemValue);
          }}
          style={styles.input}
        >
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Weight *</Text>
        <TextInput
          keyboardType="number-pad"
          style={styles.input}
          onChangeText={(value) => handleInputChange("weight", value)}
          value={formData.weight}
          placeholder="Enter weight in kg"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Address *</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleInputChange("address", value)}
          value={formData.address}
          placeholder="Enter your address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>About *</Text>
        <TextInput
          style={styles.input}
          numberOfLines={5}
          multiline={true}
          onChangeText={(value) => handleInputChange("about", value)}
          value={formData.about}
          placeholder="Tell us about the pet"
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        disabled={loader}
        onPress={onSubmit}
      >
        {loader ? (
          <ActivityIndicator size={"large"} color="white" />
        ) : (
          <Text style={styles.buttonText}>Submit</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
  },
  header: {
    fontFamily: "montserrat-medium",
    fontSize: 20,
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: theme.colors.grey,
    marginBottom: 20,
    alignSelf: "center",
  },
  inputContainer: {
    marginVertical: 10,
    fontFamily: "monserrat",
  },
  input: {
    padding: 12,
    backgroundColor: theme.colors.white,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: theme.colors.grey,
  },
  label: {
    marginVertical: 5,
    fontFamily: "montserrat-medium",
  },
  button: {
    padding: 15,
    backgroundColor: theme.colors.primary,
    borderRadius: 7,
    marginVertical: 20,
    marginBottom: 50,
  },
  buttonText: {
    fontFamily: "montserrat-medium",
    textAlign: "center",
    color: "white",
  },
  clearForm: {
    backgroundColor: theme.colors.gray,
    width: 100,
    borderRadius: 7,
    marginHorizontal: "auto",
  },
  clearFormText: {
    color: theme.colors.primary_light,
    textAlign: "center",
    padding: 10,
  },
});
