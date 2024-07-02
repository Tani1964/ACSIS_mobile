import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useState,useLayoutEffect } from "react";
import ActionButton from '@/components/actionButton'
import { useNavigation } from '@react-navigation/native';

const SubmittedScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Image source={require('../../../assets/images/successful.png')} style={styles.image} />
        <Text style={styles.title}>Application Submitted Successfully!</Text>
        <Text style={styles.description}>
          We appreciate the time you took to complete your application. Our team will carefully review your submission and be in touch soon.
        </Text>
      </View>
      <ActionButton text="Got it" link="/" style={styles.button} />
    </View>
  )
}

export default SubmittedScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
    backgroundColor: "white"
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 100,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    marginVertical: 16,
  },
  description: {
    textAlign: 'center',
    fontSize: 16,
    paddingHorizontal: 20,
  },
  button: {
    marginBottom: 40,
  },
})