import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState, useLayoutEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { axi } from "@/app/context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";

const CreateNew = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { email } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
    });
  }, [navigation]);

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
    verificationCode: "",
  });

  const submit = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    if (!formData.newPassword || !formData.confirmPassword || !formData.verificationCode) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      const response = await axi.patch(`/user/password/update-user-password`, {
        email: email,
        newPassword: formData.newPassword,
        verificationCode: formData.verificationCode,
      });

      if (response.status === 200) {
        navigation.navigate("auth/forgotPassword/success");
      } else {
        Alert.alert("Error", "Unexpected response from the server.");
      }
    } catch (error) {
      if (error.response) {
        const statusCode = error.response.status;
        const errorMessage =
          (error.response.data && error.response.data.message) || "An unexpected error occurred.";

        switch (statusCode) {
          case 400:
          case 422:
            Alert.alert("Error", errorMessage || "Invalid input. Please check your data.");
            break;
          case 401:
            Alert.alert("Error", errorMessage || "Unauthorized access. Please check your credentials.");
            break;
          case 403:
            Alert.alert("Error", errorMessage || "Access forbidden. Please contact support.");
            break;
          case 404:
            Alert.alert("Error", errorMessage || "User not found.");
            break;
          default:
            Alert.alert("Error", errorMessage || "An unexpected error occurred. Please try again.");
            break;
        }
      } else if (error.request) {
        Alert.alert("Error", "No response from the server. Please try again later.");
      } else {
        Alert.alert("Error", "Network error. Please check your internet connection.");
      }

      console.error("Password update error:", error);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.headerTitle}>Create a new password</Text>
          <Text style={styles.headerSubtitle}>
            Create a new password. You’ll need this password to log into your
            account.
          </Text>

          {/* New Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={24} color="lightgrey" />
            <TextInput
              style={styles.inputField}
              placeholder="New password"
              onChangeText={(newText) =>
                setFormData((prevState) => ({
                  ...prevState,
                  newPassword: newText,
                }))
              }
              value={formData.newPassword}
              secureTextEntry={true}
            />
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={24} color="lightgrey" />
            <TextInput
              style={styles.inputField}
              placeholder="Confirm new password"
              onChangeText={(newText) =>
                setFormData((prevState) => ({
                  ...prevState,
                  confirmPassword: newText,
                }))
              }
              value={formData.confirmPassword}
              secureTextEntry={true}
            />
          </View>

          {/* Verification Code Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="Verification Code"
              onChangeText={(newText) =>
                setFormData((prevState) => ({
                  ...prevState,
                  verificationCode: newText,
                }))
              }
              value={formData.verificationCode}
              secureTextEntry={true}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.verifyButton} onPress={submit}>
            <Text style={styles.verifyButtonText}>Create new password</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateNew;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: "left",
    color: "grey",
    marginBottom: 30,
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
  verifyButton: {
    backgroundColor: "#196100",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  verifyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
