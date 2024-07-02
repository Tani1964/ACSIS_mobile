import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import ActionButton from "@/components/actionButton";
import { Link } from "expo-router";
import React, { useState, useLayoutEffect, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { axi } from "../../context/AuthContext";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "../../context/AuthContext";

const PersonalReviewScreen = () => {
  const { authState } = useAuth();
  const navigation = useNavigation();
  const [personalInfo, setPersonalInfo] = useState({});
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
      setPersonalInfo(response.data.pitch.personal_information);
      console.log(response.data);
      console.log(personalInfo);
      
    };
    getdata();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Personal Information</Text>
      <ScrollView>
        <View style={styles.infoItem}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoLabel}>Full Name</Text>
            <View style={styles.editButton}>
              <Link href="/form/personal">
                <AntDesign name="edit" size={24} color="#196100" />
                <Text style={styles.editText}>Edit</Text>
              </Link>
            </View>
          </View>
          <Text style={styles.infoValue}>{personalInfo.full_name}</Text>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoLabel}>Email</Text>
            <View style={styles.editButton}>
              <Link href="/form/personal">
                <AntDesign name="edit" size={24} color="#196100" />
                <Text style={styles.editText}>Edit</Text>
              </Link>
            </View>
          </View>
          <Text style={styles.infoValue}>{personalInfo.email}</Text>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoLabel}>Phone Number</Text>
            <View style={styles.editButton}>
              <Link href="/form/personal">
                <AntDesign name="edit" size={24} color="#196100" />
                <Text style={styles.editText}>Edit</Text>
              </Link>
            </View>
          </View>
          <Text style={styles.infoValue}>{personalInfo.phone_number}</Text>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoLabel}>Date of Birth</Text>
            <View style={styles.editButton}>
              <Link href="/form/personal">
                <AntDesign name="edit" size={24} color="#196100" />
                <Text style={styles.editText}>Edit</Text>
              </Link>
            </View>
          </View>
          <Text style={styles.infoValue}>{personalInfo.date_of_birth}</Text>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoLabel}>Nationality</Text>
            <View style={styles.editButton}>
              <Link href="/form/personal">
                <AntDesign name="edit" size={24} color="#196100" />
                <Text style={styles.editText}>Edit</Text>
              </Link>
            </View>
          </View>
          <Text style={styles.infoValue}>{personalInfo.nationality}</Text>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoLabel}>Ethnicity</Text>
            <View style={styles.editButton}>
              <Link href="/form/personal">
                <AntDesign name="edit" size={24} color="#196100" />
                <Text style={styles.editText}>Edit</Text>
              </Link>
            </View>
          </View>
          <Text style={styles.infoValue}>{personalInfo.ethnicity}</Text>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoLabel}>Do you require any disability support?</Text>
            <View style={styles.editButton}>
              <Link href="/form/personal">
                <AntDesign name="edit" size={24} color="#196100" />
                <Text style={styles.editText}>Edit</Text>
              </Link>
            </View>
          </View>
          <Text style={styles.infoValue}>{personalInfo.requires_disability_support? "Yes":"No"}</Text>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoLabel}>Please specify...</Text>
            <View style={styles.editButton}>
              <Link href="/form/personal">
                <AntDesign name="edit" size={24} color="#196100" />
                <Text style={styles.editText}>Edit</Text>
              </Link>
            </View>
          </View>
          <Text style={styles.infoValue}>{personalInfo.disability_support_description}</Text>
        </View>
      </ScrollView>
      <ActionButton text="Next" link="/form/review/proffesionalreview" />
    </View>
  );
};

export default PersonalReviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 30,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  infoItem: {
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
    paddingVertical: 20,
  },
  infoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontWeight: "bold",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  editText: {
    color: "#196100",
    marginLeft: 5,
  },
  infoValue: {
    marginTop: 8,
  },
});
