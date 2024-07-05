import React, { useState,useLayoutEffect, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import ActionButton from "../../../components/actionButton";
import { Link } from "expo-router";
import { useNavigation } from '@react-navigation/native';
import {axi} from "../../context/AuthContext";
import * as SecureStore from 'expo-secure-store'
import { useLocalSearchParams } from 'expo-router';
import { useRoute } from '@react-navigation/native';


const ProfessionalReview = () => {
  const navigation = useNavigation();
  const [data, setData] = useState({})
  

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  const route = useRoute();
  const { itemId } = route.params;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const auth = await SecureStore.getItemAsync('authenticated');
        if (auth != 'true') {
          navigation.navigate("login");
        }
        console.log('Authentication status successfully.');
      } catch (error) {
        console.error(error);
      }
    };
    const getData = async() => {
      const headers = { Authorization: `Bearer ${SecureStore.getItem("token")}` };
      const response = await axi.get(`/api/v1/pitch/get-pitch/${itemId}`, {headers})
      setData(response.data)
      console.log(response)
    }
    checkAuth()
    getData()
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Professional Review</Text>
      <ScrollView>
        <View style={styles.contentContainer}>
          
        </View>
      </ScrollView>
      <ActionButton text="Next" link="/form/review/competitionreview" />
    </View>
  );
};

export default ProfessionalReview;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingHorizontal: 30,
    height: "100%",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
  },
  contentContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingTop: 20,
  },
  section: {
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontWeight: "bold",
  },
  sectionContent: {
    marginTop: 8,
  },
  editText: {
    color: "#196100",
    flexDirection: "row",
    alignItems: "center",
  },
});
