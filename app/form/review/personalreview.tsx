import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useState, useLayoutEffect, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { axi, useAuth } from "../../context/AuthContext";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const PersonalReviewScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState({});
  const { authState } = useAuth();
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
    });
  }, [navigation]);

  const route = useRoute();
  const { id } = route.params;

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

    const getData = async () => {
      const headers = { Authorization: `Bearer ${authState.token}`, "ngrok-skip-browser-warning": "true" };
      const response = await axi.get(`/pitch/get-pitch/${id}`, {
        headers,
      });
      setData(response.data.pitch.personal_information);
    };

    checkAuth();
    getData();
  }, []);

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const dateOptions = { weekday: "long", month: "short", day: "numeric" };
    const timeOptions = { hour: "2-digit", minute: "2-digit" };
    return `${date.toLocaleDateString(
      "en-US",
      dateOptions
    )}, ${date.toLocaleTimeString("en-US", timeOptions)}`;
  };

  return (
    <View style={styles.container}>
      <View style={{ display: "flex" }}>
        
        <Text style={styles.header}>Personal Information</Text>
      </View>
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
          <Text style={styles.infoValue}>{formatDateTime(data.date_of_birth)}</Text>
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
            <Text style={styles.infoLabel}>Gender</Text>
            <View style={styles.editButton}>
              <Link href="/form/personal">
                <AntDesign name="edit" size={24} color="#196100" />
                <Text style={styles.editText}>Edit</Text>
              </Link>
            </View>
          </View>
          <Text style={styles.infoValue}>{data.gender}</Text>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoLabel}>
              Do you require any disability support?
            </Text>
            <View style={styles.editButton}>
              <Link href="/form/personal">
                <AntDesign name="edit" size={24} color="#196100" />
                <Text style={styles.editText}>Edit</Text>
              </Link>
            </View>
          </View>
          <Text style={styles.infoValue}>
            {data.requires_disability_support ? "Yes" : "No"}
          </Text>
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
          <Text style={styles.infoValue}>
            {data.disability_support_description}
          </Text>
        </View>
      </ScrollView>
      <View style={styles.actionButtonContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("form/review/proffesionalreview", { id: id })}
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
});
