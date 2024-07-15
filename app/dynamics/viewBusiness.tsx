import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const viewBusiness = async() => {
  const route = useRoute();
  const { id } = route.params;
  const {authState} = useAuth
  const auth = await authState
  console.log(auth)
  return (
    <View>
      
      <Text>{id}</Text>
    </View>
  )
}

export default viewBusiness

const styles = StyleSheet.create({})