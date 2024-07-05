import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';
import { useRoute } from '@react-navigation/native';

const viewBusiness = () => {
  const route = useRoute();
  const { itemId } = route.params;
  return (
    <View>
      <Text>{itemId}</Text>
    </View>
  )
}

export default viewBusiness

const styles = StyleSheet.create({})