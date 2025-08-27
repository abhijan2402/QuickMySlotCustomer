import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
  PermissionsAndroid,
  ActivityIndicator
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {COLOR} from '../../../Constants/Colors';

const MainHomeHeader = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState('Getting location...');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const isFocus = useIsFocused();

  const getCurrentLocation = async () => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission Required',
            message: 'This app needs access to your location to provide better services.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          throw new Error('Location permission denied');
        }
      }
    };
    
    try {
      await requestPermissions();
      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          position => resolve(position),
          error => reject(new Error(error.message || 'Error getting location')),
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
        );
      });
    } catch (error) {
      throw new Error(error.message || 'Error checking location permissions');
    }
  };

  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=YOUR_GOOGLE_MAPS_API_KEY`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      return 'Address not found';
    } catch (error) {
      console.error('Error getting address:', error);
      return 'Unable to fetch address';
    }
  };

  const fetchLocation = async () => {
    try {
      setIsLoading(true);
      const locationData = await getCurrentLocation();
      setCurrentLocation(locationData);
      
      // Get address from coordinates
      const address = await getAddressFromCoordinates(
        locationData.coords.latitude,
        locationData.coords.longitude
      );
      
      setLocation(address);
    } catch (error) {
      // Alert.alert('Location Error', error.message);
      setLocation('Location unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, [isFocus]);

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.locationContainer}
        onPress={fetchLocation}
        disabled={isLoading}
      >
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/128/684/684908.png',
          }}
          style={[styles.icon, {tintColor: COLOR.primary}]}
        />
        <View style={styles.locationTextContainer}>
          <Text style={styles.locationTitle} numberOfLines={1}>
            Your Location
          </Text>
          {isLoading ? (
            // <ActivityIndicator size="small" color={COLOR.primary} />
            <Text style={styles.locationAddress} numberOfLines={1}>
              ...Loading
            </Text>
          ) : (
            <Text style={styles.locationAddress} numberOfLines={1}>
              {location}
            </Text>
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.iconsContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('NotificationsScreen');
          }}
        >
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/2529/2529521.png',
            }}
            style={[styles.icon, {marginRight: 15, tintColor: COLOR.primary}]}
          />
        </TouchableOpacity>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/128/17446/17446833.png',
          }}
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
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  locationTextContainer: {
    marginLeft: 8,
    flex: 1,
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
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});

export default MainHomeHeader;