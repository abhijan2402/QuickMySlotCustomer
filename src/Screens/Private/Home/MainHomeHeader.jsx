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
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {COLOR} from '../../../Constants/Colors';

const MainHomeHeader = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState('Getting location...');
  const [currentLocation, setCurrentLocation] = useState(null);
  const isFocus = useIsFocused();
  const getCurrentLocation = async () => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission Required',
            message:
              'This app needs access to your location to provide better services.',
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
          position => resolve(position?.coords),
          error => reject(new Error(error.message || 'Error getting location')),
        );
      });
    } catch (error) {
      throw new Error(error.message || 'Error checking location permissions');
    }
  };
  const fetchLocation = async () => {
    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
    } catch (error) {
      alert ('dddd' + JSON.stringify(error));
      // ToastMsg(error?.message);
    }
  };
  useEffect(() => {
    fetchLocation();
  }, [isFocus]);

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.locationContainer}
        onPress={fetchLocation}>
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
          <Text style={styles.locationAddress} numberOfLines={1}>
            {location}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.iconsContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('NotificationsScreen');
          }}>
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
    backgroundColor: '#fff',
    // elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
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
