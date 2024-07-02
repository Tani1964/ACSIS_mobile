import { Button, StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useState,useLayoutEffect } from "react";
import { Link } from "expo-router";
import { useNavigation } from '@react-navigation/native';

const Pitch = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={styles.body}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../../assets/images/PNG File 1.png")}
          style={styles.image}
        />
        <View style={styles.textContainer}>
          <Text style={styles.headerText}>
            You have no pitches yet
          </Text>
          <Text style={{ color: "grey" }}>
            Whenever you pitch an idea, you can track its
          </Text>
          <Text style={{ color: "grey" }}>progress here.</Text>
        </View>
      </View>
      <View>
        <Link href="/auth/onboarding/one" asChild>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Pitch an idea</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export default Pitch;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    textAlign: "center",
    backgroundColor: "white",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "grey",
  },
  image: {
    width: 200, // Adjust the width according to your image
    height: 200, // Adjust the height according to your image
    marginBottom: 20,
  },
  link: {
    marginBottom: 80,
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
  linkText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
