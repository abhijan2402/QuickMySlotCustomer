import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
  TextInput,
  Dimensions,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { COLOR } from '../../../Constants/Colors';
import { images } from '../../../Components/UI/images';
import { Typography } from '../../../Components/UI/Typography';
import { Font } from '../../../Constants/Font';
import { GOOGLE_API } from '../../../Backend/Utility';
import { useDispatch, useSelector } from 'react-redux';
import { currentLocation } from '../../../Redux/action';
import SimpleModal from '../../../Components/UI/SimpleModal';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const MainHomeHeader = () => {
  const navigation = useNavigation();
  const userdata = useSelector(store => store.userDetails);
  const storedLocation = useSelector(store => store.currentLocation);

  // console.log(userdata, 'userdatauserdatauserdata');

  const [location, setLocation] = useState('Getting location...');
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const dispatch = useDispatch();
  const isFocus = useIsFocused();
  const [showPred, setshowPred] = useState(false)

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
        Geolocation.getCurrentPosition(info => {
          resolve(info);
        });
      });
    } catch (error) {
      throw new Error(error.message || 'Error checking location permissions');
    }
  };

  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API}`,
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
      console.log(locationData, 'locationData---->>');
      const address = await getAddressFromCoordinates(
        locationData.coords.latitude,
        locationData.coords.longitude,
      );
      setLocation(address);

      // Set initial map region to current location
      setMapRegion({
        latitude: locationData.coords.latitude,
        longitude: locationData.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      setSelectedLocation({
        latitude: locationData.coords.latitude,
        longitude: locationData.coords.longitude,
      });

      dispatch(
        currentLocation({ address: address, coords: locationData.coords }),
      );
    } catch (error) {
      console.log(error, 'error----->>');
      setLocation('Location unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch location predictions for autocomplete
  const fetchPredictions = async query => {
    if (!query || query.length < 3) {
      setPredictions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          query,
        )}&key=${GOOGLE_API}&components=country:in`, // Adjust country code as needed
      );
      const data = await response.json();
      if (data.predictions) {
        setPredictions(data.predictions);
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
    }
  };

  // Get place details and update map
  const selectPrediction = async placeId => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${GOOGLE_API}`,
      );
      const data = await response.json();
      if (data.result && data.result.geometry) {
        const { location } = data.result.geometry;
        setMapRegion({
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        setSelectedLocation({
          latitude: location.lat,
          longitude: location.lng,
        });
        setSearchQuery(data.result.formatted_address);
        setPredictions([]);
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  const handleMapRegionChange = region => {
    setMapRegion(region);
  };

  const handleMarkerDragEnd = e => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    updateAddressFromCoordinates(latitude, longitude);
  };

  const updateAddressFromCoordinates = async (lat, lng) => {
    try {
      const address = await getAddressFromCoordinates(lat, lng);
      setSearchQuery(address);
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  const confirmLocation = async () => {
    if (selectedLocation) {
      const address = await getAddressFromCoordinates(
        selectedLocation.latitude,
        selectedLocation.longitude,
      );
      setLocation(address);
      dispatch(
        currentLocation({
          address: address,
          coords: {
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
          },
        }),
      );
    }
  };

  useEffect(() => {
    if (!storedLocation?.address) {
      fetchLocation();
    } else {
      setLocation(storedLocation?.address);
      setSearchQuery(storedLocation?.address);
      setMapRegion({
        latitude: storedLocation.coords.latitude,
        longitude: storedLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setSelectedLocation({
        latitude: storedLocation.coords.latitude,
        longitude: storedLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
    setSearchQuery(null)
    setshowPred(false)
  }, [isFocus]);
  useEffect(() => {
    setshowPred(false)
  }, [modalVisible])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPredictions(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.locationContainer}
        onPress={() => setModalVisible(true)}
        disabled={isLoading}>
        <Image
          source={images.mark}
          style={[styles.icon, { tintColor: COLOR.primary }]}
        />
        <View style={styles.locationTextContainer}>
          <Text style={styles.locationTitle} numberOfLines={1}>
            Your Location
          </Text>
          {isLoading ? (
            <Text style={styles.locationAddress} numberOfLines={1}>
              Loading...
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
          activeOpacity={0.99}
          onPress={() => {
            navigation.navigate('OffersScreen');
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 5,
              backgroundColor: COLOR.extraLightGrey,
              padding: 5,
              borderRadius: 15,
              paddingHorizontal: 10,
              elevation: 2,
            }}>
            <Image
              source={images.offer}
              style={[styles.icon, { marginRight: 10 }]}
            />
            <Typography>Offers</Typography>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('NotificationsScreen');
          }}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/2529/2529521.png',
            }}
            style={[styles.icon, { marginRight: 10, tintColor: COLOR.primary }]}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <Image
            source={userdata?.image ? { uri: userdata?.image } : images.profile}
            style={[
              styles.icon,
              {
                borderRadius: 20,
                height: 35,
                minWidth: 35,
                backgroundColor: COLOR.lightGrey,
              },
            ]}
          />
        </TouchableOpacity>
      </View>
      <SimpleModal
        visible={modalVisible}
        modalContainer={{
          width: '90%',
        }}
      //   onClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.modalTitle}>Select Location</Text>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}>
              <Image source={images.close} style={{ height: 20, width: 20 }} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={fetchLocation} style={{ padding: 10, borderWidth: 1, alignItems: "center", marginVertical: 10, borderRadius: 10, borderColor: COLOR.primary }}>
            <Typography color={COLOR.primary} fontFamily={Font.semibold}>Use your current location</Typography>
          </TouchableOpacity>
          <Typography textAlign={"center"} style={{ marginBottom: 10 }}>Or</Typography>
          {/* Search Input */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a location..."
              placeholderTextColor={COLOR.lightGrey}
              value={searchQuery}
              onChangeText={(val) => {
                setSearchQuery(val)
                setshowPred(true)
              }}
            />
          </View>

          {showPred && predictions?.length > 0 && (
            <View style={styles.predictionsContainer}>
              {predictions.map(prediction => (
                <TouchableOpacity
                  key={prediction.place_id}
                  style={styles.predictionItem}
                  onPress={() => { selectPrediction(prediction.place_id); setshowPred(false) }}>
                  <Text style={styles.predictionText}>
                    {prediction.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Map View */}
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              region={mapRegion}
              onRegionChangeComplete={handleMapRegionChange}
              showsUserLocation={true}

              showsMyLocationButton={true}>
              {selectedLocation && (
                <Marker
                  coordinate={selectedLocation}
                  draggable
                  onDragEnd={handleMarkerDragEnd}
                  pinColor={COLOR.primary}
                />
              )}
            </MapView>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => {
              confirmLocation();
              setModalVisible(false);
            }}>
            <Text style={styles.confirmButtonText}>Confirm Location</Text>
          </TouchableOpacity>
        </View>
      </SimpleModal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 6,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
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
    fontFamily: Font.semibold,
  },
  locationAddress: {
    fontSize: 14,
    fontFamily: Font.medium,
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
  modalContent: {},
  modalTitle: {
    fontSize: 18,
    fontFamily: Font.bold,
    color: COLOR.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: Font.regular,
  },
  predictionsContainer: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  predictionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  predictionText: {
    fontSize: 14,
    fontFamily: Font.regular,
    color: '#333',
  },
  mapContainer: {
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  confirmButton: {
    backgroundColor: COLOR.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: Font.semibold,
  },
});

export default MainHomeHeader;
