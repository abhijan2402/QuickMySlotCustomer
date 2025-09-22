import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {COLOR} from '../../../Constants/Colors';
import HomeHeader from '../../../Components/HomeHeader';
import ImageSwiper from './ServiceImageSwiper';
import CouponCarousel from './CouponCarousel';
import {FlatList} from 'react-native';
import {
  handleCall,
  handleOpenMap,
  onShare,
  openMapWithDirections,
} from '../../../Constants/Utils';
import SimpleModal from '../../../Components/UI/SimpleModal';
import {Font} from '../../../Constants/Font';
import {VENDOR_DETAIL} from '../../../Constants/ApiRoute';
import {useIsFocused} from '@react-navigation/native';
import {GET_WITH_TOKEN} from '../../../Backend/Api';
import {Typography} from '../../../Components/UI/Typography';

const ProviderDetails = ({navigation, route}) => {
  const [activeTab, setActiveTab] = useState('Services');
  const {width} = Dimensions.get('window');
  const [like, setLike] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [apiData, setApiData] = useState('');

  const isFocused = useIsFocused();
  const id = route?.params?.id;

  const daysData = [
    {day: 'Monday', time: '10:30 AM - 09:00 PM'},
    {day: 'Tuesday', time: '10:30 AM - 09:00 PM'},
    {day: 'Wednesday', time: '10:30 AM - 09:00 PM'},
    {day: 'Thursday', time: '10:30 AM - 09:00 PM'},
    {day: 'Friday', time: '10:30 AM - 09:00 PM'},
    {day: 'Saturday', time: '10:30 AM - 09:00 PM'},
    {day: 'Sunday', time: '10:30 AM - 09:00 PM'},
  ];
  const currentDayIndex = new Date().getDay();
  const adjustedDayIndex = (currentDayIndex + 6) % 7;

  const amenities = [
    {id: '1', name: 'Air Conditioned'},
    {id: '2', name: 'Wi-Fi'},
    {id: '3', name: 'Parking'},
    {id: '4', name: 'Swimming Pool'},
    // Add more as needed
  ];

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      GET_WITH_TOKEN(
        VENDOR_DETAIL + `${id}`,
        success => {
          console.log(success, 'dsadsadewrewretrefcbfdgdf');
          setApiData(success?.data);
          setLoading(false);
        },
        error => setLoading(false),
        fail => setLoading(false),
      );
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={{paddingHorizontal: 15}}>
        <HomeHeader
          title="Provider Details"
          leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
          leftTint={COLOR.primary}
          onLeftPress={() => navigation.goBack()}
        />
      </View>

      <ScrollView contentContainerStyle={{paddingBottom: 10}}>
        <ImageSwiper />
        {/* Provider Info */}
        <View style={styles.infoContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <Typography style={[styles.title, {width: '70%'}]}>
              {apiData?.business_name || apiData?.company_name}
            </Typography>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity onPress={() => setLike(!like)}>
                <Image
                  source={
                    like
                      ? require('../../../assets/Images/heart.png')
                      : require('../../../assets/Images/like.png')
                  }
                  style={{height: 24, width: 26, marginRight: 20}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onShare('Glamour Touch Salon,Gurugram, Punjab')}>
                <Image
                  source={require('../../../assets/Images/share.png')}
                  style={{height: 24, width: 24}}
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
            <Text
              style={[
                {fontSize: 16, marginBottom: 2, fontFamily: Font.medium},
              ]}>
              Unisex
            </Text>
            <View
              style={{
                width: 1.5,
                height: 15,
                marginHorizontal: 10,
                backgroundColor: 'black',
              }}
            />
            <Text style={[{fontSize: 16, fontFamily: Font.medium}]}>₹₹</Text>
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
            <Image
              source={require('../../../assets/Images/close.png')}
              style={{height: 16, width: 16}}
            />
            <Text
              style={{
                fontSize: 13,
                marginLeft: 5,
                // marginBottom: 2,
                fontFamily: Font.regular,
              }}>
              Closed Now
            </Text>
            <View
              style={{
                width: 1.5,
                height: 15,
                marginHorizontal: 5,
                backgroundColor: 'black',
              }}
            />
            <Text
              style={{
                fontSize: 13,
                marginRight: 5,
                // marginBottom: 2,
                fontFamily: Font.regular,
              }}>
              Opens Today at 10:00 AM
            </Text>
            <Image
              source={require('../../../assets/Images/down-arrow.png')}
              style={{height: 18, width: 10}}
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
              onPress={() =>
                handleOpenMap('1600 Amphitheatre Parkway, Mountain View, CA')
              }
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
                style={{height: 16, width: 16}}
              />
              <Text
                style={{
                  fontSize: 13,
                  marginLeft: 5,
                  marginBottom: 2,
                  fontFamily: Font.regular,
                }}>
                Get Directions
              </Text>
              <View
                style={{
                  width: 1.5,
                  height: 13,
                  marginHorizontal: 5,
                  backgroundColor: 'black',
                }}
              />
              <Text
                style={{
                  fontSize: 13,
                  marginRight: 5,
                  marginBottom: 2,
                  fontFamily: Font.regular,
                }}>
                194.04 Kms
              </Text>
              <Image
                source={require('../../../assets/Images/rightarrow.png')}
                style={{height: 18, width: 10}}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleCall('1234567890')}
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
                style={{height: 16, width: 16}}
              />
              <Text
                style={{
                  fontSize: 13,
                  marginLeft: 5,
                  fontFamily: Font.regular,
                }}>
                Contact
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.section, {marginTop: 0}]}>
          <Text style={styles.sectionTitle}>Address</Text>
          <Text style={styles.sectionText}>
            Shop no.36, Ground Floor, AIPL JOY STREET, Badshahpur, Sector
            66,Gurugram, Haryana 122018
          </Text>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}
            onPress={() =>
              openMapWithDirections(
                'Shop no.36, Ground Floor, AIPL JOY STREET, Badshahpur, Sector 66, Gurugram, Haryana 122018',
              )
            }>
            <Image
              source={require('../../../assets/Images/location.png')}
              style={{height: 16, width: 16, tintColor: COLOR.primary}}
            />
            <Text
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
            </Text>
          </TouchableOpacity>
        </View>
        {/* About */}
        <View style={[styles.section, {marginTop: 0}]}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.sectionText}>
            Glamour Touch Salon is a premium beauty destination offering top
            quality services. Our team of experts ensures you feel confident and
            refreshed every time you visit.
          </Text>
        </View>
        <CouponCarousel />
        {/* Tabs */}
        <View style={{paddingHorizontal: 20}}>
          <Text style={styles.title}>Amenities</Text>
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
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === 'Services' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <View style={styles.categoryWrap}>
              {[
                {
                  id: 1,
                  name: 'Haircut',
                  image:
                    'https://cdn-icons-png.flaticon.com/128/809/809957.png',
                },
                {
                  id: 2,
                  name: 'Makeup',
                  image:
                    'https://cdn-icons-png.flaticon.com/128/1585/1585141.png',
                },
                {
                  id: 3,
                  name: 'Spa',
                  image:
                    'https://cdn-icons-png.flaticon.com/128/2995/2995370.png',
                },
                {
                  id: 4,
                  name: 'Massage',
                  image:
                    'https://cdn-icons-png.flaticon.com/128/2645/2645880.png',
                },
                {
                  id: 5,
                  name: 'Nails',
                  image:
                    'https://cdn-icons-png.flaticon.com/128/1843/1843410.png',
                },
              ].map(cat => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('ServiceList')}
                  key={cat.id}
                  style={styles.categoryCard}>
                  <Image
                    source={{uri: cat.image}}
                    style={styles.categoryImage}
                  />
                  <Text style={styles.categoryText}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'Photos' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {marginBottom: 0}]}>
              Gallery
            </Text>
            <FlatList
              data={[
                'https://images.pexels.com/photos/4154062/pexels-photo-4154062.jpeg',
                'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg',
                'https://images.pexels.com/photos/3738341/pexels-photo-3738341.jpeg',
                'https://images.pexels.com/photos/4154062/pexels-photo-4154062.jpeg',
                'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg',
              ]}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => (
                <Image source={{uri: item}} style={styles.photo} />
              )}
            />
          </View>
        )}

        {activeTab === 'About' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About Us</Text>
            <Text style={styles.sectionText}>
              Our salon offers professional services including hair, makeup,
              spa, and skincare treatments. We use top-quality products to
              ensure customer satisfaction.
            </Text>
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
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        source={require('../../../assets/Images/userprofile.png')}
                        style={{height: 14, width: 14}}
                      />
                      <Text style={[styles.reviewUser, {marginLeft: 5}]}>
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
                  <Text style={styles.reviewText}>
                    Amazing service and very friendly staff! Highly recommend
                    this salon.
                  </Text>
                </View>
              )}
            />
          </View>
        )}

        {/* Checkout Button */}
        {/* <CustomButton
          title={'Checkout Services'}
          onPress={() => {
            navigation.navigate('BookingScreen');
          }}
          style={{margin: 15}}
        /> */}
      </ScrollView>
      <SimpleModal
        visible={isModalVisible}
        modalContainer={{padding: 0}}
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
            <View style={{alignItems: 'center'}}>
              <Text style={{fontSize: 16, fontWeight: '500'}}>Timings</Text>
              <Text style={{fontSize: 16, marginTop: 5, color: COLOR.white}}>
                All Timings Are In IST
              </Text>
            </View>
          </View>
          <View style={{padding: 10}}>
            <FlatList
              data={daysData}
              keyExtractor={item => item.day}
              renderItem={({item, index}) => (
                <View style={[styles.row]}>
                  <Text
                    style={
                      index === adjustedDayIndex && styles.highlightedText
                    }>
                    {item.day}
                  </Text>
                  <Text
                    style={
                      index === adjustedDayIndex && styles.highlightedText
                    }>
                    {item.time}
                  </Text>
                </View>
              )}
            />
          </View>
        </View>
      </SimpleModal>
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
  },
  categoryCard: {
    width: '20%',
    backgroundColor: '#f9f9f9',
    padding: 8,
    paddingHorizontal: 5,
    margin: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryImage: {
    width: 20,
    height: 20,
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 11,
    fontFamily: Font.semibold,
    color: COLOR.black,
  },
  photo: {
    width: '31.5%',
    height: 100,
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
