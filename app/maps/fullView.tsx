import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useNavigation, useRoute } from "@react-navigation/native";
import { axi } from "@/app/context/AuthContext";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring
} from "react-native-reanimated";

const FullView = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [event, setEvent] = useState({});
  const [region, setRegion] = useState(null);
  const navigation = useNavigation();

  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  // Set initial height of the "More Info" section
  const translateY = useSharedValue(height * 0.6); // Default height to 60% of the screen

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
    });
  }, [navigation]);

  const route = useRoute();
  const { eventID, location2 } = route.params;

  const getPermissions = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        setMapLoading(false);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Permission error:", error);
      return false;
    }
  };

  const getEvent = useCallback(async () => {
    try {
      const response = await axi.get(`/event/get-event/${eventID}`);
      setEvent(response.data.event);
    } catch (error) {
      console.error("Error fetching event:", error);
      Alert.alert("Error", "Unable to fetch event details.");
    }
  }, [eventID]);

  const getCurrentLocation = useCallback(async () => {
    const permissionGranted = await getPermissions();
    if (!permissionGranted) return;

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const currentCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setCurrentLocation(currentCoords);
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
  }, [LATITUDE_DELTA, LONGITUDE_DELTA]);

  const geocode = useCallback(async () => {
    try {
      if (!event.location && !location2) return;

      const address = event.location || location2;
      const apiKey = "AIzaSyCWDZCZ1ewtuTm5hl2euGj0mrMn-F0DJIw";
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${apiKey}`
      );
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setDestination({ latitude: lat, longitude: lng });
        setRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        });
      } else {
        Alert.alert("Geocoding Error", "No geocoded location found.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      Alert.alert("Geocoding Error", "Unable to geocode the location.");
    } finally {
      setMapLoading(false);
    }
  }, [event.location, location2, LATITUDE_DELTA, LONGITUDE_DELTA]);

  useEffect(() => {
    getEvent();
  }, [getEvent]);

  useEffect(() => {
    if (event.location) {
      getCurrentLocation();
      geocode();
    }
  }, [event.location, getCurrentLocation, geocode]);

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const dateOptions = { weekday: "long", month: "short", day: "numeric" };
    const timeOptions = { hour: "2-digit", minute: "2-digit" };
    return `${date.toLocaleDateString(
      "en-US",
      dateOptions
    )}, ${date.toLocaleTimeString("en-US", timeOptions)}`;
  };

  // Gesture handler for dragging the info container
  const gesture = Gesture.Pan().onUpdate((event) => {
    // Clamp translateY to keep it within visible boundaries
    const newTranslateY = translateY.value + event.translationY;
    translateY.value = withSpring(Math.min(height, Math.max(height * 0.2, newTranslateY)), {
      damping: 20,
      stiffness: 90,
    });
  });

  // Animated style for the draggable info container
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          provider={Platform.OS === 'ios' ? undefined : PROVIDER_GOOGLE}
          style={styles.map}
          showsUserLocation={true}
          showsMyLocationButton={true}
          loadingEnabled={true}
          region={
            region || {
              latitude: 0,
              longitude: 0,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }
          }
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

      {/* Draggable Info Container */}
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.infoContainer, animatedStyle]}>
          <Text style={styles.infoTitle}>More Info</Text>
          <ScrollView style={styles.infoScroll}>
            {/* Render event details here as before */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Location: </Text>
              <Text>{event.location || "N/A"}</Text>
            </View>
            {/* Additional info rows */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date and Time: </Text>
              <Text>
                {event.date_time ? formatDateTime(event.date_time) : "N/A"}
              </Text>
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
              <Text>
                {event.duration_hours ? `${event.duration_hours} Hours` : "N/A"}
              </Text>
            </View>
            {/* <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Sponsors: </Text> */}
            {/* {event.sponsors && event.sponsors.length > 0 ? (
                event.sponsors.map((sponsor, index) => (
                  <Text key={index}>{sponsor.name}</Text>
                ))
              ) : (
                <Text>None</Text>
              )} */}
            {/* </View> */}
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
                  <Text>No Links Available</Text>
                )}
              </View>
            <View style={styles.infoRow}>
              <View style={styles.infoColumn}>
                <Text style={styles.infoLabel}>Sponsors:</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.imageScrollContainer}
                >
                  {event.sponsor_images_urls &&
                  event.sponsor_images_urls.length > 0 ? (
                    event.sponsor_images_urls.map((imageRef, index) => (
                      <View key={index} style={styles.imageContainer}>
                        <Image
                          source={{ uri: imageRef }}
                          style={styles.sponsorImage}
                          resizeMode="contain"
                        />
                      </View>
                    ))
                  ) : (
                    <Text>None</Text>
                  )}
                </ScrollView>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  infoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "120%", // Full height
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 10,
    borderWidth: 3,
    borderColor: "green",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 1,
    borderRightWidth: 1
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    padding: 16,
  },
  infoScroll: {
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoLabel: {
    fontWeight: "bold",
  },
  links: {
    marginTop: 1,
  },
  linkText: {
    color: "blue",
    textDecorationLine: "underline",
  },
  imageScrollContainer: {
    marginTop: 10,
  },
  imageContainer: {
    marginRight: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  sponsorImage: {
    width: 100,
    height: 100,
  },
  infoColumn: {
    marginTop: 1
  },
});

export default FullView;
