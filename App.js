import * as Location from "expo-location";
import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import styles from "./styles"; 
const API_KEY = "AIzaSyAEYawu2F54ISLkI7KxXaX0KHt3U8EKyZU"; 
const RESTAURANTS_URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${API_KEY}`;
const MYPOSITION_URL = `https://maps.googleapis.com/maps/api/geocode/json?key=${API_KEY}&latlng=`;

export default function FindRestaurants() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [address, setAddress] = useState("Loading...");
  const [restaurants, setRestaurants] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setLatitude(latitude);
        setLongitude(longitude);

        // Fetch the address for the current location
        fetch(`${MYPOSITION_URL}${latitude},${longitude}`)
          .then((resp) => resp.json())
          .then(({ results }) => {
            if (results.length > 0) {
              setAddress(results[0].formatted_address);
            } else {
              console.error("No results for address.");
            }
          })
          .catch((error) => {
            console.error("Error fetching address:", error.message);
            setAddress("Unable to fetch address");
          });

        // Fetch nearby restaurants
        fetch(`${RESTAURANTS_URL}&location=${latitude},${longitude}&radius=1500&type=restaurant`)
          .then((response) => response.json())
          .then((data) => {
            if (data.results && data.results.length > 0) {
              setRestaurants(data.results);
            } else {
              console.error("No restaurants found:", data);
            }
          })
          .catch((error) => console.error("Error fetching restaurants:", error));
      } catch (error) {
        console.error("Error getting location:", error);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : latitude && longitude ? (
        <>
          <Text style={styles.label}> {address}</Text>
          <MapView
            style={styles.mapView}
            initialRegion={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            showsUserLocation={true}
          >
            {/* Marker for user's current location */}
            <Marker
              title="Your Location"
              description={address}
              coordinate={{
                latitude: latitude,
                longitude: longitude,
              }}
              pinColor="blue"
            />

            {restaurants.map((restaurant, index) => (
              restaurant.geometry &&
              restaurant.geometry.location &&
              typeof restaurant.geometry.location.lat === 'number' &&
              typeof restaurant.geometry.location.lng === 'number' ? (
                <Marker
                  key={index}
                  title={restaurant.name}
                  description={restaurant.vicinity || "Address not available"}
                  coordinate={{
                    latitude: restaurant.geometry.location.lat,
                    longitude: restaurant.geometry.location.lng,
                  }}
                />
              ) : null
            ))}

          </MapView>
        </>
      ) : (
        <Text style={styles.label}>Loading map...</Text>
      )}
    </View>
  );
}
