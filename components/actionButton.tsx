import { Button, StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { Link } from "expo-router";

const ActionButton = ({text, link}) => {
  return ( 
      
      <View style={{flexDirection: "row", alignSelf:"center", position:"fixed", bottom:-10}}>
        <Link href={link} style={styles.link}>
          {text}
        </Link>
      </View>
  );
};

export default ActionButton;

const styles = StyleSheet.create({
  
  
  link:  {
      marginBottom: 80,
      paddingVertical: 10,
      paddingHorizontal: 70,
      borderRadius: 50,
      color: "white",
      backgroundColor: "#196100",
      shadowColor: "black",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
});
