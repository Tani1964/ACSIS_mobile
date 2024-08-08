import React, { useState, useLayoutEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { axi } from "@/app/context/AuthContext";

const ConfirmationCode = () => {
  const [code, setCode] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
    });
  }, [navigation]);

  const handleChange = (text, index) => {
    let newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    try {
      const verificationCode = code.join("");
      await axi.post("/auth/verify-code", { email, code: verificationCode });
      navigation.navigate("auth/mainAuth/signin");
    } catch (error) {
      Alert.alert(
        error.response.data.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationCode = async () => {
    setLoading(true);
    try {
      await axi.get(`/auth/resend-email-verification-code`, { email: email });
      Alert.alert("Code has been resent, check your email");
    } catch (error) {
      Alert.alert(
        error.response.data.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        
        <Text style={styles.headerTitle}>Enter the confirmation code</Text>
        <Text style={styles.headerSubtitle}>
          To verify your email, enter the 6-digit code we sent to {email}
        </Text>

        {/* Code Input */}
        <View style={styles.codeInputContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              style={[
                styles.codeInput,
                index === 3 && styles.codeInputMargin,
              ]}
              maxLength={1}
              keyboardType="numeric"
              onChangeText={(text) => handleChange(text, index)}
              value={digit}
              ref={(ref) => (inputRefs.current[index] = ref)}
            />
          ))}
        </View>

        <Text style={styles.resendText} onPress={resendVerificationCode}>
          I didn't get the code
        </Text>

        {/* Verify Button */}
        <TouchableOpacity
          style={styles.verifyButton}
          onPress={submitHandler}
          disabled={loading} // Disable the button when loading
        >
          <Text style={styles.verifyButtonText}>
            Verify and Create account
          </Text>
        </TouchableOpacity>

        {/* Loader */}
        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#196100" />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ConfirmationCode;

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
  backIcon: {
    alignSelf: "flex-start",
    marginBottom: 20,
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
  codeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  codeInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 18,
  },
  codeInputMargin: {
    marginHorizontal: 5,
  },
  resendText: {
    textAlign: "center",
    color: "#196100",
    marginBottom: 30,
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
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
    zIndex: 1000, // Ensure the loader is on top
  },
});
