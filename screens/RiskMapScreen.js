// screens/RiskMapScreen.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const riskZones = [
  { id: 1, latitude: 28.6139, longitude: 77.2090, label: 'Delhi High-Risk' },
  { id: 2, latitude: 19.0760, longitude: 72.8777, label: 'Mumbai Warning' },
];

const RiskMapScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Risk Zones</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 23.2599,
          longitude: 77.4126,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
      >
        {riskZones.map((zone) => (
          <Marker
            key={zone.id}
            coordinate={{ latitude: zone.latitude, longitude: zone.longitude }}
            title={zone.label}
            pinColor="red"
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: { fontSize: 20, fontWeight: 'bold', margin: 10 },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height - 100 },
});

export default RiskMapScreen;
