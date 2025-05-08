// screens/LogScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogScreen = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const savedLogs = await AsyncStorage.getItem('sosLogs');
        if (savedLogs) {
          setLogs(JSON.parse(savedLogs));
        }
      } catch (e) {
        console.log('Error loading logs:', e);
      }
    };

    loadLogs();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.logItem}>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
      <Text style={styles.message}>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SOS Logs</Text>
      <FlatList
        data={logs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  logItem: { marginBottom: 10, backgroundColor: '#eee', padding: 10, borderRadius: 8 },
  timestamp: { fontSize: 12, color: 'gray' },
  message: { fontSize: 16 },
});

export default LogScreen;
