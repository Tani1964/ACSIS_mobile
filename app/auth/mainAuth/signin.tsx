import {
  StyleSheet,
  Text,
  View,
  Image,
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
import * as SecureStore from 'expo-secure-store';

const Signin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const submitHandler = async () => {
    setLoading(true);
    try {
      const response = await axi.post("/auth/login", formData);
      await SecureStore.setItemAsync('token', response?.data?.token);
      await SecureStore.setItemAsync('authenticated', 'true');
      navigation.navigate("form/index");
    } catch (error) {
      await SecureStore.setItemAsync('authenticated', 'false'); // Ensure this is set to false on failure
      Alert.alert("Login Failed", "Please check your email and password.");
      console.log(error);
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
                setFormData((prevState) => ({ ...prevState, email: newText }))
              }
              defaultValue={formData.email}
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={24} color="lightgrey" />
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
              secureTextEntry={true}
            />
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("/auth/mainAuth/forgotPassword")}
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
          <TouchableOpacity
            style={styles.googleButton}
            onPress={() => {
              /* Google Signin action */
            }}
          >
            <Image
              source={require("../../../assets/images/google-logo.png")}
              style={styles.googleLogo}
            />
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
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
  headerImage: {
    resizeMode: "contain",
    marginBottom: 20,
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
  googleButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    borderRadius: 25,
    borderColor: "lightgrey",
    borderWidth: 1,
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#196100",
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
