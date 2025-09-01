import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {COLOR} from '../../../Constants/Colors';
import HomeHeader from '../../../Components/HomeHeader';
import {Typography} from '../../../Components/UI/Typography';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const SearchServices = ({navigation}) => {
  const services = [
    {
      id: 1,
      name: 'Glamour Touch Salon',
      address: '123 Beauty Blvd, Anytown, CA 90210',
      experience: '8 Years of Experience',
      availability: 'Available Mon-Sat, 9 AM - 4 PM',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlJbFNhVA9DFsv-c9J73u3EKz0HnMb2iK4vA&s',
    },
    {
      id: 2,
      name: 'Luxury Spa Center',
      address: '456 Relax St, Bliss City, CA 90211',
      experience: '5 Years of Experience',
      availability: 'Available Tue-Sun, 10 AM - 6 PM',
      image:
        'https://www.shutterstock.com/image-photo/portrait-pretty-relaxed-young-woman-600nw-2478831041.jpg',
    },
    {
      id: 3,
      name: 'Hair & Beauty Studio',
      address: '789 Style Ave, Fashion Town, CA 90212',
      experience: '10 Years of Experience',
      availability: 'Available Mon-Fri, 8 AM - 5 PM',
      image:
        'https://images.pexels.com/photos/3065206/pexels-photo-3065206.jpeg',
    },
    
  ];

  return (
    <View style={styles.container}>
      <HomeHeader
        title="Services"
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        rightIcon="https://cdn-icons-png.flaticon.com/128/17446/17446833.png"
        leftTint={COLOR.primary}
      />
      <View style={{paddingHorizontal: 5}}>
        {/* Search Box */}
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search for services..."
            placeholderTextColor="#999"
            style={styles.input}
          />
        </View>

        {/* List of Services */}
        <KeyboardAwareScrollView
          extraScrollHeight={10} 
          enableOnAndroid={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 120}}>
          {services.map(service => (
            <TouchableOpacity
              onPress={() => navigation.navigate('ProviderDetails')}
              key={service.id}
              style={styles.card}>
              {/* Image with rounded top corners */}
              <Image source={{uri: service.image}} style={styles.cardImage} />

              {/* Content */}
              <View style={styles.cardContent}>
                <Typography
                  size={16}
                  fontWeight="bold"
                  color={COLOR.black}
                  style={{marginBottom: 5}}>
                  {service.name}
                </Typography>

                <Typography size={13} color="#666" style={styles.textRow}>
                  📍 {service.address}
                </Typography>

                <Typography size={13} color="#666" style={styles.textRow}>
                  💼 {service.experience}
                </Typography>

                <Typography size={13} color="#666" style={{marginTop: 2}}>
                  ⏰ {service.availability}
                </Typography>
              </View>
            </TouchableOpacity>
          ))}
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

export default SearchServices;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
    paddingHorizontal: 15,
  },
  searchBox: {
    backgroundColor: COLOR.white,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    marginTop: 10,
  },
  input: {
    fontSize: 14,
    color: COLOR.black,
  },
  card: {
    backgroundColor: COLOR.white,
    borderRadius: 14,
    marginVertical: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
    margin: 1,
  },
  cardImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  cardContent: {
    padding: 12,
  },
  textRow: {
    marginBottom: 5,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
});
