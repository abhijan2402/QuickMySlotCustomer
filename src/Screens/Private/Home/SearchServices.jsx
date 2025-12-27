import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { COLOR } from '../../../Constants/Colors';
import HomeHeader from '../../../Components/HomeHeader';
import { Typography } from '../../../Components/UI/Typography';
import { images } from '../../../Components/UI/images';
import { windowHeight } from '../../../Constants/Dimensions';
import { Font } from '../../../Constants/Font';
import Input from '../../../Components/Input';
import { GET_WITH_TOKEN } from '../../../Backend/Api';
import { SERVICES } from '../../../Constants/ApiRoute';
import { useIsFocused } from '@react-navigation/native';
import { cleanImageUrl, windowWidth } from '../../../Backend/Utility';
import { useSelector } from 'react-redux';
import CartModal from '../../../Components/CartModal';

const SearchServices = ({ navigation, route }) => {
  const ref = useRef();
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
    let url = `${SERVICES}?service_category=${id}&page=${page}&per_page=${perPage}&lat=${currentLocation?.coords?.latitude}&long=${currentLocation?.coords?.longitude}`;

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
    // if (isFocused) {
    setCurrentPage(1);
    fetchServices(1, '');
    // }
    if (!id) {
      ref.current.focus();
      // Keyboard.isVisible()
    }
  }, [id]);

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

  const renderCard = ({ item }) => {

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('ProviderDetails', { id: item?.id, km: item?.km })}
        style={styles.card} >
        <View style={styles.imageContainer}>
          {item?.portfolio_images?.length > 0 ? (
            <Image
              source={{ uri: cleanImageUrl(item?.portfolio_images[0]?.image_url) }}
              style={styles.cardImage}
              defaultSource={images.placeholder}
              onError={() => console.log('Image failed to load:', item?.image)}
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Typography color={COLOR.grey}>No Image</Typography>
            </View>
          )}
        </View>

        {
          item?.is_cashback != "0" &&
          <View style={{ backgroundColor: COLOR.blue, paddingVertical: 5, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
            <Typography size={14} color={COLOR.white} font={Font.semibold} style={{ textAlign: "center" }}>Get upto {(parseInt(item?.is_cashback?.replace('%', '')) || 0) + 20}% discount via QuickMySlot
            </Typography>
          </View>
        }
        <View style={[styles.cardContent]}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Typography
              size={14}
              font={Font.semibold}
              color={COLOR.black}
              style={[styles.cardTitle, { width: "70%" }]}>
              {item?.business_name || 'Unknown Business'}
            </Typography>
            {
              item?.service_category == 1 || item?.service_category == 2 || item?.service_category == 3 ?
                <View style={{ flexDirection: "row" }}>
                  <Typography size={13}
                    font={Font.semibold}
                    color="#666">Unisex | ₹₹</Typography>
                </View> : ""
            }

          </View>
          {/* String(category) === "1" || */}
          {/* String(category) === "2" || */}
          {/* {item?.business_description && (
          <Typography
            numberOfLines={2}
            size={14}
            font={Font.regular}
            color={COLOR.darkGrey}
            style={styles.description}>
            {item.business_description}
          </Typography>
        )} */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ width: "50%", }}>
              {item?.exact_location && (
                <>
                  <View style={{ flexDirection: "row" }}>
                    <Typography
                      numberOfLines={1}
                      size={13}
                      color="#666"
                      font={Font.medium}
                      style={[styles.textRow, {}]}>
                      {item.exact_location}
                    </Typography>
                    <Typography
                      size={13}
                      color="#666"
                      font={Font.medium}
                      style={[styles.textRow, {}]}
                    >
                      | {item?.km} kms
                    </Typography>

                  </View>
                </>
              )}
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image source={{ uri: "https://cdn-icons-png.flaticon.com/128/3334/3334338.png" }} style={{ width: 13, height: 13, marginRight: 2 }} />
              <Typography size={14}
                color="#666"
                font={Font.semibold}>{item?.rating || 4.6}</Typography>
            </View>
          </View>
        </View>
      </TouchableOpacity >
    )
  }

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Image source={images.noData} style={styles.emptyImage} />
      <Typography size={18} font={Font.medium} style={styles.emptyText}>
        {search ? 'No services found' : 'No services available'}
      </Typography>
      <Typography size={14} color={COLOR.grey} style={{ marginTop: 4 }}>
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
          ref={ref}
          value={search}
          onChangeText={setSearch}
          leftIcon={images.search}
          placeholder="Search for services..."
          inputContainer={{ borderColor: COLOR.lightGrey }}
          style={{ marginLeft: 5 }}
          rightIcon={search !== '' ? images.cross2 : ''}
          rightIconStyle={{ height: 14, width: 14 }}
          onRightIconPress={() => setSearch('')}
        />
      </View>
      {/* <CartModal /> */}
      {/* <CartModal /> */}

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

      {loading && services?.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLOR.primary} />
          <Typography size={14} color={COLOR.grey} style={{ marginTop: 10 }}>
            Loading services...
          </Typography>
        </View>
      )}
      <View style={{ marginTop: 40 }}></View>
      <CartModal />
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
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible', // keep iOS shadows visible
    elevation: 4, // Android shadow

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,

    // Optional: subtle border to improve visual definition on light backgrounds
    borderWidth: Platform.OS === 'ios' ? 0.3 : 0,
    borderColor: 'rgba(0,0,0,0.05)',
  },

  imageContainer: {
    position: 'relative',
  },
  cardImage: {
    width: windowWidth - 30,
    height: 190,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  placeholderImage: {
    width: windowWidth - 30,
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
