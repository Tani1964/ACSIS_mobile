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
import { Link } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { axi } from "@/app/context/AuthContext";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

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
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      const response = await axi.patch(`/user/password/update-user-password`, {
        email: email,
        newPassword: formData.newPassword,
        verificationCode: formData.verificationCode,
      });
      navigation.navigate("auth/forgotPassword/success");
    } catch (error) {
      console.error(error);
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
              defaultValue={formData.newPassword}
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
              defaultValue={formData.confirmPassword}
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
              defaultValue={formData.verificationCode}
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
