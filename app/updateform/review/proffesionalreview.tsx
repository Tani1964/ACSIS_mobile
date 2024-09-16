import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import ActionButton from "../../../components/actionButton";
import { Link } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { axi } from "../../context/AuthContext";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfessionalReview = () => {
  const navigation = useNavigation();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { authState } = useAuth();

  

  const route = useRoute();
  const { id } = route.params;
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
    const getData = async () => {
      const headers = { Authorization: `Bearer ${authState.token}` };
      const response = await axi.get(`/pitch/get-pitch/${id}`, {
        headers,
      });
      setData(response.data.pitch.professional_background);
    };
    checkAuth();
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ display: "flex" }}>
        
        <Text style={styles.header}>Professional Background</Text>
      </View>
      <ScrollView>
        <View style={styles.infoItem}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoLabel}>Current Occupation</Text>
            <View style={styles.editButton}>
              <Link href="/updateform/proffesional">
                <AntDesign name="edit" size={24} color="#196100" />
                <Text style={styles.editText}>Edit</Text>
              </Link>
            </View>
          </View>
          <Text style={styles.infoValue}>{data.current_occupation}</Text>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoLabel}>Linkedin Profile</Text>
            <View style={styles.editButton}>
              <Link href="/updateform/proffesional">
                <AntDesign name="edit" size={24} color="#196100" />
                <Text style={styles.editText}>Edit</Text>
              </Link>
            </View>
          </View>
          <Text style={styles.infoValue}>{data.linkedin_url}</Text>
        </View>
      </ScrollView>
      <View style={styles.actionButtonContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>(
            navigation.navigate("form/review/competitionreview", { id: id })
          )
          }
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

export default ProfessionalReview;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingHorizontal: 30,
    height: "100%",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
  },
  contentContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingTop: 20,
  },
  section: {
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontWeight: "bold",
  },
  sectionContent: {
    marginTop: 8,
  },
  editText: {
    color: "#196100",
    flexDirection: "row",
    alignItems: "center",
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
  },infoItem: {
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
    width: 70
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
  },
    infoValue: {
    marginTop: 8,
  },
});
