import React, { useLayoutEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const terms = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Terms of Service</Text>
          <Text style={styles.sectionTitle}>Introduction</Text>
          <Text style={styles.text}>
            African Caribbean Sustainability & Investment Summit (ACSIS)
            respects each individual’s right to personal privacy. We will
            collect and use information through our web sites only in the ways
            disclosed in this statement. This statement applies solely to
            information collected at ACSIS web site.
          </Text>
          <Text style={styles.sectionTitle}>
            Part I: Information Collection
          </Text>
          <Text style={styles.text}>
            ACSIS collects information through our web sites at several points.
            We collect non-personal information regarding usage of the site by
            visitors. We collect general data that is not personally
            identifiable information including the domain name and web page from
            which the site was entered, the country location of the user and the
            browsers used. We collect the number of visitors to our sites, the
            number of pages they viewed, which pages they viewed, which
            advertisements and websites they viewed from our website and how
            much time is spent on each visit to any of our sites. We collect
            this information through a third party that is employed by our web
            site developer to track the usage of our sites. We do not collect
            personal types of information such as name, address, telephone
            number or e-mail address unless a visitor to our site provides it to
            us. ACSIS does not actively market to children, and we never
            knowingly ask a child under 13 to divulge personal information. A
            cookie is a small file that is stored on the hard drive of your
            computer that is available for future access when you return to the
            same site. We may use cookies to collect IP addresses and
            information regarding the usage of the site. Through your internet
            browser you can elect to erase cookies from the hard drive on your
            computer, block all cookies or receive a warning before a cookie is
            installed.
          </Text>
          <Text style={styles.sectionTitle}>Part II: Information Usage</Text>
          <Text style={styles.text}>
            ACSIS requests specific information regarding the usage of our site
            in order to evaluate their usage and promote that to our clients.
            ACSIS does not require or have the option currently for the user to
            register themselves as a user of the site. Our site offers chats,
            forums and message boards for our visitor’s enjoyment. The
            information we collect will not be used to create customer profiles
            based on browsing or purchasing history. We will not supplement
            information collected at our web sites with data from other sources.
            We may share aggregated data with third parties to show how visitors
            use our web site in order to improve our web site and help to retain
            and attract new clients. Such non-personally identifiable
            information may also be disclosed if it is required by law or for
            the safety of others. We offer links to other Web sites. Please
            note: When you click on links to other web sites, we encourage you
            to read their privacy policies. Their standards may differ from
            ours. We are not responsible for the privacy policies of the third
            party.
          </Text>
          <Text style={styles.sectionTitle}>Part III: Problem Resolution</Text>
          <Text style={styles.text}>
            If you have any further questions about privacy or security, please
            contact us by sending an email to:
            enquiries@africancaribbeansummit.com or to one of our local offices
            listed in Contact US.
          </Text>
          <Text style={styles.sectionTitle}>
            Part IV: Privacy Policy Updates
          </Text>
          <Text style={styles.text}>
            This Privacy Policy supersedes and replaces all previously posted
            Privacy Policies. This policy may be amended from time to time and
            those changes will be posted here so that our users are always aware
            of the information collected, how it is used and under what
            circumstances we would disclose it. Updated June 23, 2024
          </Text>
        </ScrollView>
      </View>
  );
};

export default terms;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 10,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
});
