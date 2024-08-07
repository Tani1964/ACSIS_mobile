import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import React, { useState, useLayoutEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { axi, useAuth } from "@/app/context/AuthContext";
import { useNavigation } from '@react-navigation/native';

const Signup = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
    });
  }, [navigation]);

  const submitHandler = async () => {
    setLoading(true);
    try {
      const response = await axi.post("/auth/register", {email, fullName, password});
      if (response.error) {
        alert(response.msg);
      } else {
        navigation.navigate('auth/mainAuth/confirmationCode', { email }); // Pass email as parameter
      }
    } catch (error) {
      console.log(error);
      alert('An error occurred. Please try again.');
    } finally{
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Image source={require("../../../assets/images/PNG File 1.png")} style={styles.headerImage} />
          <Text style={styles.headerTitle}>Ready to Pitch your Ideas?</Text>
          <Text style={styles.headerSubtitle}>Enter your details to create your account</Text>
        </View>

        {/* Inputs */}
        <View style={styles.inputsContainer}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={24} color="lightgrey" />
            <TextInput
              style={styles.inputField}
              placeholder="Full name"
              onChangeText={(newText) => setFullName(newText)}
              value={fullName}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={24} color="lightgrey" />
            <TextInput
              style={styles.inputField}
              placeholder="Email address"
              onChangeText={(newText) => setEmail(newText)}
              value={email}
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={24} color="lightgrey" />
            <TextInput
              style={styles.inputField}
              placeholder="Password"
              onChangeText={(newText) => setPassword(newText)}
              value={password}
              secureTextEntry={true}
            />
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.signupButton}
            onPress={submitHandler}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{color: "white"}}>Sign Up</Text>
            )}
          </TouchableOpacity>
          {/* <TouchableOpacity */}
            {/* // style={styles.googleButton} */}
            {/* // onPress={() => { */}
            {/* // }} */}
          {/* // > */}
            {/* // <Text style={styles.googleButtonText}>Sign up with Google</Text> */}
          {/* // </TouchableOpacity> */}
        </View>

        {/* Links */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            Already have an account? <Link href="/auth/mainAuth/signin" style={styles.signinLink}>Sign in</Link>
          </Text>
          <Text style={styles.footerNote}>
            By creating an account you agree to ACSS & PITCH's <Link href="/auth/mainAuth/terms." style={styles.footerLink}>Privacy policy</Link> and <Link href="auth/mainAuth/terms" style={styles.footerLink}>Terms of use</Link>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Signup;

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
    alignItems: "center",
    marginBottom: 30,
  },
  headerImage: {
    resizeMode: "contain",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: "center",
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
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  signupButton: {
    width: "100%",
    backgroundColor: "#196100",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  signupButtonText: {
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
  signinLink: {
    color: "#196100",
    fontWeight: "bold",
  },
  footerNote: {
    fontSize: 12,
    color: "grey",
    textAlign: "center",
    marginTop: 10,
  },
  footerLink: {
    color: "#196100",
  },
});