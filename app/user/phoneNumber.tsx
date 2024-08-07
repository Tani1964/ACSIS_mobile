import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { axi, useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const PhoneNumber = () => {
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const { authState } = useAuth();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: ""
    });
  }, [navigation]);


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

  const getOtp = async () => {
    try {
        const headers = { Authorization: `Bearer ${authState.token}` };
      const response = await axi.post('/user/phone/request-phone-otp', { phoneNumber: phone },{headers});
      Alert.alert('OTP Sent', 'Please check your phone for the OTP.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to request OTP.');
    }
  };

  const submitOtp = async () => {
    try {
        const headers = { Authorization: `Bearer ${authState.token}` };
      const response = await axi.patch('/user/phone/update-user-phone', { phoneNumber: phone, verificationCode: otp },{headers});
      Alert.alert('Success', 'Phone number updated successfully.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update phone number.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Phone Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TouchableOpacity style={styles.button} onPress={getOtp}>
        <Text style={styles.buttonText}>Get OTP</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
      />
      <TouchableOpacity style={styles.button} onPress={submitOtp}>
        <Text style={styles.buttonText}>Submit OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PhoneNumber;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  button: {
    backgroundColor: '#196100',
    padding: 10,
    borderRadius: 100,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
