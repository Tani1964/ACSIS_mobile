import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useLayoutEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { axi } from "@/app/context/AuthContext";

const createNew = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  
  const [formData, setFormData] = useState({
    newPassword: "",
    verificationCode: "",
  });

  const submit = async() => {
    await axi.get(`/user/password/update-user-password`, {formData})
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="black"
          style={styles.backIcon}
        />
        <Text style={styles.headerTitle}>Create a new password</Text>
        <Text style={styles.headerSubtitle}>
          Create a new password. You’ll need this password to log into your
          account.
        </Text>

        {/* Code Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="lightgrey" />
          <TextInput
            style={styles.inputField}
            placeholder="New password"
            onChangeText={(newText) =>
              setFormData((prevState) => ({ ...prevState, neWpassword: newText }))
            }
            defaultValue={formData.newPassword}
            secureTextEntry={true}
            //   keyboardType="password"
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="lightgrey" />
          <TextInput
            style={styles.inputField}
            placeholder="Confirm new password"
            onChangeText={(newText) =>
              setFormData((prevState) => ({ ...prevState, password: newText }))
            }
            defaultValue={formData.newPassword}
            secureTextEntry={true}
          />
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={styles.verifyButton}
          onPress={() => {
            /* Verify action */
            submit()
          }}
        >
          <Text style={styles.verifyButtonText}>Create new password</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default createNew;

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
