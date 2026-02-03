import React, { useRef, useEffect, useState, useContext } from 'react';
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
  Alert,
  Platform,
  Animated,
} from 'react-native';
import { COLOR } from '../../../Constants/Colors';
import messaging from '@react-native-firebase/messaging';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Typography } from '../../../Components/UI/Typography';
import MainHomeHeader from './MainHomeHeader';
import { images } from '../../../Components/UI/images';
import Input from '../../../Components/Input';
import { useIsFocused } from '@react-navigation/native';
import { GET, GET_WITH_TOKEN, POST_FORM_DATA, POST_WITH_TOKEN } from '../../../Backend/Api';
import { CLEAR_CART, FCM_UPDATE, GET_BOOKING_LIST, GET_CART, GET_PROFILE, HOME } from '../../../Constants/ApiRoute';
import { Font } from '../../../Constants/Font';
import Video from 'react-native-video';
import { cleanImageUrl, ToastMsg, windowHeight, windowWidth } from '../../../Backend/Utility';
import CartModal from '../../../Components/CartModal';
import Chatbot from '../Dashboard/Chatbot';
import { useSelector } from 'react-redux';
import { fcmService } from '../../../Notification/FMCService';

const { width } = Dimensions.get('window');

const MainHome = ({ navigation }) => {
  const userdata = useSelector(store => store.userDetails);
  const [tokenShow, settokenShow] = useState(null)
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
  const [appointments, setAppointments] = useState([]); // State to store API data

  const topBannerRef = useRef(null);


  const getBookingList = () => {
    setLoading(true);
    GET_WITH_TOKEN(
      `${GET_BOOKING_LIST}?status=pending`,
      success => {
        console.log(success?.data[0]?.vendor?.business_name, 'GET_BOOKING_LIST-->>>');

        setAppointments(success?.data || []); // Set the API data
        setLoading(false);
      },
      error => {
        setLoading(false);
        console.log(error, 'Error in booking list');
      },
      fail => {
        setLoading(false);
        console.log(fail, 'Failed to get booking list');
      },
    );
  };

  const FetchHome = () => {
    setLoading(true);
    GET(
      HOME,
      success => {
        const allBanners = success?.data?.banners || [];
        // console.log(success?.data, "BOOOOKINGSGGSGG");

        setBottomBanners(allBanners.filter(b => b.position === 'bottom' && b?.type == "user"));
        setTopBanners(allBanners.filter(b => b.position === 'top' && b?.type == "user"));
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
  const UpdateFCM = async () => {
    try {
      fcmService.register();
      messaging()
        .getToken()
        .then(fcmToken => {
          console.log(fcmToken, 'MAINHOME__TOKEN====>');
          if (fcmToken) {
            AsyncStorage.setItem('fcm_token', fcmToken);
            // res(fcmToken);
          } else {
            console.log(fcmToken, "ROOTOTOT");

          }
        })
        .catch(error => {
          console.log(error, "ROOTOTOT");
        });
      // 1️⃣ get saved FCM token
      const token = await AsyncStorage.getItem('fcm_token');
      settokenShow(token, "BJJB")
      // optional safety
      if (!token) {
        console.log('No FCM token stored');
        return;
      }

      // 2️⃣ get device id

      // 3️⃣ build form-data
      let formData = new FormData();
      formData.append('device_type', Platform.OS);
      formData.append('device_id', "ABC");
      formData.append('token', token);
      console.log(formData, "FROMMMMM");

      // 4️⃣ send to API
      POST_FORM_DATA(
        `${FCM_UPDATE}/${userdata?.id}`,
        formData,   // ← YOU MISSED THIS EARLIER ✅
        success => {
          console.log(success, 'SUCCESS_FCM_UPDATE');
        },
        error => {
          console.log(error, 'ERROR__HOME');
          setLoading(false);
        },
        fail => {
          console.log(fail, 'ERROR__FAIL');
          setLoading(false);
        },
      );
    } catch (e) {
      console.log('FCM UPDATE ERROR', e);
    }
  };
  useEffect(() => {
    if (isFocused) {
      fetchUserProfile();
      getBookingList()
      FetchHome()
      UpdateFCM()
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

  const bgAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(bgAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);
  const backgroundColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#faf9f9ff", "#fbd19fff"], // normal → highlight
  });

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

  useEffect(() => {
    if (!topBanners?.length) return;

    const interval = setInterval(() => {
      const nextIndex =
        currentTopIndex === topBanners.length - 1
          ? 0
          : currentTopIndex + 1;

      topBannerRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setCurrentTopIndex(nextIndex);
    }, 3000); // ⏱️ change time (ms) as needed

    return () => clearInterval(interval);
  }, [currentTopIndex, topBanners.length]);

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
        {/* <Typography size={18} color='red'>{tokenShow || "JOOO"}</Typography> */}
        {/* My Bookings */}
        {
          appointments?.length > 0 &&
          appointments?.map((i, index) => (
            <Animated.View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                paddingVertical: 10,
                borderRadius: 10,
                borderColor: COLOR.primary,
                backgroundColor,
                marginTop: 10
              }}
            >
              <Image
                source={{ uri: "https://cdn-icons-png.flaticon.com/128/7256/7256192.png" }}
                style={{ width: 25, height: 25, marginLeft: 10 }}
              />

              <TouchableOpacity onPress={() => {
                navigation.navigate('AppointmentDetail', { appointment: i })
              }} style={{ marginLeft: 10, width: windowWidth / 1.45 }}>
                <Typography size={13}>Appointment for {i?.vendor?.business_name}</Typography>
                <Typography size={11}>
                  Booking : Waiting for store confirmation
                </Typography>
              </TouchableOpacity>

              <Image
                source={{ uri: "https://cdn-icons-png.flaticon.com/128/11519/11519985.png" }}
                style={{ width: 25, height: 25, marginLeft: 10 }}
              />
            </Animated.View>

          ))
        }
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
            <>
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
                        resizeMode="stretch"
                      />
                    )}
                  </View>
                )}
              />

              {/* DOTS */}
              <View style={styles.dotsContainer}>
                {topBanners.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      index === currentTopIndex && styles.activeDot,
                    ]}
                  />
                ))}
              </View>
            </>
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
        <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "center" }}>
          <View style={{ borderWidth: 0.1777, width: windowWidth / 2.8 }}> </View>
          <Typography style={{ marginHorizontal: 10, color: COLOR.primary }}>Explore</Typography>
          <View style={{ borderWidth: 0.1777, width: windowWidth / 2.8 }}></View>
        </View>

        {/* Bottom Banner (Manual scroll only) */}
        <TouchableOpacity onPress={() => navigation.navigate("Invite")} style={{ marginVertical: 20, marginBottom: windowHeight * 0.1 }}>
          <Image source={require('../../../assets/Images/banner.jpeg')} style={{ width: windowWidth / 1.1, height: 190, borderRadius: 10, borderWidth: 1, borderRadius: 15, alignSelf: "center", borderColor: COLOR.primary }} resizeMode="stretch" />
          <View style={{ position: "absolute", left: 20, bottom: 20, backgroundColor: COLOR.primary, padding: 8, borderRadius: 10 }}>
            <Typography color={COLOR.white}>Share Invite Code</Typography>
          </View>
        </TouchableOpacity>
      </ScrollView>
      <Chatbot />
      <CartModal />
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
    height: 200,
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
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },

  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#000",
  },

});
