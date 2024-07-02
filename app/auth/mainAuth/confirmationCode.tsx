import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from "react-native";
import React, { useState,useLayoutEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useNavigation, useRoute } from "@react-navigation/native";
import  {axi} from "@/app/context/AuthContext";

const ConfirmationCode = () => {
  const [code, setCode] = useState(new Array(6).fill(""));
  const navigation = useNavigation();
  const route = useRoute(); // Access the route prop
  const {email} = route.params;  // Log the route params

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleChange = (text, index) => {
    let newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
  };

  const submitHandler = async() =>{
    try {
      const verificationCode = code.join(''); // Join the array into a single string
      await axi.post('/auth/verify-code', { email, code: verificationCode });
      navigation.navigate('auth/mainAuth/signin')
    } catch (error) {
      // console.log(error.response.data.message);
      alert(error.response.data.message || 'An error occurred. Please try again.')
    }
  }
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Ionicons name="arrow-back" size={24} color="black" style={styles.backIcon} />
        <Text style={styles.headerTitle}>Enter the confirmation code</Text>
        <Text style={styles.headerSubtitle}>
          To verify your email, enter the 6-digit code we sent to example@pitci.com
        </Text>

        {/* Code Input */}
        <View style={styles.codeInputContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              style={[styles.codeInput, index === 3 && styles.codeInputMargin]}
              maxLength={1}
              keyboardType="numeric"
              onChangeText={(text) => handleChange(text, index)}
              value={digit}
            />
          ))}
        </View>

        <Text style={styles.resendText}>I didn't get the code</Text>

        {/* Verify Button */}
        <TouchableOpacity
          style={styles.verifyButton}
          onPress={() => {
            /* Verify action */
            submitHandler()
          }}
        >
          <Text style={styles.verifyButtonText}>Verify and Create account</Text>
        </TouchableOpacity>
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
});
