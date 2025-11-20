import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { COLOR } from '../../../Constants/Colors';
import HomeHeader from '../../../Components/HomeHeader';
import { Typography } from '../../../Components/UI/Typography';
import { Font } from '../../../Constants/Font';
import {
  ADD_TO_CART,
  CLEAR_CART,
  GET_CART,
  REMOVE_TO_CART,
} from '../../../Constants/ApiRoute';
import { GET_WITH_TOKEN, POST_FORM_DATA } from '../../../Backend/Api';
import { images } from '../../../Components/UI/images';
import { ToastMsg, windowWidth } from '../../../Backend/Utility';
import AddonModal from '../../../Components/UI/AddonModal';
import { useIsFocused } from '@react-navigation/native';
import CartModal from '../../../Components/CartModal';

const ServiceList = ({ navigation, route }) => {
  const selectedServiceId = route.params?.subServicesId || null;
  const [selectedCategory, setSelectedCategory] = useState(
    selectedServiceId || null,
  );
  const [selectedService, setSelectedService] = useState([]); // Changed to single service
  const [loading, setLoading] = useState(null);
  const [cartData, setCartData] = useState(null);
  const [totalAmountVal, settotalAmountVal] = useState(0)
  const [totalLength, settotalLength] = useState(0)
  const [CartItemVal, setCartItemVal] = useState([])
  const [showAddonModal, setshowAddonModal] = useState(false)
  const [selectedAddon, setSelectedAddon] = useState({})
  const subServices = route.params?.subServices || [];
  const services = route.params?.services || [];
  const apiData = route.params?.apiData || {};
  const [selectedGender, setSelectedGender] = useState("male"); // default male
  const [cartLoader, setcartLoader] = useState(false)
  const category = route?.params?.category;
  console.log(category, "IMMM_____");

  const isFocus = useIsFocused()
  useEffect(() => {
    if (isFocus) {
      getCart();
    }
  }, [isFocus]);
  const isAdded = serviceId => {
    return Array.isArray(selectedService)
      ? selectedService.some(service => service.id === serviceId)
      : false;
  };

  const getCart = () => {
    setcartLoader(true)
    GET_WITH_TOKEN(
      GET_CART,
      success => {
        setcartLoader(false)
        const items = success?.data?.items || [];
        setCartItemVal(items)
        if (items.length > 0) {
          // Map each item to include consistent structure
          const selectedItems = items.map(cartItem => ({
            ...cartItem,
            id: cartItem?.service?.id,
            name: cartItem?.service?.name,
            price: cartItem?.service?.price || cartItem?.price,
            cart_id: cartItem?.id
          }));
          // console.log(selectedItems, "SELECTDED__ITEMMMSMM");

          settotalAmountVal(success?.data?.total_price)
          settotalLength(success?.data?.total_items)
          setSelectedService(selectedItems); // Now an array
          setCartData(success.data);
        } else {
          setSelectedService([]); // Empty array when no items
          setCartData(null);
        }

        setLoading(null);
      },
      error => {
        setcartLoader(false)
        setSelectedService([]);
        setCartData(null);
        setLoading(null);
      },
      fail => {
        setcartLoader(false)
        setSelectedService([]);
        setCartData(null);
        setLoading(null);
      },
    );
  };


  const handleCart = async (service, addon, key, value) => {
    if (loading) return;

    setLoading(service.id);
    if (isAdded(service.id)) {
      const filteredVal = CartItemVal?.filter(i =>
        selectedService?.some(j => j?.service?.id === i?.service_id)
      );
      if (filteredVal?.length > 0) {
        removeFromCart(service, filteredVal[0]?.id);
      }
    } else {
      if (selectedService) {
        await removeExistingService();
      }
      if (addon) {
        addToCart(service, key, value);
      } else {
        addToCart(service);
      }
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

  const addToCart = (service, key, value) => {
    const formData = new FormData();
    formData.append('service_id', service.id);
    formData.append('price', service.price);
    if (key) {
      formData.append(`addons[${key}]`, value);

    }
    POST_FORM_DATA(
      ADD_TO_CART,
      formData,
      success => {
        // getCart()
        const newCartItem = {
          id: service.id,
          name: service.name,
          cart_id: success.data?.cart_id || `temp_${Date.now()}`,
          price: service.price,
        };
        // setSelectedService(newCartItem); // Set single service
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
        ToastMsg(success?.message);
        setSelectedService(null); // Clear selection
        setLoading(null);
        getCart();
      },
      error => {
        setLoading(null);
        ToastMsg(error?.message);
      },
      fail => {
        console.log('Remove cart fail:', fail);
        setLoading(null);
        alert('Failed to remove service from cart. Please try again.');
      },
    );
  };
  const filteredServices = services.filter(serv => {
    const isCategoryMatch = String(serv.service_id) === String(selectedCategory);

    // Apply gender filter only if category is 1, 2, or 3
    if (
      String(category) === "1" ||
      String(category) === "2" ||
      String(category) === "3"
    ) {
      const isGenderMatch =
        String(serv.gender) === String(selectedGender) ||
        String(serv.gender) === "unisex";

      return isCategoryMatch && isGenderMatch;
    }

    // For all other categories, return only category match
    return isCategoryMatch;
  });



  // Calculate total items and price - For single selection
  const totalItems = selectedService ? 1 : 0;
  const totalPrice = selectedService ? selectedService.price || 0 : 0;


  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 15 }}>
        <HomeHeader
          title="Services"
          leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
          leftTint={COLOR.black}
        />
      </View>

      <View style={{ flex: 1, flexDirection: 'row' }}>
        {/* Left Side Category */}

        <View style={styles.leftPane}>
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 60 }}
            data={subServices}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  selectedCategory === item.id && styles.activeCategory,
                ]}
                onPress={() => setSelectedCategory(item.id)}>
                <Image
                  source={{ uri: item.image_url }}
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
          {
            String(category) == "1" ||
              String(category) == "2" ||
              String(category) === "3" ?
              <View style={{ flexDirection: "row", marginBottom: 10 }}>

                {/* Male Button */}
                <TouchableOpacity
                  onPress={() => setSelectedGender("male")}
                  style={{
                    flexDirection: "row",
                    borderWidth: 1,
                    borderColor: COLOR.primary,
                    width: windowWidth / 3,
                    marginRight: 10,
                    borderRadius: 5,
                    padding: 5,
                    justifyContent: "center",
                    backgroundColor: selectedGender === "male" ? COLOR.primary : "white"
                  }}
                >
                  <Image
                    source={{ uri: "https://cdn-icons-png.flaticon.com/128/3741/3741578.png" }}
                    style={{
                      width: 18,
                      height: 18,
                      marginRight: 10,
                      tintColor: selectedGender === "male" ? "white" : COLOR.primary
                    }}
                  />
                  <Typography style={{ color: selectedGender === "male" ? "white" : COLOR.primary }}>
                    Male
                  </Typography>
                </TouchableOpacity>

                {/* Female Button */}
                <TouchableOpacity
                  onPress={() => setSelectedGender("female")}
                  style={{
                    flexDirection: "row",
                    borderWidth: 1,
                    borderColor: COLOR.primary,
                    width: windowWidth / 3,
                    marginRight: 10,
                    borderRadius: 5,
                    padding: 5,
                    justifyContent: "center",
                    backgroundColor: selectedGender === "female" ? COLOR.primary : "white"
                  }}
                >
                  <Image
                    source={{ uri: "https://cdn-icons-png.flaticon.com/128/3741/3741715.png" }}
                    style={{
                      width: 18,
                      height: 18,
                      marginRight: 10,
                      tintColor: selectedGender === "female" ? "white" : COLOR.primary
                    }}
                  />
                  <Typography style={{ color: selectedGender === "female" ? "white" : COLOR.primary }}>
                    Female
                  </Typography>
                </TouchableOpacity>

              </View> : null
          }
          <Typography size={17} font={Font.semibold} style={styles.heading}>
            {subServices.find(s => s.id === selectedCategory)?.name ||
              'Services'}
          </Typography>

          <ScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
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
                  <View>
                    <TouchableOpacity
                      style={[
                        styles.addBtn,
                        isAdded(srv.id) && styles.addedBtn,
                        loading === srv.id && styles.disabledBtn,
                      ]}
                      onPress={() => {
                        const filteredVal = CartItemVal?.filter(i =>
                          srv.id === i?.service_id);
                        if (filteredVal?.length > 0) {
                          removeFromCart("", filteredVal[0]?.id);
                        } else {
                          if (srv?.addons != null) {
                            setSelectedAddon(srv)
                            setshowAddonModal(true)
                          } else {
                            handleCart(srv)
                          }
                        }
                      }}
                      disabled={loading === srv.id}>
                      {loading === srv.id ? (
                        <ActivityIndicator size="small" color={COLOR.white} />
                      ) : (
                        <Typography
                          size={13}
                          font={Font.semibold}
                          color={isAdded(srv.id) ? COLOR.white : COLOR.black}>
                          {isAdded(srv.id) ? 'Added' : 'Add +'}{' '}
                          {/* Changed text */}
                        </Typography>
                      )}
                    </TouchableOpacity>
                    {
                      srv?.addons != null &&
                      <Typography
                        marginTop={4}
                        textAlign={"center"}
                        size={10}
                        font={Font.regular}
                        color={isAdded(srv.id) ? COLOR.white : COLOR.black}>
                        customisable
                      </Typography>
                    }
                  </View>

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

      {/* {CartItemVal?.length > 0 && ( // Show only when a service is selected
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
          </View>
          <View style={styles.bookNowContent}>
            <Typography size={16} font={Font.semibold} color={COLOR.white}>
              Book Now ({totalLength})
            </Typography>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Typography size={20} font={Font.medium} color={COLOR.white}>
                ₹{totalAmountVal || 0}
              </Typography>
              <TouchableOpacity style={{ borderWidth: 1, padding: 0, borderRadius: 5, borderColor: COLOR.white, marginLeft: 15 }} onPress={handleClearCart}>
                <Image source={{ uri: "https://cdn-icons-png.flaticon.com/128/1828/1828843.png" }} style={{ width: 25, height: 25 }} />
              </TouchableOpacity>

            </View>
          </View>

        </TouchableOpacity>
      )} */}
      {
        !cartLoader ?
          <CartModal onCartCall={getCart} /> : null
      }

      <AddonModal
        onAddService={(val, key, value) => { handleCart(val, true, key, value); setshowAddonModal(false) }}
        visible={showAddonModal}
        onClose={() => setshowAddonModal(false)}
        selectedAddon={selectedAddon} />
    </View>
  );
};

export default ServiceList;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  leftPane: { width: 100, backgroundColor: '#f9f9f9' },
  categoryItem: {
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  activeCategory: { backgroundColor: '#e6f0ff' },
  categoryImage: { width: 40, height: 40, borderRadius: 8, marginBottom: 5 },
  categoryText: {
    flexShrink: 1,
    fontFamily: Font.medium,
    marginTop: 5,
    textAlign: 'center',
  },
  activeCategoryText: { fontWeight: 'bold', color: COLOR.primary },

  rightPane: { flex: 1, padding: 10 },
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
    shadowOffset: { width: 0, height: 3 },
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
