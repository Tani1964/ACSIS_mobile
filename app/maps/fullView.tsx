import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useNavigation, useRoute } from "@react-navigation/native";

const FullView = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const { eventID, event } = route.params;

  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
    });
  }, [navigation]);

  const getPermissions = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
      setLoading(false);
      return false;
    }
    return true;
  };

  const getCurrentLocation = async () => {
    const locationPermissionGranted = await getPermissions();
    if (!locationPermissionGranted) return;

    const location = await Location.getCurrentPositionAsync({});
    setCurrentLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
  };

  const geocode = async () => {
    if (!event || !event.location) {
      console.error("Event or event.location is undefined.");
      Alert.alert(
        "Geocoding Error",
        "Event location is not available. Please try again later."
      );
      setLoading(false);
      return;
    }

    try {
      const geocodedLocation = await Location.geocodeAsync(event.location);
      if (geocodedLocation.length > 0) {
        const { latitude, longitude } = geocodedLocation[0];
        setDestination({
          latitude,
          longitude,
          title: "Venue",
        });
      } else {
        console.error("No geocoded locations found.");
        Alert.alert(
          "Geocoding Error",
          "No location found for the provided address. Please check the address and try again."
        );
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      Alert.alert(
        "Geocoding Error",
        "There was an issue with geocoding the location. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await getCurrentLocation();
      if (event && event.location) {
        await geocode();
      } else {
        setLoading(false);
      }
    };

    init();
  }, [eventID]);

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const dateOptions = { weekday: "long", month: "short", day: "numeric" };
    const timeOptions = { hour: "2-digit", minute: "2-digit" };
    return `${date.toLocaleDateString(
      "en-US",
      dateOptions
    )}, ${date.toLocaleTimeString("en-US", timeOptions)}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {currentLocation ? (
          <MapView style={styles.map} initialRegion={currentLocation}>
            <Marker coordinate={currentLocation} title="You" />
            {destination && (
              <Marker coordinate={destination} title={destination.title} />
            )}
            {destination && (
              <MapViewDirections
                origin={currentLocation}
                destination={destination}
                apikey="AIzaSyCWDZCZ1ewtuTm5hl2euGj0mrMn-F0DJIw"
                strokeWidth={3}
                strokeColor="hotpink"
              />
            )}
          </MapView>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>More Info</Text>
        <ScrollView style={styles.infoScroll}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location:</Text>
            <Text>{event.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Title:</Text>
            <Text>{event.title}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Description:</Text>
            <Text>{event.description}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Predicted Duration:</Text>
            <Text>{event.duration_hours} Hours</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date and Time:</Text>
            <Text>{formatDateTime(event.date_time)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Sponsors:</Text>
            {event.sponsors && event.sponsors.length > 0 ? (
              event.sponsors.map((sponsor, index) => (
                <Text key={index}>{sponsor.name}</Text>
              ))
            ) : (
              <Text>None</Text>
            )}
          </View>
          <View style={styles.links}>
            <Text style={styles.infoLabel}>Other Links:</Text>
            {event.otherLinks && event.otherLinks.length > 0 ? (
              event.otherLinks.map((link, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    navigation.navigate("maps/linkWeb", { link: link.url })
                  }
                >
                  <Text style={styles.linkText}>{link.title}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text>None</Text>
            )}
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>Sponsor Images:</Text>
            {event.sponsor_images_refs && event.sponsor_images_refs.length > 0 ? (
              event.sponsor_images_refs.map((imageRef, index) => (
                <Image
                  key={index}
                  source={{ uri: imageRef }}
                  style={styles.sponsorImage}
                />
              ))
            ) : (
              <Text>None</Text>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default FullView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mapContainer: {
    height: "60%",
  },
  infoContainer: {
    paddingHorizontal: 4,
    borderTopWidth: 8,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopColor: "green",
    borderRightColor: "green",
    borderLeftColor: "green",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
  },
  infoTitle: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 6,
  },
  infoScroll: {
    marginHorizontal: 6,
    paddingBottom: 10,
    height: "40%",
  },
  infoRow: {
    flexDirection: "row",
    gap: 3,
    marginBottom: 5,
  },
  infoLabel: {
    fontWeight: "bold",
  },
  infoColumn: {
    flexDirection: "column",
    gap: 3,
  },
  linkText: {
    color: "green",
  },
  links: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sponsorImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    margin: 5,
  },
});
