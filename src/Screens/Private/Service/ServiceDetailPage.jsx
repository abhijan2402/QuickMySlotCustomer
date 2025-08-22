import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Linking,
} from 'react-native';
import {COLOR} from '../../../Constants/Colors';
import HomeHeader from '../../../Components/HomeHeader';
import CustomButton from '../../../Components/CustomButton';
import ImageSwiper from './ServiceImageSwiper';
import CouponCarousel from './CouponCarousel';
import {FlatList} from 'react-native';

const ProviderDetails = ({navigation}) => {
  const [activeTab, setActiveTab] = useState('Services');
  const {width} = Dimensions.get('window');
  const [like, setLike] = useState(false);

  const amenities = [
    {id: '1', name: 'Air Conditioned'},
    {id: '2', name: 'Wi-Fi'},
    {id: '3', name: 'Parking'},
    {id: '4', name: 'Swimming Pool'},
    // Add more as needed
  ];
  const handleOpenMap = () => {
    const address = '1600 Amphitheatre Parkway, Mountain View, CA';
    const encodedAddress = encodeURIComponent(address);

    const url =
      Platform.OS === 'ios'
        ? `http://maps.apple.com/?q=${encodedAddress}`
        : `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

    Linking.openURL(url).catch(err => console.error('Error opening map', err));
  };

  const handleCall = () => {
    const phoneNumber = '1234567890';
    const url = `tel:${phoneNumber}`;

    Linking.openURL(url).catch(err =>
      console.error('Failed to open dialer:', err),
    );
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <HomeHeader
        title="Provider Details"
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.primary}
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={{paddingBottom: 80}}>
        <ImageSwiper />
        {/* Provider Info */}
        <View style={styles.infoContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={[styles.title, {marginTop: 10, width: '70%'}]}>
              Glamour Touch Salon,Gurugram, Punjab
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity onPress={() => setLike(!like)}>
                <Image
                  source={
                    like
                      ? require('../../../assets/Images/heart.png')
                      : require('../../../assets/Images/like.png')
                  }
                  style={{height: 24, width: 24, marginRight: 20}}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Image
                  source={require('../../../assets/Images/share.png')}
                  style={{height: 24, width: 24}}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center',marginTop:-10}}>
            <Text style={[{fontSize: 16, marginBottom: 2}]}>Unisex</Text>
            <View
              style={{
                width: 1.5,
                height: 15,
                marginHorizontal: 10,
                backgroundColor: 'black',
              }}
            />
            <Text style={[{fontSize: 16}]}>₹₹</Text>
          </View>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
              backgroundColor: 'lightgray',
              paddingVertical: 6,
              paddingHorizontal: 8,
              borderRadius: 6,
              // width: '75%',
              alignSelf: 'flex-start',
            }}>
            <Image
              source={require('../../../assets/Images/close.png')}
              style={{height: 16, width: 16}}
            />
            <Text style={{fontSize: 14, marginLeft: 5, marginBottom: 2}}>
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
            <Text style={{fontSize: 14, marginRight: 5, marginBottom: 2}}>
              Opens Today at 10:00 Am
            </Text>
            <Image
              source={require('../../../assets/Images/rightarrow.png')}
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
              onPress={() => handleOpenMap()}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
                backgroundColor: 'lightgray',
                paddingVertical: 6,
                paddingHorizontal: 8,
                borderRadius: 6,
                marginRight: 10,
                alignSelf: 'flex-start',
              }}>
              <Image
                source={require('../../../assets/Images/direction.png')}
                style={{height: 16, width: 16}}
              />
              <Text style={{fontSize: 14, marginLeft: 5, marginBottom: 2}}>
                Get Directions
              </Text>
              <View
                style={{
                  width: 1.5,
                  height: 15,
                  marginHorizontal: 5,
                  backgroundColor: 'black',
                }}
              />
              <Text style={{fontSize: 14, marginRight: 5, marginBottom: 2}}>
                194.04 Kms
              </Text>
              <Image
                source={require('../../../assets/Images/rightarrow.png')}
                style={{height: 18, width: 10}}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleCall()}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
                backgroundColor: 'lightgray',
                paddingVertical: 6,
                paddingHorizontal: 8,
                borderRadius: 6,
                alignSelf: 'flex-start',
              }}>
              <Image
                source={require('../../../assets/Images/call.png')}
                style={{height: 16, width: 16}}
              />
              <Text style={{fontSize: 14, marginLeft: 5, marginBottom: 2}}>
                Contact
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* About */}
        <View style={[styles.section,{marginTop:-10}]}>
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
            <View style={styles.reviewCard}>
              <Text style={styles.reviewUser}>Priya Sharma</Text>
              <Text style={styles.reviewText}>
                Amazing service and very friendly staff! Highly recommend this
                salon.
              </Text>
            </View>
            <View style={styles.reviewCard}>
              <Text style={styles.reviewUser}>Rahul Mehta</Text>
              <Text style={styles.reviewText}>
                Best haircut I’ve had in years. Definitely coming back.
              </Text>
            </View>
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
    padding: 15,
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
    paddingHorizontal: 15,
    backgroundColor: COLOR.white,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
    color: COLOR.black,
  },
  sectionText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f4f4f4',
    marginTop: 10,
    borderRadius: 8,
    marginHorizontal: 10,
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
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
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
    width: '21%',
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
    fontSize: 13,
    fontWeight: '600',
    color: COLOR.black,
  },
  photo: {
    width: 124,
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
    fontWeight: 'bold',
    color: COLOR.black,
  },
  reviewText: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
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
    fontSize: 16,
    color: '#333',
    flexShrink: 1,
  },
});
