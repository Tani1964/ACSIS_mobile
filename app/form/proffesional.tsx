import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { axi } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext";

const Proffessional = () => {
  const navigation = useNavigation();
  const route = useRoute();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
    });
  }, [navigation]);
  
  const { id } = route.params || {}; // Default to an empty object to avoid destructuring undefined
 
  const { authState } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentOccupation: "",
    linkedinUrl: "",
  });

  useEffect(() => {
    if (!id) {
      console.log("ID not found in route params");
    }
  }, [route.params]);

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
    checkAuth();
  }, [authState.authenticated, navigation]);

  const handleChange = (name, value) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const submitHandler = async () => {
    setLoading(true);
    const headers = { Authorization: `Bearer ${authState.token}`, "ngrok-skip-browser-warning": "true" };
    try {

      const response = await axi.patch(`/pitch/update-pitch/${id}/professional_background`, formData, {
        headers,
      });
      Alert.alert("Success", "Your professional information has been saved.");
      navigation.navigate("form/competition", {id:id});
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
        Alert.alert("Update failed", "Network error. Please check your internet connection.");
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          {/* Page links */}
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
            }}
          >
            <View style={styles.header}>
              <Text style={styles.headerText}>
                Personal Information{" "}
                <AntDesign name="right" size={13} color="black" />
              </Text>
              <Text style={[styles.headerText, styles.activeHeaderText]}>
                Professional Background{" "}
                <AntDesign name="right" size={13} color="black" />
              </Text>
              <Text style={styles.headerText}>
                Competition Questions{" "}
                <AntDesign name="right" size={15} color="black" />
              </Text>
              <Text style={styles.headerText}>
              Technical Questions{" "}
              <AntDesign name="right" size={13} color="black" />
            </Text>
            </View>
          </ScrollView>
          {/* Questions */}
          <View style={styles.questionsContainer}>
            <View style={styles.inputContainer}>
              <AntDesign name="user" size={24} color="lightgrey" />
              <TextInput
                style={styles.inputField}
                placeholder="Current Occupation"
                onChangeText={(newText) =>
                  handleChange("currentOccupation", newText)
                }
                value={formData.currentOccupation}
              />
            </View>
            <View style={styles.inputContainer}>
              <AntDesign name="linkedin-square" size={24} color="lightgrey" />
              <TextInput
                style={styles.inputField}
                placeholder="LinkedIn URL e.g 'https://gg.com'"
                onChangeText={(newText) => handleChange("linkedinUrl", newText)}
                value={formData.linkedinUrl}
              />
            </View>
          </View>
        </View>
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

export default Proffessional;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100, // Ensure there's space for the button
    paddingTop: 30,
  },
  innerContainer: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 13,
    color: "grey",
    marginHorizontal: 10,
  },
  activeHeaderText: {
    color: "#196100",
  },
  questionsContainer: {
    flexDirection: "column",
    gap: 20,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionTitle: {
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
  highlight: {
    color: "#196100",
  },
  actionButtonContainer: {
    padding: 15,
    backgroundColor: "white",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderColor: "lightgrey",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
  },
  inputField: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  actionButton: {
    backgroundColor: "#196100",
    borderRadius: 100,
    paddingVertical: 15,
    alignItems: "center",
  },
});
