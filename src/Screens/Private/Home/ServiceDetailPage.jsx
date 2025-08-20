import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {COLOR} from '../../../Constants/Colors';
import HomeHeader from '../../../Components/HomeHeader';
import CustomButton from '../../../Components/CustomButton';

const ProviderDetails = ({navigation}) => {
  const [activeTab, setActiveTab] = useState('Services');

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
        {/* Image */}
        <Image
          source={{
            uri: 'https://images.pexels.com/photos/3738341/pexels-photo-3738341.jpeg',
          }}
          style={styles.mainImage}
        />

        {/* Provider Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>Glamour Touch Salon</Text>
          <Text style={styles.detail}>123 Beauty Blvd, Anytown, CA 90210</Text>
          <Text style={styles.detail}>8 Years of Experience</Text>
          <Text style={styles.detail}>Available Mon-Sat, 9 AM - 4 PM</Text>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.sectionText}>
            Glamour Touch Salon is a premium beauty destination offering top
            quality services. Our team of experts ensures you feel confident and
            refreshed every time you visit.
          </Text>
        </View>

        {/* Tabs */}
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
            <Text style={styles.sectionTitle}>Gallery</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[
                'https://images.pexels.com/photos/4154062/pexels-photo-4154062.jpeg',
                'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg',
                'https://images.pexels.com/photos/3738341/pexels-photo-3738341.jpeg',
              ].map((img, index) => (
                <Image key={index} source={{uri: img}} style={styles.photo} />
              ))}
            </ScrollView>
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
    padding: 15,
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
    width: 140,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
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
});
