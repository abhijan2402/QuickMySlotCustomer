import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
  PermissionsAndroid
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { COLOR } from '../../../Constants/Colors';

const MainHomeHeader = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState('Getting location...');
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
const isFocus = useIsFocused()
  // Request location permission
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'QuickMySlot needs access to your location to show nearby services',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setHasLocationPermission(true);
          getCurrentLocation();
        } else {
          setLocation('Location access denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      // For iOS, we'll use the built-in Geolocation API which shows its own permission dialog
      getCurrentLocation();
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        // In a real app, you would reverse geocode the coordinates to get an address
        // For this example, we'll use a static address
        setLocation('Flat No P, Plot No.2, Govindam-3, Ganesh Nagar...');
        setHasLocationPermission(true);
      },
      error => {
        console.log(error.code, error.message);
        setLocation('Unable to get location');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // Handle location icon press
  const handleLocationPress = () => {
    if (hasLocationPermission) {
      getCurrentLocation();
    } else {
      requestLocationPermission();
    }
  };

  // Request permission on component mount
  useEffect(() => {
    if(isFocus){
        requestLocationPermission();
    }
  }, [isFocus]);

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.locationContainer}
        onPress={handleLocationPress}
      >
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/128/684/684908.png' }}
          style={[styles.icon, { tintColor: COLOR.primary }]}
        />
        <View style={styles.locationTextContainer}>
          <Text style={styles.locationTitle} numberOfLines={1}>Your Location</Text>
          <Text style={styles.locationAddress} numberOfLines={1}>{location}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={() => {
          navigation.navigate('NotificationsScreen');
        }}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/128/2529/2529521.png' }}
            style={[styles.icon, { marginRight: 15, tintColor: COLOR.primary }]}
          />
        </TouchableOpacity>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/128/17446/17446833.png' }}
          style={styles.icon}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    backgroundColor: '#fff',
    // elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
  },
  locationTextContainer: {
    marginLeft: 8,
  },
  locationTitle: {
    fontSize: 12,
    color: '#666',
  },
  locationAddress: {
    fontSize: 14,
    fontWeight: '500',
    color: COLOR.primary,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLOR.primary,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '25%',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});

export default MainHomeHeader;