import { StyleSheet, Text, View } from 'react-native'
import React, {useEffect, useState} from "react";
import { useLocalSearchParams } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { axi} from "@/app/context/AuthContext";

const viewPitch = () => {
  const route = useRoute();
  const { itemId } = route.params;
  const navigation = useNavigation();
  const [data, setData] = useState({})

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
    <View>
      <Text>{itemId}</Text>
    </View>
  )
}

export default viewPitch

const styles = StyleSheet.create({})