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
import { useAuth } from "../../context/AuthContext";


const ProfessionalReview = () => {
  const { authState } = useAuth();
  const navigation = useNavigation();
  const [professionalInfo, setProfessionalInfo] = useState({});
  const [auth, setAuth] = useState({});

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    const getdata = async () => {
      // await setAuth(SecureStore.getItemAsync("authenticated"));
      // const token = await SecureStore.getItemAsync("token");
      // const headers = { Authorization: `Bearer ${token}` };
      const headers = { "Authorization": `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE0ZTUzMzM0LTNiNDMtNGM3Yi05YTFlLTFhMWJiMDAwZTQwMCIsImVtYWlsIjoiaWZlZ2Jlc2FuNitzc3NAZ21haWwuY29tIiwic2Vzc2lvbklkIjoiZjUyN2QxODQtMWFmYi00MTZjLWJjNjAtOTUyMGQ3ZGZmYWY4IiwiaWF0IjoxNzE5ODQ5NDE2MjIzLCJleHAiOjE3MTk5MzU4MTYyMjMsImlzcyI6InVwaV9zZXJ2ZXIifQ.ZSUM8a47ur00ssnbiViwgtLTrCAJVctYTA7X1jEsz0w"}` };
      // const response = await axi.get('/pitch/get-pitch',{headers})
      const response = await axi.get("/pitch/get-pitch", { headers });
      setProfessionalInfo(response.data.pitch.personal_information);
      console.log(response.data);
      console.log(professionalInfo);
      
    };
    getdata();
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
