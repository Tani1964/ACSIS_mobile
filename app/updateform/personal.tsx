import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Pressable,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import {
  Ionicons,
  AntDesign,
  SimpleLineIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import ActionButton from "../../components/actionButton";
import RadioButtonRN from "radio-buttons-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuth } from "../context/AuthContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import { axi } from "../context/AuthContext";
import RadioGroup from "react-native-radio-buttons-group";

const Personal = () => {
  const [loading, setLoading] = useState(false);
  const { authState } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const { itemId } = route.params || {}; // Default to an empty object to avoid destructuring undefined
  const id = itemId;
  const [selectedId, setSelectedId] = React.useState();
  const [selectedId2, setSelectedId2] = React.useState();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
    });
  }, [navigation]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const auth = await authState.authenticated;
        if (!auth) {
          navigation.navigate("auth/mainAuth/signin");
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchData = async () => {
      setLoading(true); // Start loading
      try {
        const headers = { Authorization: `Bearer ${authState.token}` };
        const response = await axi.get(`/pitch/get-pitch/${id}`, { headers });
        const data = response.data.pitch.personal_information;
        setFormData({
          fullName: data.full_name,
          email: data.email,
          phoneNumber: data.phone_number,
          dateOfBirth: formatDate(data.date_of_birth),
          nationality: data.nationality,
          ethnicity: data.ethnicity,
          gender: data.gender || "Male", // Assuming default value
          requiresDisabilitySupport: data.requires_disability_support,
          disabilitySupportDescription:
            data.disability_support_description || "",
        });
        setSelectedId(
          data.gender === "Male" ? 1 : data.gender === "Female" ? 2 : 3
        );
        setSelectedId2(data.requires_disability_support ? 1 : 2);
        setDate(new Date(data.date_of_birth));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    checkAuth();
    fetchData();
  }, [authState.authenticated, authState.token, id, navigation]);

  const formatDate = (rawDate) => {
    const date = new Date(rawDate);
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  };

  const [date, setDate] = useState(new Date());
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: formatDate(date),
    nationality: "",
    ethnicity: "",
    gender: "Male", // Default gender
    requiresDisabilitySupport: false,
    disabilitySupportDescription: "",
  });
  const [showPicker, setShowPicker] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const disabilityOptions = [
    { id: 1, label: "Yes", state: true },
    { id: 2, label: "No", state: false },
  ];

  const genderOptions = [
    { id: 1, label: "Male", value: "Male" },
    { id: 2, label: "Female", value: "Female" },
    { id: 3, label: "Other", value: "Other" },
  ];

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === "ios");
    setDate(currentDate);
    setFormData((prevState) => ({
      ...prevState,
      dateOfBirth: formatDate(currentDate),
    }));
  };

  const validateForm = () => {
    const { fullName, email, phoneNumber, nationality, ethnicity, gender } =
      formData;
    if (
      !fullName ||
      !email ||
      !phoneNumber ||
      !nationality ||
      !ethnicity ||
      !gender
    ) {
      Alert.alert("Validation Error", "All fields are required.");
      return false;
    }
    return true;
  };

  const submitHandler = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${authState.token}` };
      const newFormData = {
        ...formData,
        gender: genderOptions.find((option) => option.id === selectedId)?.value,
        requiresDisabilitySupport: disabilityOptions.find(
          (option) => option.id === selectedId2
        )?.state,
      };

      await axi.patch(
        `/pitch/update-pitch/${id}/personal_information/`,
        newFormData,
        { headers }
      );
      Alert.alert("Success", "Your personal information has been saved.");
      navigation.navigate("updateform/proffesional", { id });
    } catch (error) {
      if (error.response) {
        const statusCode = error.response.status;
        if (statusCode === 400) {
          Alert.alert("Update Error", "Try again later.");
        } else if (statusCode === 401) {
          navigation.navigate("auth/mainAuth/signin");
        } else if (statusCode === 422) {
          Alert.alert("Update failed", "Make sure to input the right entries.");
        } else if (statusCode === 404) {
          Alert.alert("Pitch not found");
        } else {
          Alert.alert("Update Error", "Try again later.");
        }
      } else {
        Alert.alert(
          "Login Failed",
          "Network error. Please check your internet connection."
        );
      }
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  const confirmIOSDate = () => {
    setFormData((prevState) => ({
      ...prevState,
      dateOfBirth: formatDate(date),
    }));
    toggleDatePicker();
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#196100" style={styles.loader} />
      ) : (
        <ScrollView>
          <SafeAreaView>
            <View style={styles.innerContainer}>
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={24} color="lightgrey" />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChangeText={(newText) =>
                      setFormData((prevState) => ({
                        ...prevState,
                        fullName: newText,
                      }))
                    }
                  />
                </View>
                <View style={styles.inputContainer}>
                  <AntDesign name="mail" size={24} color="lightgrey" />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Email address"
                    value={formData.email}
                    onChangeText={(newText) =>
                      setFormData((prevState) => ({
                        ...prevState,
                        email: newText,
                      }))
                    }
                  />
                </View>
                <View style={styles.inputContainer}>
                  <AntDesign name="phone" size={24} color="lightgrey" />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Mobile number with country code"
                    value={formData.phoneNumber}
                    onChangeText={(newText) =>
                      setFormData((prevState) => ({
                        ...prevState,
                        phoneNumber: newText,
                      }))
                    }
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Pressable
                    onPress={toggleDatePicker}
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <AntDesign name="calendar" size={24} color="lightgrey" />

                    <TextInput
                      style={styles.inputField}
                      placeholder="Date of Birth"
                      value={formData.dateOfBirth}
                      editable={false}
                      pointerEvents="none"
                    />
                    <Text style={{ color: "grey" }}>D.O.B</Text>
                  </Pressable>
                  {showPicker && (
                    <DateTimePicker
                      mode="date"
                      value={date}
                      display="spinner"
                      onChange={onChange}
                    />
                  )}
                  {showPicker && Platform.OS === "ios" && (
                    <View style={styles.pickerButtonContainer}>
                      <Pressable
                        style={styles.pickerButton}
                        onPress={toggleDatePicker}
                      >
                        <Text>Cancel</Text>
                      </Pressable>
                      <Pressable
                        style={styles.pickerButton}
                        onPress={confirmIOSDate}
                      >
                        <Text>Confirm</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
                <View style={styles.inputContainer}>
                  <SimpleLineIcons name="globe" size={24} color="lightgrey" />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Nationality"
                    value={formData.nationality}
                    onChangeText={(newText) =>
                      setFormData((prevState) => ({
                        ...prevState,
                        nationality: newText,
                      }))
                    }
                  />
                </View>
                <View style={styles.inputContainer}>
                  <MaterialCommunityIcons
                    name="account-group-outline"
                    size={24}
                    color="lightgrey"
                  />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Ethnicity"
                    value={formData.ethnicity}
                    onChangeText={(newText) =>
                      setFormData((prevState) => ({
                        ...prevState,
                        ethnicity: newText,
                      }))
                    }
                  />
                </View>
                <Text style={{ fontWeight: "bold" }}>Gender</Text>
                <RadioGroup
                  radioButtons={genderOptions}
                  onPress={setSelectedId}
                  selectedId={selectedId}
                  containerStyle={styles.radioGroup}
                  radioButtonStyle={styles.radioButton}
                />
                <Text style={{ fontWeight: "bold" }}>
                  Do you require any disability support?
                </Text>
                <RadioGroup
                  radioButtons={disabilityOptions}
                  onPress={setSelectedId2}
                  selectedId={selectedId2}
                  containerStyle={styles.radioGroup}
                  radioButtonStyle={styles.radioButton}
                />
                {disabilityOptions.find((option) => option.id === selectedId2)
                  ?.state && (
                  <TextInput
                    style={styles.textArea}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    placeholder="Please specify..."
                    value={formData.disabilitySupportDescription}
                    onChangeText={(newText) =>
                      setFormData((prevState) => ({
                        ...prevState,
                        disabilitySupportDescription: newText,
                      }))
                    }
                  />
                )}
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      )}
      <View style={styles.actionButtonContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={submitHandler}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.actionButtonText}>Save and continue</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Personal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 30,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
    paddingTop: 40,
    marginTop: 20,
  },
  innerContainer: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  headerTextActive: {
    fontSize: 13,
    color: "#196100",
    marginHorizontal: 10,
  },
  headerText: {
    fontSize: 13,
    color: "grey",
    marginHorizontal: 10,
  },
  form: {
    flexDirection: "column",
    gap: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 6,
    borderColor: "lightgrey",
    borderWidth: 1,
    borderRadius: 10,
  },
  inputField: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  textArea: {
    height: "auto",
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
  },
  actionButtonContainer: {
    padding: 20,
    backgroundColor: "white",
  },
  actionButton: {
    backgroundColor: "#196100",
    borderRadius: 100,
    paddingVertical: 15,
    alignItems: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  pickerButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  pickerButton: {
    padding: 10,
    backgroundColor: "lightgrey",
    borderRadius: 10,
    margin: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  radioGroup: {
    flexDirection: "row",
    // justifyContent: 'space-between',
    gap: 4,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
});
