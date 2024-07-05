import React, { useState,useLayoutEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import {axi} from "@/app/context/AuthContext";

const notifications = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const toggleNotifications = async() => {
    await setNotificationsEnabled(previousState => !previousState);
    const auth =  await SecureStore.getItemAsync('authenticated');
    if (notificationsEnabled && (auth == 'true')) {
      Alert.alert('Notifications Disabled');
    } else {
        try{
            const response = await axi.patch("/user/update-notification-settings", {
        
                "notificationStatus": true,
                "pitchNotificationStatus": true,
                "postNotificationStatus": true,
                "eventNotificationStatus": true
              
            }
        )
        Alert.alert(response.data);
        }catch(e){
            console.log(e)
        }
        


    }

  };

  const signOutHandler = async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('authenticated');
    navigation.navigate("index"); // Ensure you have a SignIn screen to navigate to
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Ionicons name="arrow-back" size={24} color="black" onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          <View style={styles.optionContainer}>
            <Text style={styles.optionText}>Enable Notifications</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={notificationsEnabled ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleNotifications}
              value={notificationsEnabled}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity style={styles.optionContainer} onPress={signOutHandler}>
            <Text style={styles.optionText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default notifications;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
  },
});
