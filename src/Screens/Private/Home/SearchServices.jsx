import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {COLOR} from '../../../Constants/Colors';
import HomeHeader from '../../../Components/HomeHeader';
import {Typography} from '../../../Components/UI/Typography';
import {images} from '../../../Components/UI/images';
import {windowHeight} from '../../../Constants/Dimensions';
import {Font} from '../../../Constants/Font';
import Input from '../../../Components/Input';

const SearchServices = ({navigation}) => {
  const [search, setSearch] = useState('');

  const services = [
    {
      id: 1,
      name: 'Glamour Touch Salon',
      address: '123 Beauty Blvd, Anytown, CA 90210',
      experience: '8 Years of Experience',
      availability: 'Mon-Sat, 9 AM - 4 PM',
      rating: 4.8,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlJbFNhVA9DFsv-c9J73u3EKz0HnMb2iK4vA&s',
    },
    {
      id: 2,
      name: 'Luxury Spa Center',
      address: '456 Relax St, Bliss City, CA 90211',
      experience: '5 Years of Experience',
      availability: 'Tue-Sun, 10 AM - 6 PM',
      rating: 4.6,
      image:
        'https://www.shutterstock.com/image-photo/portrait-pretty-relaxed-young-woman-600nw-2478831041.jpg',
    },
    {
      id: 3,
      name: 'Hair & Beauty Studio',
      address: '789 Style Ave, Fashion Town, CA 90212',
      experience: '10 Years of Experience',
      availability: 'Mon-Fri, 8 AM - 5 PM',
      rating: 4.9,
      image:
        'https://images.pexels.com/photos/3065206/pexels-photo-3065206.jpeg',
    },
  ];

  const renderCard = ({item}) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => navigation.navigate('ProviderDetails')}
      style={styles.card}>
      {/* Image with Rating Badge */}
      <View>
        <Image source={{uri: item.image}} style={styles.cardImage} />
        <View style={styles.ratingBadge}>
          <Typography size={12} font={Font.medium} color={COLOR.white}>
            ⭐ {item.rating}
          </Typography>
        </View>
      </View>

      {/* Card Content */}
      <View style={styles.cardContent}>
        <Typography
          size={16}
          font={Font.semibold}
          color={COLOR.black}
          style={styles.cardTitle}>
          {item.name}
        </Typography>

        <Typography
          size={13}
          color="#666"
          font={Font.medium}
          style={styles.textRow}>
          📍 {item.address}
        </Typography>

        <Typography
          size={13}
          color="#666"
          font={Font.medium}
          style={styles.textRow}>
          💼 {item.experience}
        </Typography>

        <Typography
          font={Font.semibold}
          size={13}
          color="#666"
          style={styles.availability}>
          ⏰ {item.availability}
        </Typography>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Image source={images.noData} style={styles.emptyImage} />
      <Typography size={18} font={Font.medium} style={styles.emptyText}>
        No services found
      </Typography>
      <Typography size={14} color={COLOR.grey} style={{marginTop: 4}}>
        Try searching with a different keyword.
      </Typography>
    </View>
  );

  return (
    <View style={styles.container}>
      <HomeHeader
        title="Services"
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        rightIcon="https://cdn-icons-png.flaticon.com/128/17446/17446833.png"
        leftTint={COLOR.black}
      />

      {/* Search Box (Kept Same) */}
      <View style={{paddingHorizontal: 5, marginTop: -10, marginBottom: 10}}>
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

      {/* Services List */}
      <FlatList
        data={services}
        keyExtractor={item => item.id.toString()}
        renderItem={renderCard}
        contentContainerStyle={{paddingBottom: 120, paddingHorizontal: 5}}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
};

export default SearchServices;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
    paddingHorizontal: 10,
  },

  /* Card Styles */
  card: {
    backgroundColor: COLOR.white,
    borderRadius: 16,
    marginVertical: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
  },
  cardImage: {
    width: '100%',
    height: 190,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: COLOR.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 3,
  },
  cardContent: {
    padding: 14,
  },
  cardTitle: {
    marginBottom: 6,
  },
  textRow: {
    marginBottom: 4,
  },
  availability: {
    marginTop: 6,
    color: COLOR.primary,
  },

  /* Empty State */
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: windowHeight * 0.2,
    paddingHorizontal: 20,
  },
  emptyImage: {
    height: 120,
    width: 120,
    resizeMode: 'contain',
  },
  emptyText: {
    marginTop: 10,
    color: COLOR.black,
  },
});
