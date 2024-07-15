import { StyleSheet, Text, View } from 'react-native'
import React, {useEffect, useState} from "react";
import { useLocalSearchParams } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native";
import { axi} from "@/app/context/AuthContext";
import { useAuth } from '@/app/context/AuthContext';

const viewPitch = () => {
  const route = useRoute();
  const { itemId } = route.params;
  const navigation = useNavigation();
  const [data, setData] = useState({})
  const {authState} = useAuth()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const auth = await authState.authenticated;
        if (auth ) {
          navigation.navigate("auth/mainAuth/signin");
        }
        console.log('Authentication status successfully.');
      } catch (error) {
        console.error(error);
      }
    };
    const getData = async() => {
      const headers = { Authorization: `Bearer ${authState.token}` };
      const response = await axi.get(`/pitch/get-pitch/${itemId}`, {headers})
      setData(response.data)
      console.log(response.data)
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