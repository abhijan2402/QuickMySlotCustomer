import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { COLOR } from '../../../Constants/Colors';
import HomeHeader from '../../../Components/HomeHeader';
import ImageSwiper from './ServiceImageSwiper';
import CouponCarousel from './CouponCarousel';
import { FlatList } from 'react-native';
import {
  handleCall,
  handleOpenMap,
  onShare,
  openMapWithDirections,
} from '../../../Constants/Utils';
import SimpleModal from '../../../Components/UI/SimpleModal';
import { Font } from '../../../Constants/Font';
import {
  ADD_TO_WISHLIST,
  PROMO_VENDOR,
  REMOVE_TO_WISHLIST,
  VENDOR_DETAIL,
} from '../../../Constants/ApiRoute';
import { useIsFocused } from '@react-navigation/native';
import { GET_WITH_TOKEN, POST_FORM_DATA, POST_WITH_TOKEN } from '../../../Backend/Api';
import { Typography } from '../../../Components/UI/Typography';
import moment from 'moment';
import { cleanImageUrl } from '../../../Backend/Utility';
import Divider from '../../../Components/Divider';
import CartModal from '../../../Components/CartModal';

const ProviderDetails = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState('Services');
  const { width } = Dimensions.get('window');
  const [like, setLike] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [promoData, setPromoData] = useState([]);
  const isFocused = useIsFocused();
  const id = route?.params?.id;
  const km = route?.params?.km
  const [category, setCategory] = useState(null)
  useEffect(() => {
    if (isFocused) {
      getPromo();
    }
  }, [isFocused]);

  const getPromo = () => {
    setLoading(true);
    GET_WITH_TOKEN(
      PROMO_VENDOR + id,
      success => {
        setPromoData(success?.data);
        setLoading(false);
      },
      error => {
        setLoading(false);
        console.log(success);
      },
      fail => {
        setLoading(false);
        console.log(fail);
      },
    );
  };

  const allDays = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  const handleWishList = async (likeStatus) => {
    const formData = new FormData();
    formData.append('vendorId', id);
    console.log(formData);

    POST_FORM_DATA(
      likeStatus ? `${REMOVE_TO_WISHLIST}/${id}` : ADD_TO_WISHLIST,
      formData,
      success => {
        console.log('Calling API:', success);
        setLike(true);
        ShopFetch()
        setLoading(null);
      },
      error => {
        console.log(error, "ERRORORRORORO");

        setLoading(null);
      },
      fail => {
        console.log('Calling API:', fail);
        setLoading(null);
      },
    );
  };

  const removewishlist = async (id) => {
    const formData = new FormData();
    formData.append('vendorId', id);
    console.log(formData);

    POST_WITH_TOKEN(`${REMOVE_TO_WISHLIST}/${id}`,
      {},
      success => {
        console.log('Calling API:', success);
        setLike(false);
        setLoading(null);
        ShopFetch()
      },
      error => {
        console.log(error, "ERRORORRORORO");

        setLoading(null);
      },
      fail => {
        console.log('Calling API:', fail);
        setLoading(null);
      },
    );
  };
  // https://api.quickmyslot.com/public/api/customer/wishlist-remove/24

  const daysData = allDays.map(day => {
    const isWorking = apiData?.working_days?.includes(day);
    return {
      day: day.charAt(0).toUpperCase() + day.slice(1),
      time: isWorking
        ? `${apiData?.daily_start_time || '09:00'} - ${apiData?.daily_end_time || '18:00'
        }`
        : 'Closed',
    };
  });
  const currentDayIndex = new Date().getDay();
  const adjustedDayIndex = (currentDayIndex + 6) % 7;

  const amenities = [
    { id: '1', name: 'Air Conditioned' },
    { id: '2', name: 'Wi-Fi' },
    { id: '3', name: 'Parking' },
    { id: '4', name: 'Multiple Payment Option' },
    // Add more as needed
  ];
  const ShopFetch = () => {
    setLoading(true);
    GET_WITH_TOKEN(
      VENDOR_DETAIL + `${id}`,
      success => {
        setCategory(success?.data?.service_category)
        setApiData(success?.data);
        setLoading(false);
      },
      error => setLoading(false),
      fail => setLoading(false)``,
    );
  }
  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      ShopFetch()
    }
  }, [isFocused]);
  const [statusText, setStatusText] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (
      apiData?.working_days &&
      apiData?.daily_start_time &&
      apiData?.daily_end_time
    ) {
      const today = moment().format('dddd').toLowerCase(); // e.g. 'monday'
      const isWorkingDay = apiData.working_days.includes(today);

      const start = moment(apiData.daily_start_time, 'HH:mm');
      const end = moment(apiData.daily_end_time, 'HH:mm');
      const now = moment();

      if (isWorkingDay && now.isBetween(start, end)) {
        // ✅ OPEN
        setIsOpen(true);
        setStatusText(`Open Now · Closes at ${end.format('hh:mm A')}`);
      } else {
        // ❌ CLOSED → find next working day
        setIsOpen(false);

        let nextDay = null;
        for (let i = 1; i <= 7; i++) {
          const checkDay = moment().add(i, 'days').format('dddd').toLowerCase();
          if (apiData.working_days.includes(checkDay)) {
            nextDay = moment().add(i, 'days').format('dddd'); // Capitalized name
            break;
          }
        }

        if (nextDay) {
          setStatusText(
            `Closed Now · Opens ${nextDay} at ${start.format('hh:mm A')}`,
          );
        } else {
          setStatusText('Closed Now');
        }
      }
    }
  }, [apiData]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={{ paddingHorizontal: 15 }}>
        <HomeHeader
          title="Provider Details"
          leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
          leftTint={COLOR.primary}
          onLeftPress={() => navigation.goBack()}
        />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
        {
          apiData?.portfolio_images &&
          <ImageSwiper data={apiData?.portfolio_images} />}

        <View style={{ flexDirection: "row", alignItems: "center", position: "absolute", backgroundColor: COLOR.buttonDisabled, padding: 5, borderRadius: 5, right: 10, top: 15, paddingHorizontal: 10 }}>
          <Typography size={14} style={{ marginRight: 5 }}>3.4</Typography>
          <Image source={{ uri: "https://cdn-icons-png.flaticon.com/128/2107/2107957.png" }} style={{ width: 15, height: 15 }} />

        </View>
        {/* Provider Info */}
        <View style={styles.infoContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <Typography style={[styles.title, { width: '70%' }]}>
              {apiData?.business_name || apiData?.company_name}
            </Typography>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => {
                // console.log(apiData, "AARARARAR");

                if (apiData?.iswishlist) {
                  removewishlist(apiData?.wishlistData?.id)
                } else {
                  handleWishList(apiData?.iswishlist ? true : false)
                }
              }

              }>
                <Image
                  source={
                    apiData?.iswishlist
                      ? require('../../../assets/Images/heart.png')
                      : require('../../../assets/Images/like.png')
                  }
                  style={{ height: 24, width: 26, marginRight: 20 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onShare(apiData?.exact_location)}>
                <Image
                  source={require('../../../assets/Images/share.png')}
                  style={{ height: 24, width: 24 }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: -10,
            }}>
            <Typography
              style={[
                { fontSize: 14, marginBottom: 2, fontFamily: Font.medium },
              ]}>
              {apiData?.gender || 'Unisex'}
            </Typography>
            {/* <View
              style={{
                width: 1.5,
                height: 15,
                marginHorizontal: 10,
                backgroundColor: 'black',
              }}
            /> */}
            {/* <Text style={[{fontSize: 16, fontFamily: Font.medium}]}>₹₹</Text> */}
          </View>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
              backgroundColor: COLOR.extraLightGrey,
              paddingVertical: 6,
              paddingHorizontal: 10,
              borderRadius: 6,
              alignSelf: 'flex-start',
            }}>
            {!isOpen && (
              <Image
                source={require('../../../assets/Images/close.png')}
                style={{
                  height: 16,
                  width: 16,
                  marginRight: 5,
                }}
              />
            )}
            <Typography
              style={{
                fontSize: 13,
                fontFamily: Font.regular,
                color: isOpen ? 'green' : 'red',
              }}>
              {statusText}
            </Typography>
            <Image
              source={require('../../../assets/Images/down-arrow.png')}
              style={{ height: 18, width: 10, marginLeft: 6 }}
            />
          </TouchableOpacity>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'wrap',
              marginTop: 10,
            }}>
            <TouchableOpacity
              onPress={() => handleOpenMap(apiData?.exact_location)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
                backgroundColor: COLOR.extraLightGrey,
                paddingVertical: 6,
                paddingHorizontal: 10,
                borderRadius: 6,
                marginRight: 10,
                alignSelf: 'flex-start',
              }}>
              <Image
                source={require('../../../assets/Images/direction.png')}
                style={{ height: 16, width: 16 }}
              />
              <Typography
                style={{
                  fontSize: 13,
                  marginLeft: 5,
                  marginBottom: 2,
                  fontFamily: Font.regular,
                }}>
                Get Directions
              </Typography>
              <View
                style={{
                  width: 1.5,
                  height: 13,
                  marginHorizontal: 5,
                  backgroundColor: 'black',
                }}
              />
              <Typography
                style={{
                  fontSize: 13,
                  marginRight: 5,
                  marginBottom: 2,
                  fontFamily: Font.regular,
                }}>
                {km} Kms
              </Typography>
              <Image
                source={require('../../../assets/Images/rightarrow.png')}
                style={{ height: 18, width: 10 }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleCall(apiData?.phone_number)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
                backgroundColor: COLOR.extraLightGrey,
                paddingVertical: 6,
                paddingHorizontal: 10,
                borderRadius: 6,
                alignSelf: 'flex-start',
              }}>
              <Image
                source={require('../../../assets/Images/call.png')}
                style={{ height: 16, width: 16 }}
              />
              <Typography
                style={{
                  fontSize: 13,
                  marginLeft: 5,
                  fontFamily: Font.regular,
                }}>
                Contact
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.section, { marginTop: 0 }]}>
          <Typography style={styles.sectionTitle}>Address</Typography>
          <Typography style={styles.sectionText}>
            {apiData?.exact_location || apiData?.location_area_served}
          </Typography>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}
            onPress={() => openMapWithDirections(apiData?.exact_location)}>
            <Image
              source={require('../../../assets/Images/location.png')}
              style={{ height: 16, width: 16, tintColor: COLOR.primary }}
            />
            <Typography
              style={[
                styles.sectionText,
                {
                  marginLeft: 10,
                  color: 'blue',
                  textDecorationLine: 'underline',
                  color: COLOR.primary,
                },
              ]}>
              Get Directions
            </Typography>
          </TouchableOpacity>
        </View>
        {/* About */}
        <View style={[styles.section, { marginTop: 0 }]}>
          <Typography style={styles.sectionTitle}>About</Typography>
          <Typography style={styles.sectionText}>
            {apiData?.business_description}
          </Typography>
        </View>
        <CouponCarousel title={"Discount Available for you"} promoData={promoData} cashbackPercentage={apiData?.is_cashback} />

        {/* <CouponCarousel title={"Coupons Available for you"} promoData={promoData} cashbackPercentage={apiData?.is_cashback} /> */}
        {/* Tabs */}
        <View style={{ paddingHorizontal: 20 }}>
          <Typography style={styles.title}>Amenities</Typography>
          <View style={styles.amenityGrid}>
            {amenities.map(item => (
              <View
                key={item.id}
                style={[
                  styles.amenityItem,
                  {
                    width: width * 0.5 - 30, // 2 per row with spacing
                  },
                ]}>
                <Image
                  source={require('../../../assets/Images/checked.png')}
                  style={styles.icon}
                />
                <Text style={styles.amenityText}>{item.name}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.tabContainer}>
          {['Services', 'Photos', 'About', 'Reviews'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}>
              <Typography
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}>
                {tab}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === 'Services' && (
          <View style={styles.section}>
            {/* <Typography style={styles.sectionTitle}>Categories</Typography> */}
            <View style={styles.categoryWrap}>
              {apiData?.sub_services?.length > 0 ? (
                apiData.sub_services.map(sub => (
                  <TouchableOpacity
                    key={sub.id}
                    onPress={() =>
                      navigation.navigate('ServiceList', {
                        subServices: apiData.sub_services,
                        services: apiData.services,
                        subServicesId: sub.id,
                        apiData: apiData,
                        category: category
                      })
                    }
                    style={styles.categoryCard}>
                    <Image
                      source={{ uri: sub.image_url }}
                      style={styles.categoryImage}
                    // resizeMode="stretch"
                    />
                    <Text style={styles.categoryText} numberOfLines={2}>{sub.name}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Typography style={styles.sectionText}>
                  No Sub Services available
                </Typography>
              )}
            </View>
            <Divider />
            <Typography style={[styles.sectionTitle, { marginBottom: 0 }]}>
              Gallery
            </Typography>
            <FlatList
              data={apiData?.portfolio_images}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Image source={{ uri: item?.image_url }} style={styles.photo} />
              )}
            />
            <Divider />

            <Typography style={styles.sectionTitle}>About Us</Typography>
            <Typography style={styles.sectionText}>
              {apiData?.business_description}
            </Typography>
            <Divider />

            <Text style={styles.sectionTitle}>Customer Reviews</Text>
            <FlatList
              data={[1, 2]}
              keyExtractor={(item, index) => index.toString()}
              renderItem={() => (
                <View style={styles.reviewCard}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Image
                        source={require('../../../assets/Images/userprofile.png')}
                        style={{ height: 14, width: 14 }}
                      />
                      <Text style={[styles.reviewUser, { marginLeft: 5 }]}>
                        Priya Sharma
                      </Text>
                    </View>
                    <View>
                      <Text style={[styles.sectionText]}>17th Sep, 2025</Text>
                    </View>
                  </View>
                  <FlatList
                    data={[1, 2, 3, 4, 5]}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    renderItem={() => (
                      <Image
                        source={require('../../../assets/Images/star.png')}
                        style={{
                          height: 14,
                          width: 14,
                          marginTop: 5,
                          marginRight: 5,
                        }}
                      />
                    )}
                  />
                  <Typography style={styles.reviewText}>
                    Amazing service and very friendly staff! Highly recommend
                    this salon.
                  </Typography>
                </View>
              )}
            />
          </View>
        )}
        {activeTab === 'Photos' && (
          <View style={styles.section}>
            <Typography style={[styles.sectionTitle, { marginBottom: 0 }]}>
              Gallery
            </Typography>
            <FlatList
              data={apiData?.portfolio_images}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Image source={{ uri: item?.image_url }} style={styles.photo} />
              )}
            />
          </View>
        )}

        {activeTab === 'About' && (
          <View style={styles.section}>
            <Typography style={styles.sectionTitle}>About Us</Typography>
            <Typography style={styles.sectionText}>
              {apiData?.business_description}
            </Typography>
          </View>
        )}

        {activeTab === 'Reviews' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Reviews</Text>
            <FlatList
              data={[1, 2]}
              keyExtractor={(item, index) => index.toString()}
              renderItem={() => (
                <View style={styles.reviewCard}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Image
                        source={require('../../../assets/Images/userprofile.png')}
                        style={{ height: 14, width: 14 }}
                      />
                      <Text style={[styles.reviewUser, { marginLeft: 5 }]}>
                        Priya Sharma
                      </Text>
                    </View>
                    <View>
                      <Text style={[styles.sectionText]}>17th Sep, 2025</Text>
                    </View>
                  </View>
                  <FlatList
                    data={[1, 2, 3, 4, 5]}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    renderItem={() => (
                      <Image
                        source={require('../../../assets/Images/star.png')}
                        style={{
                          height: 14,
                          width: 14,
                          marginTop: 5,
                          marginRight: 5,
                        }}
                      />
                    )}
                  />
                  <Typography style={styles.reviewText}>
                    Amazing service and very friendly staff! Highly recommend
                    this salon.
                  </Typography>
                </View>
              )}
            />
          </View>
        )}


      </ScrollView>
      <SimpleModal
        visible={isModalVisible}
        modalContainer={{ padding: 0 }}
        onClose={() => setModalVisible(false)}>
        <View>
          <View
            style={{
              backgroundColor: '#72B5EC',
              borderTopRightRadius: 16,
              borderTopLeftRadius: 16,
              padding: 20,
            }}>
            {/* <TouchableOpacity
              style={{position: 'absolute', right: 10, top: 10}}
              onPress={() => setModalVisible(false)}>
              <Image
                source={require('../../../assets/Images/cross.png')}
                style={{height: 24, width: 24}}
              />
            </TouchableOpacity> */}
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '500' }}>Timings</Text>
              <Text style={{ fontSize: 16, marginTop: 5, color: COLOR.white }}>
                All Timings Are In IST
              </Text>
            </View>
          </View>
          <View style={{ padding: 10 }}>
            <FlatList
              data={daysData}
              keyExtractor={item => item.day}
              renderItem={({ item, index }) => (
                <View style={[styles.row]}>
                  <Text
                    style={[
                      index === adjustedDayIndex && styles.highlightedText,
                    ]}>
                    {item.day}
                  </Text>
                  <Text
                    style={[
                      index === adjustedDayIndex && styles.highlightedText,
                      item.time === 'Closed' && {
                        color: 'red',
                        fontWeight: 'bold',
                      },
                    ]}>
                    {item.time}
                  </Text>
                </View>
              )}
            />
          </View>
        </View>
      </SimpleModal>
      <View style={{ marginTop: 40 }}></View>
      <CartModal />
    </View>
  );
};

export default ProviderDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
  },
  mainImage: {
    width: '100%',
    height: 220,
  },
  infoContainer: {
    paddingBottom: 5,
    paddingHorizontal: 18,
    backgroundColor: COLOR.white,
  },
  amenityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLOR.black,
  },
  detail: {
    fontSize: 13,
    color: '#555',
    marginTop: 3,
  },
  section: {
    paddingBottom: 15,
    paddingHorizontal: 18,
    backgroundColor: COLOR.white,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: Font.semibold,
    marginBottom: 8,
    color: COLOR.black,
  },
  sectionText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
    fontFamily: Font.medium,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f4f4f4',
    marginTop: 10,
    borderRadius: 8,
    marginHorizontal: 15,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: COLOR.primary,
  },
  tabText: {
    fontSize: 13,
    color: '#666',
    fontFamily: Font.semibold,
  },
  activeTabText: {
    color: COLOR.primary,
  },
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    // alignItems: "center",
    // alignSelf: "center",
    // justifyContent: "center"
  },
  categoryCard: {
    width: '21%',
    backgroundColor: '#f9f9f9',
    padding: 8,
    paddingHorizontal: 5,
    margin: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  categoryImage: {
    width: 50,
    height: 50,
    marginBottom: 6,
    borderRadius: 10
  },
  categoryText: {
    fontSize: 11,
    fontFamily: Font.semibold,
    color: COLOR.black,
  },
  photo: {
    width: '31.5%',
    height: 80,
    borderRadius: 8,
    marginRight: 10,
    marginTop: 10,
  },
  reviewCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  reviewUser: {
    fontSize: 14,
    fontFamily: Font.semibold,
    color: COLOR.black,
  },
  reviewText: {
    fontSize: 13,
    color: '#555',
    fontFamily: Font.medium,

    marginTop: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: Font.semibold,
    marginBottom: 15,
    color: '#000',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    height: 17,
    width: 17,
    marginRight: 10,
    resizeMode: 'contain',
  },
  amenityText: {
    fontSize: 14,
    color: '#333',
    fontFamily: Font.medium,
    flexShrink: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },

  highlightedText: {
    color: '#72B5EC',
    fontWeight: 'bold',
  },
});
