import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Button,
  TouchableOpacity
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Link } from "expo-router";
import ActionButton from "../../components/actionButton";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import * as SecureStore from "expo-secure-store";

const DATA = [
  {
    id: "1.",
    title: "Personal Information:",
    text: " We'll ask for some basic information about yourself.",
  },
  {
    id: "2.",
    title: "Professional Background:",
    text: " Share your relevant experience and skills.",
  },
  {
    id: "3.",
    title: "Competition Questions:",
    text: " Answer questions related to your idea and its potential impact.",
  },
  {
    id: "4.",
    title: "Technical Agreement and Signature:",
    text: " Review and agree to our terms and conditions.",
  },
  // Add more items as needed
];
const DATA2 = [
  {
    text: " Make sure to have all necessary information and documents ready before starting the pitching process. ",
  },
  {
    text: " Take your time and answer each question carefully, as this will be your chance to showcase your idea and skills.",
  },
  // Add more items as needed
];

const GuidelineItem = ({ item }) => (
  <View style={styles.guidelineItem}>
    <Text style={styles.guidelineId}>{item.id}</Text>
    <View style={styles.guidelineTextContainer}>
      <Text style={styles.guidelineTitle}>
        {item.title}
        <Text style={styles.guidelineText}>{item.text}</Text>
      </Text>
    </View>
  </View>
);

const TipItem = ({ item }) => (
  <View style={styles.tipItem}>
    <Entypo name="dot-single" size={24} color="black" />
    <Text style={styles.tipText}>{item.text}</Text>
  </View>
);

const Index = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const { authState } = useAuth();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const auth = await authState.authenticated;
        if (!auth) {
          navigation.navigate("auth/mainAuth/signin");
        }
        console.log("Authentication status successfully.");
      } catch (error) {
        console.error(error);
      }
    };
    checkAuth();
  }, []);

  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Please review the following guidelines before pitching your idea
          </Text>
          <Text style={styles.subHeaderText}>
            The pitching process consists of 4 major categories
          </Text>
          <FlatList
            data={DATA}
            renderItem={({ item }) => <GuidelineItem item={item} />}
            keyExtractor={(item) => item.id}
          />
        </View>

        <View>
          <Text style={styles.tipsHeader}>Tips</Text>
          <FlatList
            data={DATA2}
            renderItem={({ item }) => <TipItem item={item} />}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
      <View style={{display:"flex", flexDirection:"column",gap:10, paddingTop:4}}>
      
        <TouchableOpacity
          style={styles.actionButton}
          onPress={()=> navigation.navigate("form/personal")}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.actionButtonText}>I'm ready to pitch</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: "white",
    height: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  content: {
    height: "70%",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 14,
  },
  header: {
    gap: 8,
  },
  headerText: {
    color: "#196100",
    fontSize: 16,
  },
  subHeaderText: {
    color: "grey",
    fontSize: 14,
  },
  tipsHeader: {
    color: "#196100",
    fontSize: 16,
  },
  guidelineItem: {
    flexDirection: "row",
    paddingVertical: 6,
  },
  guidelineId: {
    fontSize: 14,
  },
  guidelineTextContainer: {
    flexDirection: "row",
  },
  guidelineTitle: {
    color: "black",
    fontSize: 14,
  },
  guidelineText: {
    color: "grey",
    fontSize: 14,
    width: "50%",
  },
  tipItem: {
    flexDirection: "row",
    paddingVertical: 3,
    alignItems: "center",
  },
  tipText: {
    color: "grey",
    fontSize: 14,
    flexDirection: "row",
    alignItems: "center",
  },actionButton: {
    backgroundColor: "#196100",
    borderRadius: 100,
    paddingVertical: 15,
    alignItems: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
