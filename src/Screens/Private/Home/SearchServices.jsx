import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {COLOR} from '../../../Constants/Colors';
import HomeHeader from '../../../Components/HomeHeader';
import {Typography} from '../../../Components/UI/Typography';
import {images} from '../../../Components/UI/images';
import {windowHeight} from '../../../Constants/Dimensions';
import {Font} from '../../../Constants/Font';
import Input from '../../../Components/Input';
import {GET_WITH_TOKEN} from '../../../Backend/Api';
import {SERVICES} from '../../../Constants/ApiRoute';
import {useIsFocused} from '@react-navigation/native';

const SearchServices = ({navigation, route}) => {
  const [search, setSearch] = useState('');
  const [services, setServices] = useState([]);
  console.log(services);
  const id = route?.params?.id;

  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      GET_WITH_TOKEN(
        SERVICES + `?service_category=${id}`,
        success => {
          console.log(success);
          setServices(success?.data);
          setLoading(false);
        },
        error => setLoading(false),
        fail => setLoading(false),
      );
    }
  }, [isFocused]);

  const renderCard = ({item}) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => navigation.navigate('ProviderDetails')}
      style={styles.card}>
      {/* Image with Rating Badge */}
      <View>
        <Image source={{uri: item?.image}} style={styles.cardImage} />
        {item?.rating && (
          <View style={styles.ratingBadge}>
            <Typography size={12} font={Font.medium} color={COLOR.white}>
              ⭐ {item?.rating}
            </Typography>
          </View>
        )}
      </View>

      {/* Card Content */}
      <View style={styles.cardContent}>
        <Typography
          size={16}
          font={Font.semibold}
          color={COLOR.black}
          style={styles.cardTitle}>
          {item?.business_name}
        </Typography>
        {item?.business_description && (
          <Typography
            size={16}
            font={Font.regular}
            color={COLOR.black}
            style={styles.cardTitle}>
            {item?.business_description}
          </Typography>
        )}

        {item?.exact_location && (
          <Typography
            size={13}
            color="#666"
            font={Font.medium}
            style={styles.textRow}>
            address:📍 {item?.exact_location}
          </Typography>
        )}
        {item?.location_area_served && (
          <Typography
            size={13}
            color="#666"
            font={Font.medium}
            style={styles.textRow}>
            locationAreaServed:📍 {item?.location_area_served}
          </Typography>
        )}

        {item?.years_of_experience && (
          <Typography
            size={13}
            color="#666"
            font={Font.medium}
            style={styles.textRow}>
            experience: 💼 {item?.years_of_experience}
          </Typography>
        )}
        {item?.gender && (
          <Typography
            size={13}
            color="#666"
            font={Font.medium}
            style={styles.textRow}>
            gender: {item?.gender}
          </Typography>
        )}
        {item?.phone_number && (
          <Typography
            size={13}
            color="#666"
            font={Font.medium}
            style={styles.textRow}>
            phone: +91 {item?.phone_number}
          </Typography>
        )}

        <Typography
          font={Font.semibold}
          size={13}
          color="#666"
          style={styles.availability}>
          open: ⏰ {item?.daily_start_time} AM : {item?.daily_end_time} PM
        </Typography>
        {item?.working_days && (
          <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 5}}>
            <Typography size={13} color="#666" font={Font.medium}>
              Working days:{' '}
            </Typography>
            {item?.working_days?.map((day, index) => (
              <Typography
                key={index}
                size={12}
                color="#444"
                font={Font.medium}
                style={{marginRight: 8}}>
                {day},
              </Typography>
            ))}
          </View>
        )}
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
      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLOR.primary}
          style={{marginTop: 10}}
        />
      ) : (
        <FlatList
          data={services}
          keyExtractor={item => item.id.toString()}
          renderItem={renderCard}
          contentContainerStyle={{paddingBottom: 120, paddingHorizontal: 5}}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
        />
      )}
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
