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
import {GET_WITH_TOKEN, useApi} from '../../../Backend/Api';
import {AuthContext} from '../../../Backend/AuthContent';
import {GET_PROFILE, HOME} from '../../../Constants/ApiRoute';
import {Font} from '../../../Constants/Font';
import Video from 'react-native-video';

const {width} = Dimensions.get('window');

const MainHome = ({navigation}) => {
  const [search, setSearch] = useState('');
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [topBanners, setTopBanners] = useState([]);
  const [bottomBanners, setBottomBanners] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (isFocused) {
      fetchUserProfile();
      setLoading(true);
      GET_WITH_TOKEN(
        HOME,
        success => {
          console.log(success);
          const allBanners = success?.data?.banners || [];
          setBottomBanners(allBanners.filter(b => b.position === 'bottom'));
          setTopBanners(allBanners.filter(b => b.position === 'top'));
          setMyBookings(success?.data?.self_bookings);
          setCategories(success?.data?.categories);
          setLoading(false);
        },
        error => setLoading(false),
        fail => setLoading(false),
      );
    }
  }, [isFocused]);

  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef(null);

  useEffect(() => {
    if (bottomBanners.length === 0) return;

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % bottomBanners.length;
      scrollRef.current?.scrollToOffset({
        offset: index * width,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [bottomBanners]);

  global.fetchUserProfile = () => {
    GET_WITH_TOKEN(
      GET_PROFILE,
      success => {
        console.log(success, 'successsuccesssuccess-->>>');
      },
      error => {
        console.log(error, 'errorerrorerror>>');
      },
      fail => {},
    );
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
            style={{marginLeft: 5, fontFamily: Font.semibold}}
            rightIcon={search !== '' ? images.cross2 : ''}
            rightIconStyle={{height: 14, width: 14}}
            onRightIconPress={() => setSearch('')}
          />
        </View>

        {/* My Bookings */}
        {myBookings.length > 0 && (
          <View>
            <Typography
              size={16}
              font={Font.semibold}
              style={[styles.sectionTitle, {marginLeft: 5}]}>
              My Bookings
            </Typography>
            <FlatList
              data={myBookings}
              horizontal
              contentContainerStyle={{marginHorizontal: 5}}
              showsHorizontalScrollIndicator={false}
              renderItem={({item, index}) => {
                return (
                  <View key={item.id} style={styles.bookingCard}>
                    <Typography
                      size={17}
                      font={Font.medium}
                      style={styles.bookingVendor}>
                      {/* {item.vendor} */}
                    </Typography>
                    <Typography
                      font={Font.medium}
                      size={13}
                      style={styles.bookingText}>
                      Services:{' '}
                      <Typography font={Font.medium} color="#7b4ce0">
                        {/* {item.services} */}
                      </Typography>
                    </Typography>
                    <Typography
                      font={Font.medium}
                      size={13}
                      style={styles.bookingText}>
                      Price:{' '}
                      <Typography font={Font.medium} color="#7b4ce0">
                        {/* {item.price} */}
                      </Typography>
                    </Typography>
                    <Typography
                      font={Font.medium}
                      size={13}
                      style={styles.bookingText}>
                      Date:{' '}
                      <Typography font={Font.medium} color="#7b4ce0">
                        {/* {item.date} */}
                      </Typography>
                    </Typography>
                    <Typography
                      font={Font.medium}
                      size={13}
                      style={styles.bookingText}>
                      Address:
                      {/* {item.address} */}
                    </Typography>
                    <Typography
                      font={Font.medium}
                      size={13}
                      style={styles.bookingText}>
                      Phone:{' '}
                      <Typography font={Font.medium} color="#7b4ce0">
                        {/* {item.phone} */}
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
          {topBanners.length > 0 && (
            <FlatList
              ref={scrollRef}
              data={topBanners}
              horizontal
              pagingEnabled
              keyExtractor={item => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => (
                <TouchableOpacity onPress={() => setPaused(!paused)}>
                  <Video
                    source={{uri}}
                    style={styles.bannerImage}
                    resizeMode="cover"
                    repeat
                    paused={paused}
                    muted
                  />
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        {/* Service Categories */}
        <Typography
          size={16}
          font={Font.semibold}
          style={[styles.sectionTitle, {marginLeft: 5}]}>
          Service Categories
        </Typography>
        <FlatList
          data={categories}
          numColumns={2}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('SearchServices', {
                    id: item?.id,
                  })
                }
                key={index}
                style={styles.categoryCard}>
                <Image
                  source={{uri: item?.image}}
                  style={styles.categoryIcon}
                />
                <Typography
                  font={Font.medium}
                  size={14}
                  style={styles.categoryText}>
                  {item?.name}
                </Typography>
              </TouchableOpacity>
            );
          }}
        />

        {/* Another Banner */}
        <View style={{marginVertical: 20}}>
          {bottomBanners.length > 0 && (
            <FlatList
              ref={scrollRef}
              data={bottomBanners}
              horizontal
              pagingEnabled
              keyExtractor={item => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => (
                <View style={{width}}>
                  <Image
                    source={{uri: item?.image}}
                    style={styles.bannerImage}
                  />
                </View>
              )}
            />
          )}
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
