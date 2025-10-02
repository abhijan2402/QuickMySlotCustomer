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
import {cleanImageUrl} from '../../../Backend/Utility';
import {useSelector} from 'react-redux';

const SearchServices = ({navigation, route}) => {
  const [search, setSearch] = useState('');
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const id = route?.params?.id;
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const currentLocation = useSelector(state => state.currentLocation);

  const buildApiUrl = (page = 1, searchTerm = '') => {
    let url = `${SERVICES}?service_category=${id}&page=${page}&per_page=${perPage}&lat=${currentLocation?.latitude}$long=${currentLocation?.longitude}`;
    if (searchTerm.trim() !== '') {
      url += `&name=${encodeURIComponent(searchTerm.trim())}`;
    }
    return url;
  };
  const fetchServices = (page = 1, searchTerm = '', shouldAppend = false) => {
    setLoading(true);
    GET_WITH_TOKEN(
      buildApiUrl(page, searchTerm),
      success => {
        const responseData = success?.data?.data || [];
        const paginationInfo = success?.data?.last_page || {};
        if (shouldAppend) {
          setServices(prevServices => [...prevServices, ...responseData]);
        } else {
          setServices(responseData);
        }
        setFilteredServices(responseData);
        setCurrentPage(page);
        setTotalPages(paginationInfo || 1);
        setHasMore(page < (paginationInfo || 1));
        setLoading(false);
        setRefreshing(false);
      },
      error => {
        console.error('Error fetching services:', error);
        setLoading(false);
        setRefreshing(false);
      },
      fail => {
        setLoading(false);
        setRefreshing(false);
      },
    );
  };
  useEffect(() => {
    if (isFocused) {
      setCurrentPage(1);
      fetchServices(1, '');
    }
  }, [isFocused, id]);

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      setCurrentPage(1);
      fetchServices(1, search);
    }, 500);
    return () => clearTimeout(searchTimeout);
  }, [search]);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchServices(currentPage + 1, search, true);
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    fetchServices(1, search);
  };
  const renderFooter = () => {
    if (!loading || !hasMore) return null;

    return (
      <View style={styles.footerLoader}>
        {/* <ActivityIndicator size="small" color={COLOR.primary} />
        <Typography size={12} color={COLOR.grey} style={{marginLeft: 10}}>
          Loading more...
        </Typography> */}
      </View>
    );
  };

  const renderCard = ({item}) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => navigation.navigate('ProviderDetails', {id: item?.id})}
      style={styles.card}>
      {console.log('Rendering item:', item.image)}

      <View style={styles.imageContainer}>
        {item?.image ? (
          <Image
            source={{uri: cleanImageUrl(item.image)}}
            style={styles.cardImage}
            defaultSource={images.placeholder}
            onError={() => console.log('Image failed to load:', item.image)}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Typography color={COLOR.grey}>No Image</Typography>
          </View>
        )}

        {item?.rating && (
          <View style={styles.ratingBadge}>
            <Typography size={12} font={Font.medium} color={COLOR.white}>
              ⭐ {item.rating}
            </Typography>
          </View>
        )}
      </View>

      <View style={styles.cardContent}>
        <Typography
          size={16}
          font={Font.semibold}
          color={COLOR.black}
          style={styles.cardTitle}>
          {item?.business_name || 'Unknown Business'}
        </Typography>

        {item?.business_description && (
          <Typography
            size={14}
            font={Font.regular}
            color={COLOR.darkGrey}
            style={styles.description}>
            {item.business_description}
          </Typography>
        )}

        {item?.exact_location && (
          <Typography
            size={13}
            color="#666"
            font={Font.medium}
            style={styles.textRow}>
            📍 {item.exact_location}
          </Typography>
        )}

        {item?.years_of_experience && (
          <Typography
            size={13}
            color="#666"
            font={Font.medium}
            style={styles.textRow}>
            💼 {item.years_of_experience} years experience
          </Typography>
        )}

        {item?.gender && (
          <Typography
            size={13}
            color="#666"
            font={Font.medium}
            style={styles.textRow}>
            👤 {item.gender}
          </Typography>
        )}

        {item?.phone_number && (
          <Typography
            size={13}
            color="#666"
            font={Font.medium}
            style={styles.textRow}>
            📞 +91 {item.phone_number}
          </Typography>
        )}

        <Typography
          font={Font.semibold}
          size={13}
          color="#666"
          style={styles.availability}>
          ⏰ {item?.daily_start_time || 'N/A'} - {item?.daily_end_time || 'N/A'}
        </Typography>

        {item?.working_days && item.working_days.length > 0 && (
          <View style={styles.workingDaysContainer}>
            <Typography size={13} color="#666" font={Font.medium}>
              Working days:{' '}
            </Typography>
            <View style={styles.daysList}>
              {item.working_days.map((day, index) => (
                <Typography
                  key={index}
                  size={12}
                  color="#444"
                  font={Font.medium}
                  style={styles.dayText}>
                  {day}
                  {index < item.working_days.length - 1 ? ',' : ''}
                </Typography>
              ))}
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Image source={images.noData} style={styles.emptyImage} />
      <Typography size={18} font={Font.medium} style={styles.emptyText}>
        {search ? 'No services found' : 'No services available'}
      </Typography>
      <Typography size={14} color={COLOR.grey} style={{marginTop: 4}}>
        {search
          ? 'Try searching with a different keyword.'
          : 'Check back later for new services.'}
      </Typography>
    </View>
  );

  return (
    <View style={styles.container}>
      <HomeHeader
        title="Services"
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.black}
      />

      <View style={styles.searchContainer}>
        <Input
          value={search}
          onChangeText={setSearch}
          leftIcon={images.search}
          placeholder="Search for services..."
          inputContainer={{borderColor: COLOR.lightGrey}}
          style={{marginLeft: 5}}
          rightIcon={search !== '' ? images.cross2 : ''}
          rightIconStyle={{height: 14, width: 14}}
          onRightIconPress={() => setSearch('')}
        />
      </View>
      {services.length > 0 && (
        <FlatList
          data={services}
          keyExtractor={(item, index) => `${item.id}_${index}`}
          renderItem={renderCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={!loading ? renderEmpty : null}
          ListFooterComponent={renderFooter}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}

      {loading && services.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLOR.primary} />
          <Typography size={14} color={COLOR.grey} style={{marginTop: 10}}>
            Loading services...
          </Typography>
        </View>
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
  searchContainer: {
    paddingHorizontal: 5,
    marginTop: -10,
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 120,
    paddingHorizontal: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },

  card: {
    backgroundColor: COLOR.white,
    borderRadius: 16,
    marginVertical: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
  },
  imageContainer: {
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 190,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  placeholderImage: {
    width: '100%',
    height: 190,
    backgroundColor: COLOR.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
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
  description: {
    marginBottom: 8,
    lineHeight: 18,
  },
  textRow: {
    marginBottom: 4,
  },
  availability: {
    marginTop: 6,
    color: COLOR.primary,
  },
  workingDaysContainer: {
    marginTop: 8,
  },
  daysList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  dayText: {
    marginRight: 6,
  },

  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },

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
