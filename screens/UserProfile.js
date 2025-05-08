import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserProfile() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  const validateInputs = () => {
    if (!name || !age || !bloodGroup || !emergencyContact) {
      Alert.alert('All fields are required!');
      return false;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      Alert.alert('Enter a valid age between 1 and 120');
      return false;
    }

    const contactRegex = /^\d{10}$/;
    if (!contactRegex.test(emergencyContact)) {
      Alert.alert('Emergency contact must be exactly 10 digits');
      return false;
    }

    const bloodGroupRegex = /^(A|B|AB|O)[+-]$/i;
    if (!bloodGroupRegex.test(bloodGroup)) {
      Alert.alert('Blood group must be like A+, B-, AB+, O-, etc.');
      return false;
    }

    return true;
  };

  const saveProfile = async () => {
    if (!validateInputs()) return;

    const profile = {
      name,
      age,
      bloodGroup: bloodGroup.toUpperCase(),
      emergencyContact,
    };

    try {
      await AsyncStorage.setItem('@user_profile', JSON.stringify(profile));
      Alert.alert('Profile Saved!');
    } catch (e) {
      Alert.alert('Error saving profile', e.message);
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem('@user_profile');
        if (storedProfile !== null) {
          const data = JSON.parse(storedProfile);
          setName(data.name);
          setAge(data.age);
          setBloodGroup(data.bloodGroup);
          setEmergencyContact(data.emergencyContact);
        }
      } catch (e) {
        console.log('Error loading profile:', e);
      }
    };

    loadProfile();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Name:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text>Age:</Text>
      <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" />

      <Text>Blood Group:</Text>
      <TextInput style={styles.input} value={bloodGroup} onChangeText={setBloodGroup} />

      <Text>Emergency Contact:</Text>
      <TextInput style={styles.input} value={emergencyContact} onChangeText={setEmergencyContact} keyboardType="phone-pad" />

      <Button title="Save Profile" onPress={saveProfile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    padding: 10,
    marginVertical: 8,
  },
});
