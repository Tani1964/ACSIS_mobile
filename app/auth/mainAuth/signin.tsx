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
  Button
} from "react-native";
import React, { useState, useLayoutEffect, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { axi } from "@/app/context/AuthContext";
import { useAuth } from "@/app/context/AuthContext";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import * as SecureStore from "expo-secure-store";

const signin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { authState, setAuthState } = useAuth();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
    });
  }, [navigation]);

  // useEffect(() => {
  //   configureGoogleSignIn();
  // }, []);

  // const configureGoogleSignIn = () => {
  //   GoogleSignin.configure({
  //     webClientId: '1077796380960-nvmijg1o0975tfq11j5tpiejjm6bfvqr.apps.googleusercontent.com',
  //     androidClientId:"1077796380960-p35pbur9rtjmjnuo4209r108d50ilesu.apps.googleusercontent.com",
  //     iosClientId:"1077796380960-mv6j98d90g6gjfpjrt41folnoqrk2ppt.apps.googleusercontent.com",
  //     // offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  //   });
  // };

  const submitHandler = async () => {
    setLoading(true);
    try {
      const response = await axi.post("/auth/login", formData);
      await SecureStore.setItemAsync("token", response.data.token);
      const token = await SecureStore.getItemAsync("token")
      await setAuthState({
        token: token ,
        authenticated: true,
      });
      navigation.navigate("index");
      console.log("ghhhh")
      console.log(token)
    } catch (error) {
      Alert.alert("Login Failed", "Please check your email and password.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // const googleSignIn = async () => {
  //   setLoading(true);
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const userInfo = await GoogleSignin.signIn();
  //     const response = await axi.post("/auth/google-login", {
  //       idToken: userInfo.idToken,
  //     });
  //     await setAuthState({
  //       token: response.data.token,
  //       authenticated: true,
  //     });
  //     navigation.navigate("form/index");
  //   } catch (error) {
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       Alert.alert("Login Cancelled", "Google Sign-In was cancelled.");
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       Alert.alert("Login In Progress", "Google Sign-In is in progress.");
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       Alert.alert("Play Services Error", "Play services not available or outdated.");
  //     } else {
  //       Alert.alert("Login Failed", "An error occurred during Google Sign-In.");
  //     }
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
            onPress={() => navigation.navigate("auth/forgotPassword/forgotPassword")}
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
          {/* <TouchableOpacity
            style={styles.googleButton}
            onPress={googleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="black" />
            ) : (
              <>
                <Image
                  source={require("../../../assets/images/google-logo.png")}
                  style={styles.googleLogo}
                />
                <Text style={styles.googleButtonText}>Sign in with Google</Text>
              </>
            )}
          </TouchableOpacity> */}
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

export default signin;

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
