import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import ActionButton from "@/components/actionButton";
import { Link } from "expo-router";
import React, { useState, useLayoutEffect, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { axi } from "../../context/AuthContext";
import * as SecureStore from "expo-secure-store";
import { useLocalSearchParams } from 'expo-router';
import { useRoute } from '@react-navigation/native';


const PersonalReviewScreen = () => {
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
          <Text style={styles.infoValue}>{data.full_name}</Text>
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
          <Text style={styles.infoValue}>{data.email}</Text>
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
          <Text style={styles.infoValue}>{data.phone_number}</Text>
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
          <Text style={styles.infoValue}>{data.date_of_birth}</Text>
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
          <Text style={styles.infoValue}>{data.nationality}</Text>
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
          <Text style={styles.infoValue}>{data.ethnicity}</Text>
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
          <Text style={styles.infoValue}>{data.requires_disability_support? "Yes":"No"}</Text>
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
          <Text style={styles.infoValue}>{data.disability_support_description}</Text>
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
