import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
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
import {images} from '../../../Components/UI/images';

const ServiceList = ({navigation, route}) => {
  const selectedServiceId = route.params?.subServicesId || null;
  const [selectedCategory, setSelectedCategory] = useState(
    selectedServiceId || null,
  );
  const [selectedService, setSelectedService] = useState(null); // Changed to single service
  const [loading, setLoading] = useState(null);
  const [cartData, setCartData] = useState(null);

  const subServices = route.params?.subServices || [];
  const services = route.params?.services || [];
  const apiData = route.params?.apiData || {};
  console.log(apiData, 'apiData--->');

  useEffect(() => {
    getCart();
  }, []);

  const isAdded = serviceId => {
    return selectedService?.id === serviceId; // Check if this service is selected
  };

  const getCart = () => {
    GET_WITH_TOKEN(
      GET_CART,
      success => {
        console.log('Cart data:', success);
        if (success?.data?.items && success.data.items.length > 0) {
          // For single selection, only take the first item
          const cartItem = success.data.items[0];
          const selectedItem = {
            ...cartItem,
            id: cartItem.service.id,
            name: cartItem.service.name,
            price: success?.data?.total_price,
          };
          setSelectedService(selectedItem); // Set single service
          setCartData(success.data);
        } else {
          setSelectedService(null); // Clear selection
          setCartData(null);
        }
        setLoading(null);
      },
      error => {
        console.log('Cart fetch error:', error);
        setSelectedService(null);
        setCartData(null);
        setLoading(null);
      },
      fail => {
        console.log('Cart fetch fail:', fail);
        setSelectedService(null);
        setCartData(null);
        setLoading(null);
      },
    );
  };

  const handleCart = async service => {
    if (loading) return;

    setLoading(service.id);

    // If already selected, remove it
    if (isAdded(service.id)) {
      removeFromCart(service, selectedService.cart_id);
    } else {
      // If another service is selected, remove it first
      if (selectedService) {
        await removeExistingService();
      }
      // Then add the new service
      addToCart(service);
    }
  };

  const removeExistingService = () => {
    return new Promise(resolve => {
      POST_FORM_DATA(
        `${REMOVE_TO_CART}${selectedService.cart_id}`,
        null,
        success => {
          console.log('Removed existing service:', success);
          setSelectedService(null);
          resolve();
        },
        error => {
          console.log('Remove existing service error:', error);
          resolve();
        },
        fail => {
          console.log('Remove existing service fail:', fail);
          resolve();
        },
      );
    });
  };

  const addToCart = service => {
    const formData = new FormData();
    formData.append('service_id', service.id);
    formData.append('price', service.price);

    POST_FORM_DATA(
      ADD_TO_CART,
      formData,
      success => {
        console.log('Added to cart:', success);
        const newCartItem = {
          id: service.id,
          name: service.name,
          cart_id: success.data?.cart_id || `temp_${Date.now()}`,
          price: service.price,
        };
        setSelectedService(newCartItem); // Set single service
        setLoading(null);
        getCart();
      },
      error => {
        console.log('Add cart error:', error);
        setLoading(null);
        alert('Failed to add service to cart. Please try again.');
      },
      fail => {
        console.log('Add cart fail:', fail);
        setLoading(null);
        alert('Failed to add service to cart. Please try again.');
      },
    );
  };

  const removeFromCart = (service, cartId) => {
    POST_FORM_DATA(
      `${REMOVE_TO_CART}${cartId}`,
      null,
      success => {
        console.log('Removed from cart:', success);
        setSelectedService(null); // Clear selection
        setLoading(null);
        getCart();
      },
      error => {
        console.log('Remove cart error:', error);
        setLoading(null);
        alert('Failed to remove service from cart. Please try again.');
      },
      fail => {
        console.log('Remove cart fail:', fail);
        setLoading(null);
        alert('Failed to remove service from cart. Please try again.');
      },
    );
  };

  // Filter services for selected category
  const filteredServices = services.filter(
    serv => String(serv.service_id) === String(selectedCategory),
  );

  // Calculate total items and price - For single selection
  const totalItems = selectedService ? 1 : 0;
  const totalPrice = selectedService ? selectedService.price || 0 : 0;

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
                    selectedCategory === item.id && styles.activeCategoryText,
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

          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredServices.length > 0 ? (
              filteredServices.map(srv => (
                <View key={srv.id} style={styles.serviceRow}>
                  <View style={styles.serviceInfo}>
                    <Typography
                      size={14}
                      font={Font.semibold}
                      style={styles.serviceName}>
                      {srv.name}
                    </Typography>
                    <Typography
                      size={14}
                      font={Font.medium}
                      color={COLOR.primary}>
                      ₹{srv.price}
                    </Typography>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.addBtn,
                      isAdded(srv.id) && styles.addedBtn,
                      loading === srv.id && styles.disabledBtn,
                    ]}
                    onPress={() => handleCart(srv)}
                    disabled={loading === srv.id}>
                    {loading === srv.id ? (
                      <ActivityIndicator size="small" color={COLOR.white} />
                    ) : (
                      <Typography
                        size={13}
                        font={Font.semibold}
                        color={isAdded(srv.id) ? COLOR.white : COLOR.black}>
                        {isAdded(srv.id) ? 'Selected' : 'Select'}{' '}
                        {/* Changed text */}
                      </Typography>
                    )}
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={styles.noServices}>
                <Typography size={14} color={COLOR.gray}>
                  No services available in this category
                </Typography>
              </View>
            )}
          </ScrollView>
        </View>
      </View>

      {selectedService && ( // Show only when a service is selected
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('BookingScreen', {
              cartItems: [selectedService], // Pass as array with single item
              cartData: cartData,
              businessData: apiData,
              totalPrice: totalPrice,
            })
          }
          style={styles.bookNowBtn}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            {apiData?.business_name && (
              <Typography
                style={{
                  left: 20,
                  fontSize: 20,
                  fontFamily: Font.semibold,
                  color: COLOR.white,
                  marginBottom: 10,
                  alignSelf: 'flex-start',
                  width: '80%',
                }}>
                {apiData?.business_name || 'Your Selected'}
              </Typography>
            )}
            <View
              style={{
                right: 20,
                borderWidth: 1,
                borderColor: COLOR.white,
                padding: 5,
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                marginBottom: 10,
              }}>
              <Image
                source={images.rightArrow}
                style={{height: 20, width: 20}}
              />
            </View>
          </View>
          <View style={styles.bookNowContent}>
            <Typography size={14} font={Font.semibold} color={COLOR.white}>
              Book Now ({totalItems})
            </Typography>
            <Typography size={20} font={Font.medium} color={COLOR.white}>
              ₹{totalPrice || 0}
            </Typography>
          </View>
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
  categoryImage: {width: 40, height: 40, borderRadius: 8, marginBottom: 5},
  categoryText: {
    flexShrink: 1,
    fontFamily: Font.medium,
    marginTop: 5,
    textAlign: 'center',
  },
  activeCategoryText: {fontWeight: 'bold', color: COLOR.primary},

  rightPane: {flex: 1, padding: 10},
  heading: {
    marginBottom: 10,
    color: COLOR.black,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  serviceInfo: {
    flex: 1,
    marginRight: 10,
  },
  serviceName: {
    marginBottom: 4,
  },
  addBtn: {
    backgroundColor: COLOR.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR.primary,
    minWidth: 70,
    alignItems: 'center',
  },
  addedBtn: {
    backgroundColor: COLOR.primary,
    borderWidth: 0,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  noServices: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  bookNowBtn: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: COLOR.primary,
    paddingVertical: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  bookNowContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
});
