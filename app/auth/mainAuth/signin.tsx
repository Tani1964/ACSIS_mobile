import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState, useLayoutEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { axi } from "@/app/context/AuthContext";
import { useAuth } from "@/app/context/AuthContext";
import * as SecureStore from "expo-secure-store";

const Signin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
  const navigation = useNavigation();
  const { setAuthState } = useAuth();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
    });
  }, [navigation]);

  const submitHandler = async () => {
    setLoading(true);
    try {
      const response = await axi.post("/auth/login", formData);
      await SecureStore.setItemAsync("authToken", response.data.token); // Ensure consistent key
      const token = await SecureStore.getItemAsync("authToken"); // Ensure consistent key
      setAuthState({
        token: token,
        authenticated: true,
      });
      navigation.navigate("index");
      console.log("Token stored and state set:", token);
    } catch (error) {
      if (error.response) {
        const statusCode = error.response.status;
        if (statusCode === 400 || statusCode === 422) {
          Alert.alert("Login Failed", "Invalid email or password.");
        } else if (statusCode === 401) {
          Alert.alert(
            "Login Failed",
            "Unauthorized access. Please check your credentials."
          );
        } else if (statusCode === 403) {
          Alert.alert(
            "Login Failed",
            "Access forbidden. Please contact support."
          );
        } else if (statusCode === 404) {
          Alert.alert("Login Failed", "User not found.");
        } else {
          Alert.alert(
            "Login Failed",
            "An unexpected error occurred. Please try again."
          );
        }
      } else {
        Alert.alert(
          "Login Failed",
          "Network error. Please check your internet connection."
        );
      }
      console.log("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Welcome Back!</Text>
            <Text style={styles.headerSubtitle}>
              Enter your email to sign into your account
            </Text>
          </View>

          <View style={styles.inputsContainer}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={24} color="lightgrey" />
              <TextInput
                style={styles.inputField}
                placeholder="Email address"
                onChangeText={(newText) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    email: newText.toLowerCase(),
                  }))
                }
                defaultValue={formData.email}
                keyboardType="email-address"
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={24}
                color="lightgrey"
              />
              <TextInput
                style={styles.inputField}
                placeholder="Password"
                onChangeText={(newText) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    password: newText,
                  }))
                }
                defaultValue={formData.password}
                secureTextEntry={!passwordVisible} // Toggle secureTextEntry
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Ionicons
                  name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color="lightgrey"
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("auth/forgotPassword/forgotPassword")
              }
            >
              <Text style={styles.forgotPassword}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.signinButton}
              onPress={submitHandler}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.signinButtonText}>Sign in</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              Don't have an account?{" "}
              <Link href="/auth/mainAuth/signup" style={styles.signupLink}>
                Sign up
              </Link>
            </Text>
          </View>
        </View>
    </ScrollView>
  );
};

export default Signin;

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
    justifyContent: "center",
  },
  headerContainer: {
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: "left",
    color: "grey",
  },
  inputsContainer: {
    width: "100%",
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
  forgotPassword: {
    alignSelf: "flex-start",
    color: "grey",
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  signinButton: {
    width: "100%",
    backgroundColor: "#196100",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  signinButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "grey",
    textAlign: "center",
  },
  signupLink: {
    color: "#196100",
    fontWeight: "bold",
  },
});
