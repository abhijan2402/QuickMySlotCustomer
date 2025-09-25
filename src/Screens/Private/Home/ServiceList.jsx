import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import {COLOR} from '../../../Constants/Colors';
import HomeHeader from '../../../Components/HomeHeader';
import {Typography} from '../../../Components/UI/Typography';
import {Font} from '../../../Constants/Font';
import {
  ADD_TO_CART,
  GET_CART,
  REMOVE_TO_CART,
} from '../../../Constants/ApiRoute';
import {GET_WITH_TOKEN, POST_FORM_DATA} from '../../../Backend/Api';

const ServiceList = ({navigation, route}) => {
  const [selectedCategory, setSelectedCategory] = useState(
    route.params?.subServices?.[0]?.id || null,
  ); // default first category
  const [expanded, setExpanded] = useState({});
  const [selectedServices, setSelectedServices] = useState([]);
  console.log(selectedServices, 'awdhjhjdhjh');

  const rotationValues = useRef({}).current;

  const subServices = route.params?.subServices || [];
  const services = route.params?.services || [];
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    getCart();
  }),
    [];

  const getCart = () => {
    GET_WITH_TOKEN(
      GET_CART,
      success => {
        console.log('Cart data:', success);
        if (success?.data?.items && success.data.items.length > 0) {
          const cartItems = success.data.items.map(item => ({
            id: item.service.id,
            name: item.service.name,
            cart_id: item.cart_id,
            price: parseFloat(item.item_price),
          }));
          setSelectedServices(cartItems);
        } else {
          setSelectedServices([]);
        }

        setLoading(null);
      },
      error => {
        console.log('Cart fetch error:', error);
        setSelectedServices([]);
        setLoading(null);
      },
      fail => {
        console.log('Cart fetch fail:', fail);
        setSelectedServices([]);
        setLoading(null);
      },
    );
  };

  const isAdded = serviceId => {
    return selectedServices.some(s => s.id === serviceId);
  };

  const handleCart = async service => {
    setLoading(service.id);

    const formData = new FormData();
    formData.append('service_id', service.id);
    formData.append('price', service.price);

    const cartItem = selectedServices.find(
      s => String(s.id) === String(service.id),
    );
    const cartId = cartItem?.cart_id;

    if (isAdded(service.id)) {
      POST_FORM_DATA(
        REMOVE_TO_CART + cartId,
        success => {
          console.log('Removed from cart:', success);
          setSelectedServices(prev => prev.filter(s => s.id !== service.id));
          setLoading(null);
        },
        error => {
          console.log('Remove cart error:', error);
          setLoading(null);
        },
        fail => {
          console.log('Remove cart fail:', fail);
          setLoading(null);
        },
      );
    } else {
      POST_FORM_DATA(
        ADD_TO_CART,
        formData,
        success => {
          console.log('Added to cart:', success);
          setSelectedServices(prev => [...prev, service]);
          setLoading(null);
          getCart();
        },
        error => {
          console.log('Add cart error:', error);
          setLoading(null);
        },
        fail => {
          console.log('Add cart fail:', fail);
          setLoading(null);
        },
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={{paddingHorizontal: 15}}>
        <HomeHeader
          title="Services"
          leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
          leftTint={COLOR.black}
        />
      </View>

      <View style={{flex: 1, flexDirection: 'row'}}>
        {/* Left Side Category */}
        <View style={styles.leftPane}>
          <FlatList
            data={subServices}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  selectedCategory === item.id && styles.activeCategory,
                ]}
                onPress={() => setSelectedCategory(item.id)}>
                <Image
                  source={{uri: item.image_url}}
                  style={styles.categoryImage}
                />
                <Typography
                  size={13}
                  style={[
                    styles.categoryText,
                    selectedCategory === item.id && {fontWeight: 'bold'},
                  ]}>
                  {item.name}
                </Typography>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Right Side Services */}
        <View style={styles.rightPane}>
          <Typography size={17} font={Font.semibold} style={styles.heading}>
            {subServices.find(s => s.id === selectedCategory)?.name ||
              'Services'}
          </Typography>

          <ScrollView>
            {services
              .filter(
                serv => String(serv.service_id) === String(selectedCategory),
              )
              .map(srv => (
                <View key={srv.id} style={styles.serviceRow}>
                  <Typography
                    size={14}
                    style={styles.serviceName}
                    font={Font.semibold}>
                    {srv.name} -{' '}
                    <Typography
                      size={14}
                      font={Font.medium}
                      color={COLOR.primary}>
                      ₹{srv.price}
                    </Typography>
                  </Typography>
                  <TouchableOpacity
                    style={[styles.addBtn, isAdded(srv.id) && styles.addedBtn]}
                    onPress={() => handleCart(srv)}>
                    {loading === srv.id ? (
                      <ActivityIndicator size={'small'} color={COLOR.primary} />
                    ) : (
                      <Typography
                        size={13}
                        font={Font.semibold}
                        color={isAdded(srv.id) ? COLOR.white : COLOR.black}>
                        {isAdded(srv.id) ? 'Added' : 'Add'}
                      </Typography>
                    )}
                  </TouchableOpacity>
                </View>
              ))}
          </ScrollView>
        </View>
      </View>

      {selectedServices.length > 0 && (
        <TouchableOpacity
          onPress={() => navigation.navigate('BookingScreen')}
          style={styles.bookNowBtn}>
          <Typography size={16} font={Font.semibold} color={COLOR.white}>
            Book Now ({selectedServices.length})
          </Typography>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ServiceList;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  leftPane: {width: 100, backgroundColor: '#f9f9f9'},
  categoryItem: {
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  activeCategory: {backgroundColor: '#e6f0ff'},
  categoryImage: {width: 40, height: 40, borderRadius: 8, marginRight: 8},
  categoryText: {flexShrink: 1, fontFamily: Font.medium, marginTop: 5},

  rightPane: {flex: 1, padding: 10},
  heading: {
    marginBottom: 10,
    color: COLOR.black,
  },
  serviceCategory: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 5,
  },
  serviceName: {flex: 1, flexWrap: 'wrap'},
  addBtn: {
    backgroundColor: COLOR.white,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 5,
  },
  addedBtn: {backgroundColor: COLOR.primary, borderWidth: 0},
  bookNowBtn: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: COLOR.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
