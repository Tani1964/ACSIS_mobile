import { StyleSheet, Text, View, TextInput, ScrollView } from "react-native";
import React, { useState,useLayoutEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "react-native";
import DatePicker from "react-native-date-picker";
import ActionButton from "../../components/actionButton"
import { useNavigation } from '@react-navigation/native';
import { useAuth } from "../context/AuthContext";

const technical = () => {
  const navigation = useNavigation();
  const {authState} = useAuth();

  if(!authState.authenticated){
    navigation.navigate('login');
  }

  const [text, setText] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    nationality: "",
    ethnicity: "",
    disability: "",
    disabilityInfo: "",
  });

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <ScrollView>
    <View
      style={{
        padding: 20,
        paddingBottom: 40,
        backgroundColor: "white",
        flexDirection: "column",
        gap: 5,
        height: "100vh",
      }}
    >
      {/* page links */}
      <View></View>
      {/* questions */}
      <View
        style={{ backgroundColor: "white", flexDirection: "column", gap: 20 }}
      >
        
        <View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="Email address"
              onChangeText={(newText) => setFormData((prevState) => ({ ...prevState, email: newText }))}
              defaultValue={formData.email}
            />
          </View>
        </View>
        <View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="Phone number"
              onChangeText={(newText) => setFormData((prevState) => ({ ...prevState, phone: newText }))}
              defaultValue={formData.phone}
            />
          </View>
        </View>
        
        
        
        <ActionButton text={"Save and continue"} link={"form/review/personalreview"} style={{position:"relative"}}/>
      </View>
    </View></ScrollView>
  );
};

export default technical;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    gap: 10,
    borderColor: "lightgrey",
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
  },
  inputField: {
    height: 150,
    placeholderTextColor: "lightgrey",
    // borderLeftWidth: 1,
    // borderLeftColor: "lightgrey",
    paddingHorizontal: 10,
    width: "100%",
  },
});
