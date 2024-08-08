import React, {
  useState,
  useLayoutEffect,
  useEffect,
  useCallback,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { axi } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfessionalBackground = () => {
  const navigation = useNavigation();
  const { authState } = useAuth();
  const route = useRoute();
  const { id } = route.params;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentOccupation: "",
    linkedinUrl: "",
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
    });
  }, [navigation]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const auth = await authState.authenticated;
        if (!auth) {
          navigation.navigate("auth/mainAuth/signin");
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${authState.token}` };
        const response = await axi.get(`/pitch/get-pitch/${id}`, { headers });
        const data = response.data.pitch.professional_background;
        setFormData({
          currentOccupation: data.current_occupation,
          linkedinUrl: data.linkedin_url,
        });
      } catch (error) {
        console.error(error);
      }
    };

    checkAuth();
    fetchData();
  }, [authState, id, navigation]);

  const validateForm = () => {
    const { currentOccupation, linkedinUrl } = formData;

    if (!currentOccupation || !linkedinUrl) {
      Alert.alert("Validation Error", "All fields are required.");
      return false;
    }
    return true;
  };

  const submitHandler = useCallback(async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${authState.token}` };
      await axi.patch(
        `/pitch/update-pitch/${id}/professional_background`,
        formData,
        { headers }
      );
      Alert.alert("Success", "Your professional background has been saved.");
      navigation.navigate("updateform/competition", { id });
    } catch (error) {
      if (error.response) {
        const statusCode = error.response.status;
        if (statusCode === 400) {
          Alert.alert("Update Error", "Try again later.");
        } else if (statusCode === 401) {
          navigation.navigate("auth/mainAuth/signin");
        } else if (statusCode === 422) {
          Alert.alert("Update failed", "Make sure to input the right entries.");
        } else if (statusCode === 404) {
          Alert.alert("Pitch not found");
        } else {
          Alert.alert("Update Error", "Try again later.");
        }
      } else {
        Alert.alert(
          "Login Failed",
          "Network error. Please check your internet connection."
        );
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [authState.token, formData, id, navigation]);

  const handleChange = (name, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
      
      <View style={styles.container}>
         
        <ScrollView >
          <SafeAreaView>
          <View style={styles.questionsContainer}>
            <View style={styles.question}>
              <Text style={styles.boldText}>Current Occupation</Text>
              <TextInput
                style={styles.textArea}
                textAlignVertical="top"
                placeholder="Current Occupation"
                value={formData.currentOccupation}
                onChangeText={(newText) =>
                  handleChange("currentOccupation", newText)
                }
              />
            </View>
            <View style={styles.question}>
              <Text style={styles.boldText}>LinkedIn URL</Text>
              <TextInput
                style={styles.textArea}
                textAlignVertical="top"
                placeholder="LinkedIn URL"
                value={formData.linkedinUrl}
                onChangeText={(newText) => handleChange("linkedinUrl", newText)}
              />
            </View>
          </View>
          </SafeAreaView>
        </ScrollView>
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={submitHandler}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.actionButtonText}>Save and continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
  );
};

export default ProfessionalBackground;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 30,
    paddingVertical: 30
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100, // Ensure there's space for the button
    height: "60%",
    marginTop:20
  },
  pageLinks: {
    display: "flex",
    paddingTop: 6,
    flexDirection: "row",
    marginBottom: 100,
  },
  pageLinkText: {
    fontSize: 13,
    color: "grey",
    marginHorizontal: 10,
  },
  activePageLinkText: {
    fontSize: 13,
    color: "#196100",
  },
  question: {
    marginBottom: 20,
  },
  boldText: {
    fontWeight: "bold",
  },
  textArea: {
    height: "auto",
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
  },
  actionButtonContainer: {
    padding: 20,
    backgroundColor: "white",
    bottom: 10,
  },
  actionButton: {
    backgroundColor: "#196100",
    borderRadius: 100,
    paddingVertical: 15,
    alignItems: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
