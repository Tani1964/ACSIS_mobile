import { StyleSheet, Text, View, ActivityIndicator, ScrollView } from 'react-native';
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { axi } from '@/app/context/AuthContext';
import { useAuth } from '@/app/context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const ViewPitch = () => {
  const route = useRoute();
  const { itemId } = route.params;
  const navigation = useNavigation();
  const [pitch, setPitch] = useState({});
  const [loading, setLoading] = useState(true);
  const { authState } = useAuth();

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
          navigation.navigate('auth/mainAuth/signin');
        }
        console.log('Authentication status successfully checked.');
      } catch (error) {
        console.error('Authentication check error:', error);
      }
    };

    const getData = async () => {
      try {
        const headers = { Authorization: `Bearer ${authState.token}` };
        const response = await axi.get(`/pitch/get-pitch/${itemId}`, { headers });
        setPitch(response.data.pitch);
        console.log('Pitch data:', response.data.pitch);
      } catch (error) {
        console.error('Error fetching pitch data:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    getData();
  }, [itemId, authState]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Pitch Information</Text>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Business Details</Text>
        <Text style={styles.label}>Business Name: </Text><Text style={styles.value}>{pitch.competition_questions?.business_name}</Text>
        <Text style={styles.label}>Business Description: </Text><Text style={styles.value}>{pitch.competition_questions?.business_description}</Text>
        <Text style={styles.label}>Reason of Interest: </Text><Text style={styles.value}>{pitch.competition_questions?.reason_of_interest}</Text>
        <Text style={styles.label}>Investment Prize Usage Plan: </Text><Text style={styles.value}>{pitch.competition_questions?.investment_prize_usage_plan}</Text>
        <Text style={styles.label}>Impact Plan with Investment Prize: </Text><Text style={styles.value}>{pitch.competition_questions?.impact_plan_with_investment_prize}</Text>
        <Text style={styles.label}>Summary of Why You Should Participate: </Text><Text style={styles.value}>{pitch.competition_questions?.summary_of_why_you_should_participate}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Personal Information</Text>
        <Text style={styles.label}>Full Name: </Text><Text style={styles.value}>{pitch.personal_information?.full_name}</Text>
        <Text style={styles.label}>Date of Birth: </Text><Text style={styles.value}>{new Date(pitch.personal_information?.date_of_birth).toLocaleDateString()}</Text>
        <Text style={styles.label}>Email: </Text><Text style={styles.value}>{pitch.personal_information?.email}</Text>
        <Text style={styles.label}>Phone Number: </Text><Text style={styles.value}>{pitch.personal_information?.phone_number}</Text>
        <Text style={styles.label}>Nationality: </Text><Text style={styles.value}>{pitch.personal_information?.nationality}</Text>
        <Text style={styles.label}>Ethnicity: </Text><Text style={styles.value}>{pitch.personal_information?.ethnicity}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Professional Background</Text>
        <Text style={styles.label}>Current Occupation: </Text><Text style={styles.value}>{pitch.professional_background?.current_occupation}</Text>
        <Text style={styles.label}>LinkedIn: </Text><Text style={styles.value}>{pitch.professional_background?.linkedin_url}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Review Status</Text>
        <Text style={styles.label}>Status: </Text><Text style={styles.value}>{pitch.review?.review_status}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Technical Agreement</Text>
        <Text style={styles.label}>Signed Technical Agreement: </Text><Text style={styles.value}>{pitch.technical_agreement?.has_signed_technical_agreement ? 'Yes' : 'No'}</Text>
        <Text style={styles.label}>Has Current Employees: </Text><Text style={styles.value}>{pitch.technical_agreement?.have_current_employees ? 'Yes' : 'No'}</Text>
        <Text style={styles.label}>Has Current Investors: </Text><Text style={styles.value}>{pitch.technical_agreement?.have_current_investors ? 'Yes' : 'No'}</Text>
        <Text style={styles.label}>Has Debts: </Text><Text style={styles.value}>{pitch.technical_agreement?.have_debts ? 'Yes' : 'No'}</Text>
      </View>
    </ScrollView>
  );
};

export default ViewPitch;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 30,
    backgroundColor: '#FFFFFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color:"#196100"
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "#196100"
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    marginBottom: 5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color:"#196100"
  },
});
