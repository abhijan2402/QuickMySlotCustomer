import React, { useRef, useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
  SafeAreaView,
  StatusBar,
  BackHandler,
} from 'react-native';
import { COLOR } from '../../../Constants/Colors';
import { Typography } from '../../../Components/UI/Typography';
import MainHomeHeader from './MainHomeHeader';
import { images } from '../../../Components/UI/images';
import Input from '../../../Components/Input';
import { useIsFocused } from '@react-navigation/native';
import { GET, GET_WITH_TOKEN } from '../../../Backend/Api';
import { GET_CART, GET_PROFILE, HOME } from '../../../Constants/ApiRoute';
import { Font } from '../../../Constants/Font';
import Video from 'react-native-video';
import { cleanImageUrl, windowHeight, windowWidth } from '../../../Backend/Utility';

const { width } = Dimensions.get('window');

const MainHome = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [topBanners, setTopBanners] = useState([]);
  // console.log(JSON.stringify(topBanners), 'topBanners----->');
  const [totalItemsVal, settotalItemsVal] = useState(0)
  const [shopData, setShopData] = useState(null);
  const [bottomBanners, setBottomBanners] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentTopIndex, setCurrentTopIndex] = useState(0);

  const topBannerRef = useRef(null);
  const FetchHome = () => {
    setLoading(true);
    GET(
      HOME,
      success => {
        console.log(success?.data, 'home--->>>');
        const allBanners = success?.data?.banners || [];
        setBottomBanners(allBanners.filter(b => b.position === 'bottom'));
        setTopBanners(allBanners.filter(b => b.position === 'top'));
        setMyBookings(success?.data?.self_bookings || []);
        setCategories(success?.data?.categories || []);
        setLoading(false);
      },
      error => {
        console.log(error, "ERROR__HOME");

        setLoading(false)
      },
      fail => {
        console.log(fail, "ERROR__FAILß");
        setLoading(false)
      },
    );
  }
  useEffect(() => {
    if (isFocused) {
      getCart()
      fetchUserProfile();
      FetchHome()
    }
  }, [isFocused]);

  // Handle video end (only manual swipe to next)
  const handleVideoEnd = index => {
    if (topBanners.length <= 1) return;
    const nextIndex = (index + 1) % topBanners.length;
    setCurrentTopIndex(nextIndex);
  };

  // Handle scroll for top banners
  const handleTopScroll = event => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const newIndex = Math.floor(contentOffset.x / viewSize.width);
    if (newIndex !== currentTopIndex) {
      setCurrentTopIndex(newIndex);
    }
  };

  global.fetchUserProfile = () => {
    GET_WITH_TOKEN(
      GET_PROFILE,
      success => {
        console.log(success, 'successsuccesssuccess-->>>');
      },
      error => {
        console.log(error, 'errorerrorerror>>');
      },
      fail => { },
    );
  };

  const formatScheduleTime = scheduleTime => {
    if (!scheduleTime) return 'Not scheduled';
    const timeKey = Object.keys(scheduleTime)[0];
    const date = scheduleTime[timeKey];
    return `${timeKey} on ${date}`;
  };

  const getCart = () => {
    GET_WITH_TOKEN(
      GET_CART,
      success => {
        const items = success?.data?.items || [];
        settotalItemsVal(success?.data)
        let vendorInfo = null;

        if (items?.length > 0 && items[0]?.service?.user) {
          vendorInfo = items[0].service.user;
        }
        setShopData(vendorInfo)

      },
      error => {
        console.log('Cart fetch error:', error);
      },
      fail => {
        console.log('Cart fetch fail:', fail);
      },
    );
  };
  useEffect(() => {
    if (isFocused) {
      const backAction = () => {
        BackHandler.exitApp();
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    }
  }, [isFocused]);

  return (
    <View style={[styles.container, {}]}>
      <MainHomeHeader />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('SearchServices', { id: '' });
          }}
          style={{ marginTop: -10, marginBottom: 10 }}>
          <Input
            onPress={() => {
              navigation.navigate('SearchServices', { id: '' });
            }} value={search}
            editable={false}
            onChangeText={v => setSearch(v)}
            leftIcon={images.search}
            placeholder="Search for services..."
            inputContainer={{ borderColor: COLOR.lightGrey }}
            style={{ marginLeft: 5, fontFamily: Font.semibold }}
            rightIcon={search !== '' ? images.cross2 : ''}
            rightIconStyle={{ height: 14, width: 14 }}
            onRightIconPress={() => setSearch('')}
          />
        </TouchableOpacity>
        {/* My Bookings */}
        {myBookings.length > 0 && (
          <View>
            <Typography
              size={16}
              font={Font.semibold}
              style={[styles.sectionTitle, { marginLeft: 5 }]}>
              My Bookings
            </Typography>
            <FlatList
              data={myBookings.slice(0, 3)}
              horizontal
              contentContainerStyle={{ marginHorizontal: 5 }}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View key={item.id} style={styles.bookingCard}>
                  <Typography
                    size={17}
                    font={Font.medium}
                    style={styles.bookingVendor}>
                    {item.service?.name || 'Service'}
                  </Typography>
                  <Typography
                    font={Font.medium}
                    size={13}
                    style={styles.bookingText}>
                    Vendor:{' '}
                    <Typography font={Font.medium} color="#7b4ce0">
                      {item.vendor?.name || 'N/A'}
                    </Typography>
                  </Typography>
                  <Typography
                    font={Font.medium}
                    size={13}
                    style={styles.bookingText}>
                    Price:{' '}
                    <Typography font={Font.medium} color="#7b4ce0">
                      ₹{item.amount}
                    </Typography>
                  </Typography>
                  <Typography
                    font={Font.medium}
                    size={13}
                    style={styles.bookingText}>
                    Scheduled:{' '}
                    <Typography font={Font.medium} color="#7b4ce0">
                      {formatScheduleTime(item.schedule_time)}
                    </Typography>
                  </Typography>
                  <Typography
                    font={Font.medium}
                    size={13}
                    style={styles.bookingText}>
                    Status:{' '}
                    <Typography
                      font={Font.medium}
                      color={
                        item.status === 'completed'
                          ? 'green'
                          : item.status === 'pending'
                            ? 'orange'
                            : 'red'
                      }>
                      {item.status}
                    </Typography>
                  </Typography>
                </View>
              )}
            />
          </View>
        )}

        {/* Top Banner (Manual scroll only) */}
        <View style={{ marginVertical: 20 }}>
          {topBanners.length > 0 && (
            <FlatList
              ref={topBannerRef}
              data={topBanners}
              horizontal
              pagingEnabled
              onScroll={handleTopScroll}
              scrollEventThrottle={16}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item, index }) => (
                <View style={{ width: width - 30 }}>
                  {item.extensions === 'video' ? (
                    <Video
                      source={{ uri: item.image }}
                      style={styles.bannerImage}
                      resizeMode="cover"
                      repeat={false}
                      paused={index != currentTopIndex}
                      muted={false}
                      onEnd={() => handleVideoEnd(index)}
                    />
                  ) : (
                    <Image
                      source={{ uri: cleanImageUrl(item.image) }}
                      style={styles.bannerImage}
                    />
                  )}
                </View>
              )}
            />
          )}
        </View>

        {/* Service Categories */}
        <Typography
          size={16}
          font={Font.semibold}
          style={[styles.sectionTitle, { marginLeft: 5 }]}>
          Service Categories
        </Typography>
        <FlatList
          data={categories}
          numColumns={2}
          contentContainerStyle={styles.categories}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('SearchServices', { id: item?.id })
                }
                key={index}
                style={styles.categoryCard}>
                {item.image ? (
                  <Image
                    source={{ uri: cleanImageUrl(item.image) }}
                    style={styles.categoryIcon}
                  />
                ) : (
                  <View
                    style={[
                      styles.categoryIcon,
                      {
                        backgroundColor: '#e0e0e0',
                        justifyContent: 'center',
                        alignItems: 'center',
                      },
                    ]}>
                    <Typography size={12} color="#666">
                      No Image
                    </Typography>
                  </View>
                )}
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


        {/* Bottom Banner (Manual scroll only) */}
        <View style={{ marginVertical: 20, marginBottom: windowHeight * 0.1 }}>
          {bottomBanners.length > 0 && (
            <FlatList
              data={bottomBanners}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <View style={{ width: width - 30 }}>
                  {item.extensions === 'video' ? (
                    <Video
                      source={{ uri: item.image }}
                      style={styles.bannerImage}
                      resizeMode="cover"
                      repeat={false}
                      paused={index != currentTopIndex}
                      muted={false}
                      onEnd={() => handleVideoEnd(index)}
                    />
                  ) : (
                    <Image
                      source={{ uri: item.image }}
                      style={styles.bannerImage}
                    />
                  )}
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>
      {
        totalItemsVal?.items?.length > 0 &&
        <View style={{ borderWidth: 1, flexDirection: "row", padding: 10, borderWidth: 1, borderColor: COLOR.primary, borderRadius: 7, alignItems: "center", position: "absolute", bottom: 10, alignSelf: "center", backgroundColor: COLOR.white }}>
          <View style={{ width: windowWidth / 1.5555 }}>
            <Typography size={16} font={Font.semibold}>{shopData?.business_name || 'Shop Name'}</Typography>
            <Typography size={13} color={COLOR.black} font={Font.regular}>{totalItemsVal?.total_items} {totalItemsVal?.total_items == 1 ? "item" : "items"}</Typography>
          </View>
          <TouchableOpacity onPress={() =>
            navigation.navigate('BookingScreen')
          } style={{ marginVertical: 6, backgroundColor: COLOR.primary, padding: 5, borderRadius: 6, paddingHorizontal: 10 }}>
            <Typography color={COLOR.white} size={15}>View cart</Typography>
          </TouchableOpacity>
        </View>
      }
    </View>
  );
};

export default MainHome;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLOR.white, paddingHorizontal: 15 },

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
    borderLeftColor: '#7b4ce0',
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

  // Banner
  bannerImage: {
    width: '100%',
    height: 150,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
  },

  // Categories
  sectionTitle: { fontSize: 16, fontWeight: '600', marginVertical: 10 },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 5,
  },
  categoryCard: {
    width: width / 2 - 30,
    backgroundColor: '#f7f5fa',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    marginHorizontal: 5,
  },
  categoryIcon: {
    width: 80,
    height: 80,
    marginBottom: 8,
    // backgroundColor: '#e0e0e0',
    borderRadius: 20,
  },
  categoryText: { textAlign: 'center' },
});
