import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { getCurrentLocation } from '../services/locationService'; // Assuming you already have this
import { calculateRisk } from '../services/riskCalculator'; // Assuming you already have this
import WeatherScreen from './WeatherScreen'; // Assuming this is your existing WeatherScreen component
import RiskScreen from './RiskScreen'; // Assuming this is your existing RiskScreen component
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [riskLevel, setRiskLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

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

    const fetchRisk = async () => {
      try {
        const loc = await getCurrentLocation();
        setLocation(loc);

        const risk = await calculateRisk(loc.lat, loc.lon);
        setRiskLevel(risk);
      } catch (error) {
        console.error('Error fetching risk level:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRisk();
    const intervalId = setInterval(fetchRisk, 30 * 60 * 1000); // Auto refresh every 30 mins

    return () => clearInterval(intervalId);
  }, []);

  const sendSOS = () => {
    if (!userProfile) {
      Alert.alert('Error', 'User profile not found!');
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const message = `
          SOS Alert from ${userProfile.name}:
          Location: Latitude: ${latitude}, Longitude: ${longitude}
          Blood Group: ${userProfile.bloodGroup}
          Emergency Contact: ${userProfile.emergencyContact}
        `;
        Alert.alert('SOS Alert', message, [{ text: 'OK' }]);
      },
      error => {
        console.error('Error fetching location:', error);
        Alert.alert('Error', 'Unable to fetch location!');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>SafeTrack Dashboard</Text>

      {/* Location */}
      {location && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Location</Text>
          <Text style={styles.cardContent}>Lat: {location.lat}, Lon: {location.lon}</Text>
        </View>
      )}

      {/* Risk Level */}
      {riskLevel && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Risk Level</Text>
          <Text style={styles.cardContent}>Risk: {riskLevel}</Text>
        </View>
      )}

      {/* Weather Information */}
      <WeatherScreen lat={location?.lat} lon={location?.lon} />

      {/* Risk Map Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Risk Map')}>
        <Text style={styles.buttonText}>View Risk Map</Text>
      </TouchableOpacity>

      {/* SOS Button */}
      <TouchableOpacity style={styles.sosButton} onPress={sendSOS}>
        <Text style={styles.sosButtonText}>Send SOS</Text>
      </TouchableOpacity>

      {/* Logs Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Log')}>
        <Text style={styles.buttonText}>View Logs</Text>
      </TouchableOpacity>

      <Button title="Refresh Risk" onPress={() => setLoading(true)} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    width: '100%',
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardContent: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  button: {
    width: '100%',
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sosButton: {
    backgroundColor: '#ff3b30',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
