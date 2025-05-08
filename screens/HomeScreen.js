import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Alert, ImageBackground, SafeAreaView } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [userProfile, setUserProfile] = useState(null);

  // Fetch the user profile from AsyncStorage
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userData = await AsyncStorage.getItem('userProfile');
        if (userData) {
          setUserProfile(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error loading user profile', error);
      }
    };

    loadUserProfile();
  }, []);

  // Function to handle SOS button press
  const sendSOS = async () => {
    try {
      // Check if user profile exists
      if (!userProfile) {
        Alert.alert('Error', 'User profile not found!');
        return;
      }

      // Get current location using Geolocation API
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;

          // Construct the SOS message
          const message = `
            SOS Alert from ${userProfile.name}:
            Location: Latitude: ${latitude}, Longitude: ${longitude}
            Blood Group: ${userProfile.bloodGroup}
            Emergency Contact: ${userProfile.emergencyContact}
          `;

          // Display SOS message in an alert (this can be sent over mesh network later)
          Alert.alert('SOS Alert', message, [{ text: 'OK' }]);
        },
        error => {
          console.error('Error fetching location:', error);
          Alert.alert('Error', 'Unable to fetch location!');
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (error) {
      console.error('Error in sending SOS:', error);
      Alert.alert('Error', 'An error occurred while sending SOS');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Image */}
      <ImageBackground
        source={{ uri: 'jake-espedido-ty9Dyq24T7I-unsplash.jpg' }}  // Replace with your own background image URL
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>SafeTrack</Text>
          <Text style={styles.subtitle}>Emergency Safety & Disaster Response</Text>

          {/* SOS Button */}
          <TouchableOpacity style={styles.sosButton} onPress={sendSOS}>
            <Text style={styles.sosButtonText}>Send SOS</Text>
          </TouchableOpacity>

          {/* Risk Map Button */}
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => navigation.navigate('Risk Map')}>
            <Text style={styles.mapButtonText}>View Risk Map</Text>
          </TouchableOpacity>

          {/* Logs Button */}
          <TouchableOpacity
            style={styles.logButton}
            onPress={() => navigation.navigate('Log')}>
            <Text style={styles.logButtonText}>View Logs</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',  // This will make the background image cover the entire screen
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent dark overlay
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    fontStyle: 'italic',
  },
  sosButton: {
    backgroundColor: '#ff3b30', // Red color for SOS button
    padding: 15,
    borderRadius: 50,
    width: '80%',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mapButton: {
    backgroundColor: '#007AFF', // Blue color for Risk Map button
    padding: 15,
    borderRadius: 50,
    width: '80%',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logButton: {
    backgroundColor: '#34C759', // Green color for Logs button
    padding: 15,
    borderRadius: 50,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
