import React, {useRef, useEffect, useState, useContext} from 'react';
import {
  Image,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Platform,
  FlatList,
} from 'react-native';
import {COLOR} from '../../../Constants/Colors';
import {Typography} from '../../../Components/UI/Typography';
import MainHomeHeader from './MainHomeHeader';
import {images} from '../../../Components/UI/images';
import Input from '../../../Components/Input';
import {useIsFocused} from '@react-navigation/native';
import {useApi} from '../../../Backend/Api';
import {AuthContext} from '../../../Backend/AuthContent';
import {GET_PROFILE} from '../../../Constants/ApiRoute';

const {width} = Dimensions.get('window');

const MainHome = ({navigation}) => {
  const [search, setSearch] = useState('');
  const isFocused = useIsFocused();

  const categories = [
    {
      title: 'Salons',
      icon: 'https://cdn-icons-png.flaticon.com/128/1057/1057317.png',
    },
    {
      title: 'Healthcare',
      icon: 'https://cdn-icons-png.flaticon.com/128/2382/2382461.png',
    },
    {
      title: 'Spa',
      icon: 'https://cdn-icons-png.flaticon.com/128/5732/5732044.png',
    },
    {
      title: 'Pet Clinic',
      icon: 'https://cdn-icons-png.flaticon.com/128/616/616408.png',
    },
    {
      title: 'Automotive Car',
      icon: 'https://cdn-icons-png.flaticon.com/128/741/741407.png',
    },
    {
      title: 'Retail/Designer',
      icon: 'https://cdn-icons-png.flaticon.com/128/18302/18302431.png',
    },
    {
      title: 'Tattoo & Piercing',
      icon: 'https://cdn-icons-png.flaticon.com/128/2678/2678993.png',
    },
  ];

  const bookings = [
    {
      id: '1',
      vendor: 'Glamour Salon',
      services: 'Haircut, Facial',
      price: '₹1200',
      date: '20 Aug 2025, 3:00 PM',
      address: '123 Street, Jaipur',
      phone: '+91 9876543210',
    },
    {
      id: '2',
      vendor: 'HealthCare Plus',
      services: 'General Checkup',
      price: '₹500',
      date: '22 Aug 2025, 10:30 AM',
      address: '45 Mall Road, Delhi',
      phone: '+91 9123456789',
    },
  ];

  const banners = [
    'https://images.pexels.com/photos/3997985/pexels-photo-3997985.jpeg',
    'https://images.pexels.com/photos/853427/pexels-photo-853427.jpeg',
    'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
  ];

  // Auto-scroll logic
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef(null);
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % banners.length;
      scrollRef.current?.scrollTo({x: index * width, animated: true});
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isFocused) {
      getProfile();
    }
  }, [isFocused]);
  const getProfile = async () => {
    try {
      const response = await getRequest(GET_PROFILE);
      console.log(response, 'GET_PROFILE--->>>');
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <MainHomeHeader />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={{marginTop: -10, marginBottom: 10}}>
          <Input
            value={search}
            onChangeText={v => setSearch(v)}
            leftIcon={images.search}
            placeholder="Search for services..."
            inputContainer={{borderColor: COLOR.lightGrey}}
            style={{marginLeft: 5}}
            rightIcon={search !== '' ? images.cross2 : ''}
            rightIconStyle={{height: 14, width: 14}}
            onRightIconPress={() => setSearch('')}
          />
        </View>

        {/* My Bookings */}
        {bookings.length > 0 && (
          <View>
            <Typography
              size={16}
              fontWeight="600"
              style={[styles.sectionTitle, {marginLeft: 5}]}>
              My Bookings
            </Typography>
            <FlatList
              data={bookings}
              horizontal
              contentContainerStyle={{marginHorizontal: 5}}
              showsHorizontalScrollIndicator={false}
              renderItem={({item, index}) => {
                return (
                  <View key={item.id} style={styles.bookingCard}>
                    <Typography
                      size={17}
                      fontWeight="bold"
                      style={styles.bookingVendor}>
                      {item.vendor}
                    </Typography>
                    <Typography size={13} style={styles.bookingText}>
                      Services:{' '}
                      <Typography fontWeight="600" color="#7b4ce0">
                        {item.services}
                      </Typography>
                    </Typography>
                    <Typography size={13} style={styles.bookingText}>
                      Price:{' '}
                      <Typography fontWeight="600" color="#7b4ce0">
                        {item.price}
                      </Typography>
                    </Typography>
                    <Typography size={13} style={styles.bookingText}>
                      Date:{' '}
                      <Typography fontWeight="600" color="#7b4ce0">
                        {item.date}
                      </Typography>
                    </Typography>
                    <Typography size={13} style={styles.bookingText}>
                      Address: {item.address}
                    </Typography>
                    <Typography size={13} style={styles.bookingText}>
                      Phone:{' '}
                      <Typography fontWeight="600" color="#7b4ce0">
                        {item.phone}
                      </Typography>
                    </Typography>
                  </View>
                );
              }}
            />
          </View>
        )}

        {/* Auto-scroll Banner */}
        <View style={{marginVertical: 20}}>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {x: scrollX}}}],
              {useNativeDriver: false},
            )}
            scrollEventThrottle={16}>
            {banners.map((img, index) => (
              <Image
                key={index}
                source={{uri: img}}
                style={styles.bannerImage}
              />
            ))}
          </ScrollView>
        </View>

        {/* Service Categories */}
        <Typography
          size={16}
          fontWeight="600"
          style={[styles.sectionTitle, {marginLeft: 5}]}>
          Service Categories
        </Typography>
        <FlatList
          data={categories}
          numColumns={2}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() => navigation.navigate('SearchServices')}
                key={index}
                style={styles.categoryCard}>
                <Image source={{uri: item.icon}} style={styles.categoryIcon} />
                <Typography size={14} style={styles.categoryText}>
                  {item.title}
                </Typography>
              </TouchableOpacity>
            );
          }}
        />

        {/* Another Banner */}
        <View style={{marginVertical: 20}}>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {x: scrollX}}}],
              {useNativeDriver: false},
            )}
            scrollEventThrottle={16}>
            {banners.map((img, index) => (
              <Image
                key={index}
                source={{uri: img}}
                style={styles.bannerImage}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

export default MainHome;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLOR.white, paddingHorizontal: 15},

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.white,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#EBEBEA',
    marginHorizontal: 5,
  },
  searchIcon: {width: 20, height: 20, marginRight: 8},
  searchInput: {flex: 1, color: 'black'},

  // My Bookings
  bookingCard: {
    width: width * 0.7,
    backgroundColor: '#f0ebf8',
    borderRadius: 10,
    padding: 15,
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  bookingVendor: {fontSize: 16, fontWeight: 'bold', marginBottom: 5},
  bookingText: {fontSize: 13, marginBottom: 2, color: '#333'},

  // Banner
  bannerImage: {
    width: width - 30,
    height: 150,
    borderRadius: 10,
    marginRight: 10,
  },

  // Categories
  sectionTitle: {fontSize: 16, fontWeight: '600', marginVertical: 10},
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 5,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#f7f5fa',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    marginHorizontal: 5,
  },
  categoryIcon: {width: 40, height: 40},
  categoryText: {marginTop: 5},

  // My Bookings
  bookingCard: {
    width: width * 0.75,
    borderRadius: 15,
    padding: 15,
    marginRight: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    backgroundColor: '#fff',
    borderLeftWidth: 6,
    borderWidth: 1,
    borderColor: COLOR.primary,
    borderLeftColor: '#7b4ce0', // accent stripe
  },
  bookingVendor: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.primary,
  },
  bookingText: {
    fontSize: 13,
    marginBottom: 4,
    color: '#444',
  },
  bookingHighlight: {
    fontWeight: '600',
    color: '#7b4ce0',
  },

  // Banner
  bannerWrapper: {
    marginVertical: 20,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  bannerImage: {
    width: width - 30,
    height: 160,
    borderRadius: 15,
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  bannerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bannerSub: {
    color: '#f5d742',
    fontSize: 14,
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    backgroundColor: COLOR.primary,
    borderRadius: 20,
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 1000,
  },
  fabIcon: {
    width: 40,
    height: 35,
    // tintColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 5 : 0,
    paddingTop: Platform.OS === 'android' ? 10 : 0,
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLOR.black,
  },
});
