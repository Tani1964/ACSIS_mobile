import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useNavigation, useRoute } from "@react-navigation/native";
import { axi } from "@/app/context/AuthContext";

const FullView = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [eventImages, setEventImages] = useState([]);
  const [eventLocation, setEventLocation] = useState("");
  const [event, setEvent] = useState({});
  const [region, setRegion] = useState(null); // Add region state

  const route = useRoute();
  const { eventID, location2 } = route.params;

  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0922; // Adjust as needed
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
      setMapLoading(false);
      return false;
    }
    return true;
  };

  const getEvent = async () => {
    try {
      const response = await axi.get(`/event/get-event/${eventID}`);
      setEvent(response.data.event);
      console.log(response.data.event.sponsor_images_urls)
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentLocation = async () => {
    const permissionGranted = await getPermissions();
    if (!permissionGranted) return;

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      console.log("current ", location);
      const currentCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setCurrentLocation(currentCoords);

      // Set region to center on current location
      setRegion({
        ...currentCoords,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    } catch (error) {
      console.error("Error getting current location:", error);
      Alert.alert(
        "Error",
        "Unable to retrieve current location. Please make sure to enable Location permissions."
      );
    }
  };

  const geocode = async () => {
    try {
      setMapLoading(true)
      if (!event.location && !location2) {
        return; // Exit the function if no location is available
      }

      console.log("kkk", event.location || location2);

      // Await the geocoding operation directly
      const geocodedLocation = await Location.geocodeAsync(event.location || location2);
      console.log("geo", geocodedLocation);

      if (geocodedLocation.length > 0) {
        const { latitude, longitude } = geocodedLocation[0];
        if (latitude && longitude) {
          setDestination({
            latitude,
            longitude,
          });
          // Update region to include destination
          setRegion({
            latitude,
            longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          });
        } else {
          Alert.alert("Geocoding Error", "Invalid coordinates returned.");
        }
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      Alert.alert("Geocoding Error", "Unable to geocode the location.");
    } finally {
      setMapLoading(false);
    }
  };

  useEffect(() => {
    getEvent();
  }, []);

  useEffect(() => {
    getCurrentLocation();
    geocode();
  }, [event.location]);

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
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          showsUserLocation={true}
          showsMyLocationButton={true}
          loadingEnabled={true}
          region={region} // Set region
        >
          {destination && (
            <>
              <Marker coordinate={destination} title={"Venue"} />
              <MapViewDirections
                origin={currentLocation}
                destination={destination}
                apikey="AIzaSyCWDZCZ1ewtuTm5hl2euGj0mrMn-F0DJIw"
                strokeWidth={3}
                strokeColor="green"
                onError={(errorMessage) => {
                  console.error("MapViewDirections error:", errorMessage);
                  Alert.alert("Error", errorMessage);
                }}
              />
            </>
          )}
        </MapView>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>More Info</Text>
        <ScrollView style={styles.infoScroll}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location: </Text>
            <Text>{event.location || "N/A"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Title: </Text>
            <Text>{event.title || "N/A"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Description: </Text>
            <Text>{event.description || "N/A"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Predicted Duration: </Text>
            <Text>{event.duration_hours ? `${event.duration_hours} Hours` : "N/A"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date and Time: </Text>
            <Text>{event.date_time ? formatDateTime(event.date_time) : "N/A"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Sponsors: </Text>
            {event.sponsors && event.sponsors.length > 0 ? (
              event.sponsors.map((sponsor, index) => (
                <Text key={index}>{sponsor.name}</Text>
              ))
            ) : (
              <Text>None</Text>
            )}
          </View>
          <View style={styles.links}>
            <Text style={styles.infoLabel}>Other Links: </Text>
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
            <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
              {event.sponsor_images_urls && event.sponsor_images_urls.length > 0 ? (
                event.sponsor_images_urls.map((imageRef, index) => (
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
    justifyContent: "center",
    alignItems: "center",
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
    paddingBottom: 150,
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
    marginVertical: 4,
    flexDirection: "row",
  },
  infoLabel: {
    fontWeight: "bold",
  },
  infoColumn: {
    marginVertical: 4,
  },
  links: {
    marginVertical: 4,
  },
  linkText: {
    color: "blue",
  },
  sponsorImage: {
    width: 70,
    height: 50,
  },
});
