import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  Alert,
  ScrollView,
  TouchableOpacity,
  Button
} from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { Header } from "react-native/Libraries/NewAppScreen";
import { Link } from "expo-router";

// const origin = {latitude: 37.3318456, longitude: -122.0296002};
// const destination = {latitude: 37.771707, longitude: -122.4053769};
// const GOOGLE_MAPS_APIKEY = '…';

const FullView = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const route = useRoute();
  const { location, event } = route.params;

  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Direction to venue",
    });
  }, [navigation]);

  Location.setGoogleApiKey("AIzaSyCWDZCZ1ewtuTm5hl2euGj0mrMn-F0DJIw");

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    };

    const geocode = async () => {
      const geocodedLocation = await Location.geocodeAsync(location);
      if (geocodedLocation.length > 0) {
        const { latitude, longitude } = geocodedLocation[0];
        setDestination({
          latitude,
          longitude,
          title: "Venue",
        });
      }
    };

    getPermissions();
    geocode();
  }, []);
  console.log(event);

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
        {/* {currentLocation ? (
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
        )} */}
      </View>
      <View style={{ paddingHorizontal: 4 , borderTopWidth:8,borderLeftWidth:2,borderRightWidth:2, borderTopColor:"green",borderRightColor:"green", borderLeftColor:"green",borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop:10}}>
        <Text style={{textAlign: "center", fontWeight:"bold", marginBottom: 6}}>More Info</Text>
        <ScrollView style={{marginHorizontal:6}}> 
          <View style={{ display: "flex", flexDirection: "row", gap: 3 }}>
            <Text style={{ fontWeight: "bold" }}>Location:</Text>
            <Text>{event.location}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 3 }}>
            <Text style={{ fontWeight: "bold" }}>Title:</Text>
            <Text>{event.title}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 3 }}>
            <Text style={{ fontWeight: "bold" }}>Description:</Text>
            <Text>{event.description}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 3 }}>
            <Text style={{ fontWeight: "bold" }}>Predicted Duration:</Text>
            <Text>{event.duration_hours} Hours</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 3 }}>
            <Text style={{ fontWeight: "bold" }}>Date and Time:</Text>
            <Text>{formatDateTime(event.date_time)}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Text style={{ fontWeight: "bold" }}>Sponsors:</Text>
            {event.sponsors
              ? event.sponsors.map((sponsor) => <Text>{sponsor.name}</Text>)
              : "None"}
          </View>
          <View style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Text style={{ fontWeight: "bold" }}>Other Links:</Text>
            {event.otherLinks
              ? event.otherLinks.map((link) => (
                  <TouchableOpacity onPress={()=>navigation.navigate('maps/linkWeb', {link: link.url})}>
                    <Text style={{color:"green"}}>{link.title}</Text>
                  </TouchableOpacity>
                ))
              : "None"}
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
});
