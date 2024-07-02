import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useState,useLayoutEffect } from "react";
import { Link } from 'expo-router';
import ActionButton from '@/components/actionButton';
import { useNavigation } from '@react-navigation/native';


const Three = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Image source={require("../../../assets/images/Frame 1060 (2).png")} style={styles.image} />
      
      <View style={styles.buttonContainer}>
        <ActionButton text={"Let's get started"} link={"auth/mainAuth/signin"}/>
      </View>
    </View>
  );
};

export default Three;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  image: {
    width: 400,
    height: 400,
    resizeMode: "contain",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
  },
  nextButton: {
    marginBottom: 8,
    paddingVertical: 10,
    paddingHorizontal: 100,
    borderRadius: 50,
    color: "white",
    backgroundColor: "#196100",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 100,
    borderRadius: 50,
    color: "white",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  skipButtonText: {
    color: "#196100",
    fontSize: 16,
    fontWeight: "bold",
  },
});
