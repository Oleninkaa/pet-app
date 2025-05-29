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
import { useEffect, useState, useCallback } from "react";
import { useNavigation, useRouter } from "expo-router";
import { theme } from "../../constants/Colors";
import { Picker } from "@react-native-picker/picker";
import { db, storage } from "../../config/FirebaseConfig";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useUser } from "@clerk/clerk-expo";
import { useLocalSearchParams } from "expo-router";

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
  const [categoriesList, setCategoriesList] = useState([]);
  const [image, setImage] = useState(null);
  const [loader, setLoader] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [editMode, setEditMode] = useState(false);
  const [currentDocId, setCurrentDocId] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  // Initialize form only once when params change
  useEffect(() => {
    if (initialLoad && params.editMode === "true") {
      setEditMode(true);
      setCurrentDocId(params.id);
      setFormData({
        name: params.name || "",
        category: params.category || "Dogs",
        breed: params.breed || "",
        age: params.age || "",
        sex: params.sex || "Male",
        weight: params.weight || "",
        address: params.address || "",
        about: params.about || "",
      });

      if (params.imageUrl) {
        setImage(decodeURI(params.imageUrl));
      }

      navigation.setOptions({ headerTitle: "Edit Pet" });
      setInitialLoad(false);
    }
  }, [params]);

  const getCategories = async () => {
    const snapshot = await getDocs(collection(db, "Category"));
    const categories = snapshot.docs.map((doc) => doc.data());
    setCategoriesList(categories);
  };

  // Stable callback for input changes
  const handleInputChange = useCallback((fieldName, fieldValue) => {
    setFormData((prev) => ({ ...prev, [fieldName]: fieldValue }));
  }, []);

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
      headerTitle: editMode ? "Edit Pet" : "Add New Pet",
      headerBackVisible: true,
    });
    getCategories();
  }, [editMode]);

  const onSubmit = () => {
    if (
      !formData.name ||
      !formData.breed ||
      !formData.age ||
      !formData.weight ||
      !formData.address ||
      !formData.about
    ) {
      ToastAndroid.show("Please fill all fields", ToastAndroid.SHORT);
      return;
    }

    if (editMode && image === null) {
      SaveFromData(null);
    } else if (!image) {
      ToastAndroid.show("Please select an image", ToastAndroid.SHORT);
    } else {
      UploadImage();
    }
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

  const SaveFromData = async (imageUrl) => {
    try {
      const petData = {
        ...formData,
        username: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        userImage: user?.imageUrl,
      };

      if (imageUrl) {
        petData.imageUrl = imageUrl;
      } else if (editMode && params.imageUrl) {
        petData.imageUrl = params.imageUrl;
      }

      if (editMode) {
        await updateDoc(doc(db, "Pets", currentDocId), petData);
        ToastAndroid.show("Pet updated successfully", ToastAndroid.SHORT);
      } else {
        const docId = Date.now().toString();
        petData.id = docId;
        await setDoc(doc(db, "Pets", docId), petData);
        ToastAndroid.show("Pet added successfully", ToastAndroid.SHORT);
      }

      resetForm();
      router.replace("/(tabs)/home");
    } catch (error) {
      console.error("Error saving data: ", error);
      ToastAndroid.show("Error saving pet data", ToastAndroid.SHORT);
    } finally {
      setLoader(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setImage(null);
    setEditMode(false);
    setCurrentDocId(null);
    setInitialLoad(true);
  };

  return (
    <ScrollView style={styles.wrapper}>
      <Text style={styles.header}>{editMode ? "Edit Pet" : "Add New Pet"}</Text>

      <Pressable onPress={imagePicker}>
        {image ? (
          <Image style={styles.image} source={{ uri: image }} />
        ) : (
          <Image
            style={styles.image}
            source={require("./../../assets/images/paw.jpg")}
          />
        )}
      </Pressable>

      <Text style={styles.imageText}>Press to add image</Text>

      <TouchableOpacity onPress={resetForm} style={styles.clearForm}>
        <Text style={styles.clearFormText}>Clear form</Text>
      </TouchableOpacity>

      {/* All your form fields remain the same, but with stable handlers */}
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
        <View style={styles.pickerContainer}>
          {" "}
          {/* Wrapper View */}
          <Picker
            selectedValue={formData.category}
            onValueChange={(itemValue) => {
              setSelectedCategory(itemValue);
              handleInputChange("category", itemValue);
            }}
            style={styles.picker}
            dropdownIconColor={theme.colors.primary} // Style the dropdown icon
          >
            {categoriesList.map((category, index) => (
              <Picker.Item
                key={index}
                label={category.name}
                value={category.name}
                style={styles.pickerItem}
              />
            ))}
          </Picker>
        </View>
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
        <View style={styles.pickerContainer}>
          {" "}
          {/* Wrapper View */}
          <Picker
            selectedValue={formData.sex}
            onValueChange={(itemValue) => {
              setGender(itemValue);
              handleInputChange("sex", itemValue);
            }}
            style={styles.picker}
            dropdownIconColor={theme.colors.primary} // Style the dropdown icon
          >
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
          </Picker>
        </View>
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
          <Text style={styles.buttonText}>
            {editMode ? "Update" : "Submit"}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: theme.spacing.large,
    backgroundColor: theme.colors.light,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.colors.gray_ultra_light,
    borderRadius: theme.borderRadius.normal,
    overflow: "hidden", // This is crucial for the border radius to work
  },
  picker: {
    width: "100%",
    height: 50,
    backgroundColor: theme.colors.white,
    color: theme.colors.primary,
  },
  pickerItem: {
    fontFamily: "inter-semiBold",
    fontSize: theme.fontSize.medium,
  },
  header: {
    fontFamily: "inter-bold",
    fontSize: theme.fontSize.large,
    color: theme.colors.primary_light,
    paddingBottom: theme.spacing.medium,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: theme.borderRadius.circle,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    marginBottom: theme.spacing.small,
    alignSelf: "center",
  },
  inputContainer: {
    marginVertical: theme.spacing.small,
  },
  input: {
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.normal,
    borderWidth: 1,
    borderColor: theme.colors.gray_ultra_light,
  },
  label: {
    marginVertical: theme.spacing.xSmall,
    fontFamily: "inter-semiBold",
    color: theme.colors.primary_light,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.large,
    paddingVertical: theme.spacing.small,
    borderRadius: theme.borderRadius.normal,
    marginVertical: theme.spacing.xLarge,
  },
  buttonText: {
    fontFamily: "inter-semiBold",
    color: theme.colors.white,
    fontSize: theme.fontSize.large,
    textAlign: "center",
  },

  clearForm: {
    marginHorizontal: "auto",
  },

  imageText: {
    color: theme.colors.gray_light,
    textAlign: "center",
    fontSize: theme.fontSize.small,
    fontFamily: "inter",
    marginBottom: theme.spacing.medium,
  },
  clearFormText: {
    color: theme.colors.primary_light,
    textAlign: "center",
    fontSize: theme.fontSize.medium,
    fontFamily: "inter",
  },
});
