import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useLayoutEffect } from "react";
import { Link } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { axi, useAuth } from "../../context/AuthContext";
import MainAdvert from "@/components/mainAdvert";

const Pitch = () => {
  const navigation = useNavigation();
  const { authState } = useAuth();
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
    });
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the timeout as necessary
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#196100" />
      </View>
    );
  }

  return (
    <View style={styles.body}>
      <View style={styles.imageContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require("../../../assets/images/pitch.png")}
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <Text style={styles.headerText}>You have no pitches yet</Text>
            <Text style={{ color: "grey" }}>
              Whenever you pitch an idea, you can track its
            </Text>
            <Text style={{ color: "grey" }}>progress here.</Text>
          </View>
        </View>
        <View>
          {authState.authenticated ? (
            <Link href="/form/index" asChild>
              <TouchableOpacity style={styles.link}>
                <Text style={styles.linkText}>Pitch an idea</Text>
              </TouchableOpacity>
            </Link>
          ) : (
            <Link href="/auth/onboarding/one" asChild>
              <TouchableOpacity style={styles.link}>
                <Text style={styles.linkText}>Pitch an idea</Text>
              </TouchableOpacity>
            </Link>
          )}
        </View>
      </View>
      <View style={styles.sponsors}>
        <MainAdvert filter={"pitch"} />
      </View>
    </View>
  );
};

export default Pitch;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    textAlign: "center",
    backgroundColor: "white",
  },
  imageContainer: {
    gap: 20,
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
  sponsors: {
    position: "absolute", // Absolute positioning to overlap the WebView
    top: 0, // Adjust as needed to control the overlap position
    left: 0,
    right: 0,
    height: "14%", // Adjust height as needed
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white", // Semi-transparent background to overlap but still show the WebView content
    zIndex: 1, // Ensure it appears above the WebView
  },
});
