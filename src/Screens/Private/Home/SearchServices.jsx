import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {COLOR} from '../../../Constants/Colors';
import HomeHeader from '../../../Components/HomeHeader';

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
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search for services..."
          placeholderTextColor="#999"
          style={styles.input}
        />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 70}}>
        {/* Search Box */}

        {/* Render Multiple Services */}
        {services.map(service => (
          <TouchableOpacity
            onPress={() => navigation.navigate('ProviderDetails')}
            key={service.id}
            style={styles.card}>
            <Image source={{uri: service.image}} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{service.name}</Text>
              <Text style={styles.cardText}>{service.address}</Text>
              <Text style={styles.cardText}>{service.experience}</Text>
              <Text style={styles.cardText}>{service.availability}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  },
  input: {
    fontSize: 14,
    color: COLOR.black,
  },
  card: {
    backgroundColor: COLOR.white,
    borderRadius: 10,
    marginVertical: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLOR.black,
    marginBottom: 3,
  },
  cardText: {
    fontSize: 12,
    color: '#555',
  },
});
