import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {COLOR} from '../../../Constants/Colors';
import HomeHeader from '../../../Components/HomeHeader';
import CustomButton from '../../../Components/CustomButton';
import {windowHeight, windowWidth} from '../../../Constants/Dimensions';
import ScheduleCard from '../../../Components/UI/ScheduleCard';
import moment from 'moment';
import {Typography} from '../../../Components/UI/Typography';
import LinearGradient from 'react-native-linear-gradient';
import Input from '../../../Components/Input';
import {images} from '../../../Components/UI/images';
import SimpleModal from '../../../Components/UI/SimpleModal';
import Button from '../../../Components/UI/Button';
import useKeyboard from '../../../Constants/Utility';
import {Font} from '../../../Constants/Font';
import {CURRENCY, ToastMsg} from '../../../Backend/Utility';
import {POST_FORM_DATA} from '../../../Backend/Api';
import {CUSTOMER_BOOKINGS} from '../../../Constants/ApiRoute';
import {useSelector} from 'react-redux';

const BookingScreen = ({navigation, route}) => {
  const platformFee = 75;
  const tax = 25;
  const businessData = route?.params?.businessData || {};
  console.log('businessData--->', businessData);
  const cartData = route?.params?.cartData;
  console.log('cartData ->>', cartData);
  const cartItems = route?.params?.cartItems || [];
  console.log(cartItems, 'cartItemscartItemscartItems');
  console.log('cartItems-->', cartData);
  const totalPrice = route?.params?.totalPrice + platformFee + tax || 0;
  const userDetail = useSelector(state => state.userDetails);
  console.log('userDetail--->', userDetail);
  const [selectedServices, setSelectedServices] = useState([]);
  console.log(selectedServices, 'selectedServicessssssss');

  const [selectedDate, setSelectedDate] = useState(27);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [note, setNote] = useState('');
  const [selectTime, setSelectTime] = useState(null);
  const [availOffer, setAvailOffer] = useState(false);
  const [calculate, setCalculate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [dateStart, setDateStart] = useState(null);
  const {isKeyboardVisible} = useKeyboard();
  const [showServices, setShowServices] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState('');

  // Get available schedule from business data
  const availableSchedule = businessData?.services[0]?.available_schedule || {};
  console.log('selectedOffervvvvvvv:', selectedOffer);

  const services = [
    {id: 1, name: 'Haircut & Styling', price: 45},
    {id: 2, name: 'Hair Spa', price: 60},
    {id: 3, name: 'Hair Coloring', price: 120},
  ];

  // Function to get available times for selected date
  const getAvailableTimesForDate = selectedDate => {
    if (
      !selectedDate ||
      !availableSchedule ||
      Object.keys(availableSchedule).length === 0
    )
      return [];

    // Convert selected date to DD/MM/YYYY format to match available_schedule format
    const formattedDate = moment(selectedDate).format('DD/MM/YYYY');

    console.log('Looking for date:', formattedDate);
    console.log('Available schedule:', availableSchedule);

    // Find times for the selected date
    const availableTimes = [];

    Object.entries(availableSchedule).forEach(([time, date]) => {
      if (date === formattedDate) {
        availableTimes.push(time);
      }
    });

    console.log('Available times for', formattedDate, ':', availableTimes);
    return availableTimes;
  };

  // Generate time slots based on available schedule for selected date
  const generateTimeSlots = () => {
    if (!dateStart) return [];

    const availableTimes = getAvailableTimesForDate(dateStart);

    // Convert times to the format used in your UI (HH:mm)
    return availableTimes
      .map(time => {
        // If time is in "00:05" format, ensure it has proper formatting
        const [hours, minutes] = time.split(':');
        const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(
          2,
          '0',
        )}`;
        return formattedTime;
      })
      .sort(); // Sort times chronologically
  };

  const times = generateTimeSlots();

  const toggleService = id => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter(s => s !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const toggleTimeSelection = time => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter(t => t !== time));
    } else {
      if (selectedTimes.length < 3) {
        setSelectedTimes([...selectedTimes, time]);
      }
    }
  };

  const selectedItems =
    selectedServices.length > 0
      ? services.filter(s => selectedServices.includes(s.id))
      : [services[0]];

  const subtotal = selectedItems.reduce((sum, s) => sum + s.price, 0);
  const total = subtotal + tax + platformFee;

  const convertTimeSlots = (slots, date) => {
    return slots.map(slot => ({
      ...slot,
      formatted: `${moment(slot.start_time, 'HH:mm:ss').format(
        'h:mm A',
      )} - ${moment(slot.end_time, 'HH:mm:ss').format('h:mm A')}`,
      date: date,
    }));
  };

  const onBooking = is_paid_key => {
    if (selectedTimes.length === 0) {
      ToastMsg('Please select at least one time slot.');
      return;
    }
    console.log('Booking with times:', selectedTimes);
    handleSubmit(is_paid_key);
  };

  const handleSubmit = async is_paid_key => {
    setLoading(true);
    const formattedTimes = selectedTimes.map(time => {
      return time.includes(':') ? `${time}:00` : `${time}:00:00`;
    });
    const body = new FormData();
    body.append('order_id', cartItems[0]?.cart_id);
    body.append('customer_id', userDetail?.id);
    body.append('note', note);
    body.append('vendor_id', businessData?.id);
    body.append('service_id', cartItems[0]?.id);
    body.append('amount', totalPrice || total);
    body.append('tax', '25');
    body.append('platform_fee', '75');
    body.append('status', 'pending');
    body.append('is_paid_key', is_paid_key);
    selectedTimes.forEach((time, index) => {
      body.append(
        `schedule_time[${time}]`,
        dateStart || moment().format('YYYY/MM/DD'),
      );
    });
    console.log(body, 'bodybodybody');
    POST_FORM_DATA(
      CUSTOMER_BOOKINGS,
      body,
      success => {
        console.log('Booking API Success:', success);
        setLoading(false);
        ToastMsg(success?.message || 'Booking successful!');
        navigation.pop();
        navigation.navigate('BookingConfirmation', {
          data: {
            selectedServices: cartItems,
            total: totalPrice || total,
            note,
            selectedTimes,
            bookingData: success,
            businessData,
          },
        });
      },
      error => {
        console.log('Booking API Error:', error);
        setLoading(false);
        ToastMsg('Booking failed. Please try again.');
      },
      fail => {
        console.log('Booking API Fail:', fail);
        setLoading(false);
        ToastMsg('Booking failed. Please try again.');
      },
    );
  };

  // Update available times when date changes
  useEffect(() => {
    if (dateStart) {
      const availableTimes = generateTimeSlots();
      console.log('Updated available times:', availableTimes);
    }
  }, [dateStart]);

  global.getSelectedOffer = v => {
    setSelectedOffer(v);
  };
  return (
    <View style={styles.container}>
      <View style={{paddingHorizontal: 15}}>
        <HomeHeader
          title="Available Services"
          leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
          leftTint={COLOR.primary}
          onLeftPress={() => navigation.goBack()}
        />
      </View>
      <KeyboardAvoidingView
        style={{flex: 1}}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 40}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : isKeyboardVisible
            ? 'height'
            : undefined
        }>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{flex: 1, marginHorizontal: 20}}>
          {/* Salon Card */}
          <View style={styles.salonCard}>
            <View>
              <Typography style={styles.salonName}>
                {businessData?.business_name || 'Salon Name'}
              </Typography>
              <Typography style={styles.salonSubtitle}>
                {businessData?.location_area_served || 'Salon Address'}
              </Typography>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Support');
              }}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={images.support}
                style={{height: 18, width: 18}}
                tintColor={COLOR.primary}
              />
              <Typography
                size={16}
                font={Font.semibold}
                style={{marginLeft: 5}}
                color={COLOR.primary}>
                Support
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Date Selector */}
          <Typography
            size={14}
            font={Font.semibold}
            style={{marginTop: 20, marginBottom: 5}}>
            Select Date & Time of Appoinment
          </Typography>
          <ScheduleCard
            selected_date={
              selectTime?.date || moment()?.utc()?.format('YYYY-MM-DD')
            }
            locationId={businessData?.id}
            onChangeDateVal={(val, month) => {
              let selected_date = `${month?.year}-${String(
                month?.month + 1,
              ).padStart(2, '0')}-${String(val?.date).padStart(2, '0')}`;
              setDateStart(selected_date);
              console.log('Selected date:', selected_date);

              // Clear selected times when date changes
              setSelectedTimes([]);
            }}
          />

          {/* Time Selector */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
              marginTop: 10,
            }}>
            <Typography font={Font.medium} size={14}>
              {times.length > 0
                ? `Available time slots for ${
                    dateStart
                      ? moment(dateStart).format('DD/MM/YYYY')
                      : 'selected date'
                  }`
                : 'No available time slots for selected date'}
            </Typography>
            <Image
              source={images.info}
              style={{height: 15, width: 15, marginLeft: 5}}
            />
          </View>

          {times.length > 0 ? (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <Typography font={Font.medium} size={14}>
                  You can select up-to 3 time slots
                </Typography>
              </View>

              <View style={styles.timeGrid}>
                {times.map(time => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeBox,
                      selectedTimes.includes(time) && styles.selectedTimeBox,
                    ]}
                    onPress={() => toggleTimeSelection(time)}>
                    <Typography
                      style={[
                        styles.timeText,
                        selectedTimes.includes(time) && styles.selectedTimeText,
                      ]}>
                      {time}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.noSlotsContainer}>
              <Typography style={styles.noSlotsText}>
                No available time slots for the selected date. Please choose
                another date.
              </Typography>
            </View>
          )}

          {/* Choose Offer Button */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('OffersScreen', {
                businessId: businessData?.id,
              });
            }}
            style={styles.offerBtn}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image source={images.offer} style={styles.offerIcon} />
              <Typography style={styles.offerText}>Choose Offer</Typography>
            </View>

            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/2985/2985179.png',
              }}
              style={[styles.offerIcon, {marginRight: 0}]}
            />
          </TouchableOpacity>
          {selectedOffer?.promo_code && (
            <View style={styles.offerApplied}>
              <View style={{flexDirection: 'row'}}>
                <Image source={images.offer} style={{height: 24, width: 24}} />
                <View style={{marginLeft: 10}}>
                  <Typography size={13} font={Font.medium}>
                    Offer Applied
                  </Typography>
                  <Typography
                    size={14}
                    font={Font.semibold}
                    color={COLOR.primary}
                    style={{marginTop: 3}}>
                    {selectedOffer?.promo_code}
                  </Typography>
                </View>
              </View>

              <View style={{marginRight: 10}}>
                <Image source={images.cross2} style={{height: 14, width: 14}} />
              </View>
            </View>
          )}

          {/* Bill Details */}
          <View style={styles.billContainer}>
            <Typography style={styles.billTitle}>Bill Details</Typography>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 5,
              }}>
              <TouchableOpacity
                style={{flexDirection: 'row', alignItems: 'center'}}
                onPress={() => setShowServices(!showServices)}>
                <Typography size={14} font={Font.semibold}>
                  Your Services
                </Typography>
                <TouchableOpacity
                  onPress={() => setShowServices(!showServices)}
                  style={{
                    marginLeft: 5,
                    backgroundColor: COLOR.lightGrey,
                    height: 16,
                    width: 16,
                    borderRadius: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 5,
                  }}>
                  <Image
                    source={images.ArrowDown}
                    style={{height: 10, width: 10}}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
              <Typography size={14} font={Font.semibold}>
                ₹ {totalPrice ? totalPrice?.toFixed(2) : '00.00'}
              </Typography>
            </View>

            {/* Services List */}
            {showServices && (
              <View>
                {cartItems?.map((item, index) => {
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 10,
                        // justifyContent: 'space-around',
                      }}>
                      <View style={{alignItems: 'center'}}>
                        <Image
                          source={images.manhair}
                          style={{height: 20, width: 20, marginBottom: 5}}
                          tintColor={COLOR.primary}
                        />
                        {/* <Typography size={12} font={Font.semibold}>
                          {selectedServices?.service.category?.name}
                        </Typography> */}
                      </View>
                      <View>
                        <Typography
                          size={12}
                          font={Font.semibold}
                          style={{
                            width: windowWidth * 0.65,
                            borderBottomWidth: 1,
                            paddingBottom: 5,
                            borderBottomColor: COLOR.lightGrey,
                            marginLeft: 15,
                          }}>
                          {cartItems[0]?.service?.category?.name}
                        </Typography>
                        <View style={styles.serviceRow}>
                          <View>
                            <Typography style={styles.serviceLabel}>
                              {item?.name}
                            </Typography>
                            <Typography style={styles.serviceSub}>
                              From {CURRENCY}
                              {item?.price}
                            </Typography>
                          </View>
                          {/* <TouchableOpacity>
                            <Image
                              source={images.cross2}
                              style={styles.removeIcon}
                            />
                          </TouchableOpacity> */}
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Offer Applied */}
            {selectedOffer?.amount > 0 && (
              <View style={styles.offerAppliedRow}>
                <Typography style={styles.offerAppliedText}>
                  Offer Applied
                </Typography>
                <Typography style={styles.offerCode}>
                  {CURRENCY}
                  {selectedOffer?.amount > 0
                    ? Number(selectedOffer?.amount).toFixed(2)
                    : '0.00'}
                </Typography>
              </View>
            )}

            <View style={styles.offerAppliedRow}>
              <Typography style={styles.offerAppliedText}>Tax</Typography>
              <Typography style={styles.offerCode}>{CURRENCY}25.00</Typography>
            </View>
            <View style={styles.offerAppliedRow}>
              <Typography style={styles.offerAppliedText}>
                Platform Fee
              </Typography>
              <Typography style={styles.offerCode}>{CURRENCY}75.00</Typography>
            </View>

            {/* Total */}
            <View style={styles.totalRow}>
              <Typography style={styles.totalLabel}>Approx Total</Typography>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Typography style={styles.strikePrice}>
                  ₹{(total + 50).toFixed(2)}
                </Typography>
                <Typography style={styles.finalPrice}>
                  {' '}
                  ₹{total.toFixed(2)}
                </Typography>
              </View>
            </View>
          </View>

          {/* <LinearGradient
            colors={['#EE4E34', '#ff9d90ff']}
            start={{x: 1, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.voucherCard}>
            <View style={styles.voucherHeader}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/3523/3523887.png',
                }}
                style={styles.voucherIcon}
              />
              <View style={{flex: 1}}>
                <Typography size={16} font={Font.medium} color="#fff">
                  Earn 15% Discount Voucher
                </Typography>
                <Typography
                  size={14}
                  font={Font.semibold}
                  color="#fff"
                  style={{marginTop: 2}}>
                  + ₹103
                </Typography>
              </View>
            </View>

            <Typography
              size={13}
              font={Font.semibold}
              color="#f3f3f3"
              style={{
                marginTop: 10,
                lineHeight: 20,
                letterSpacing: 0.3,
              }}>
              💡 Use this voucher to save on your next appointment!
            </Typography>
          </LinearGradient> */}

          <Typography
            size={15}
            font={Font.medium}
            color="gray"
            lineHeight={20}
            style={{marginBottom: 15, marginTop: 15}}>
            <Typography size={15} font={Font.semibold}>
              Note:
            </Typography>{' '}
            The total may vary after consultation depending on the length,
            density, product & stylist you choose.
          </Typography>

          <View
            style={{
              backgroundColor: COLOR.white,
              padding: 15,
              borderWidth: 1,
              borderColor: COLOR.lightGrey,
              borderRadius: 10,
              marginBottom: 10,
            }}>
            <TouchableOpacity
              onPress={() => setAvailOffer(true)}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: 15,
                borderBottomWidth: 1,
                borderBottomColor: COLOR.lightGrey,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image source={images.info} style={{height: 18, width: 18.2}} />
                <Typography
                  size={14}
                  font={Font.medium}
                  style={{marginLeft: 10}}>
                  How to avail this offer ?
                </Typography>
              </View>
              <View>
                <Image
                  source={images.rightArrow}
                  style={{height: 18, width: 18}}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setCalculate(true)}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: 15,
                borderBottomWidth: 1,
                borderBottomColor: COLOR.lightGrey,
                marginTop: 15,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={images.calculator}
                  style={{height: 18, width: 18.2}}
                />
                <Typography
                  size={14}
                  font={Font.medium}
                  style={{marginLeft: 10}}>
                  Calculate your bill with offer
                </Typography>
              </View>
              <View>
                <Image
                  source={images.rightArrow}
                  style={{height: 18, width: 18}}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 15,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={images.compose}
                  style={{height: 18, width: 18.2}}
                />
                <Typography
                  size={14}
                  font={Font.medium}
                  style={{marginLeft: 10}}>
                  Add a request
                </Typography>
              </View>
            </View>
            <Input
              placeholder="Eg: Stylist Name"
              value={note}
              onChangeText={setNote}
              height={60}
              inputContainer={{marginTop: -10}}
              textAlignVertical="top"
              multiline={true}
            />
          </View>
          {/* Book Now */}
          {loading ? (
            <View
              style={{
                marginBottom: 20,
                alignItems: 'center',
                marginBottom: 30,
                paddingVertical: 30,
              }}>
              <Typography textAlign={'center'} color={COLOR.primary} size={16}>
                Booking...
              </Typography>
            </View>
          ) : (
            <View
              style={{
                marginBottom: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 30,
              }}>
              <Button
                title={loading ? 'Booking...' : 'Pay After Service'}
                containerStyle={{
                  marginBottom: 10,
                  marginTop: 10,
                  width: '58%',
                  backgroundColor: COLOR.white,
                  borderWidth: 1,
                  borderColor: COLOR.primary,
                }}
                onPress={() => onBooking('0')}
                titleColor={COLOR.primary}
                disabled={loading}
              />
              <Button
                title={loading ? 'Booking...' : 'Pay Now'}
                containerStyle={{marginBottom: 10, marginTop: 10, width: '38%'}}
                onPress={() => onBooking('1')}
                disabled={loading}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Rest of the modal code remains exactly the same */}
      <SimpleModal
        visible={availOffer}
        onClose={() => setAvailOffer(false)}
        overlay={{justifyContent: 'flex-end'}}
        modalContainer={{
          width: '100%',
          borderRadius: 0,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          maxHeight: '70%',
        }}>
        {/* ... (modal content remains exactly the same) ... */}
      </SimpleModal>

      <SimpleModal
        visible={calculate}
        onClose={() => setCalculate(false)}
        overlay={{justifyContent: 'flex-end'}}
        modalContainer={{
          width: '100%',
          borderRadius: 0,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          maxHeight: '70%',
        }}>
        {/* ... (modal content remains exactly the same) ... */}
      </SimpleModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  salonCard: {
    backgroundColor: COLOR.white,
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    elevation: 2,
    margin: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  salonName: {color: COLOR.primary, fontSize: 16, fontFamily: Font.semibold},
  salonSubtitle: {color: COLOR.black, fontSize: 14, fontFamily: Font.medium},

  sectionTitle: {
    fontSize: 14,
    fontFamily: Font.medium,
    marginTop: 15,
    marginBottom: 5,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    marginTop: 5,
  },
  timeBox: {
    backgroundColor: COLOR.white,
    borderWidth: 1,
    borderColor: COLOR.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginHorizontal: 5,
    marginBottom: 10,
    width: (windowWidth - 80) / 4,
    alignItems: 'center',
    fontFamily: Font.medium,
  },
  selectedTimeBox: {backgroundColor: COLOR.primary, fontFamily: Font.medium},
  timeText: {color: '#333', fontSize: 13, fontFamily: Font.semibold},
  selectedTimeText: {color: '#fff', fontFamily: Font.medium},
  noSlotsContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  noSlotsText: {
    color: '#666',
    fontSize: 14,
    fontFamily: Font.medium,
    textAlign: 'center',
  },
  offerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.white,
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    justifyContent: 'space-between',
    margin: 1,
  },
  offerIcon: {width: 24, height: 24, marginRight: 10},
  offerText: {fontSize: 15, fontFamily: Font.semibold, color: COLOR.primary},
  billContainer: {
    backgroundColor: COLOR.white,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLOR.lightGrey,
  },
  billTitle: {fontSize: 16, fontFamily: Font.semibold, marginBottom: 10},
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  billLabel: {fontSize: 14, color: '#555'},
  billValue: {fontSize: 14, fontFamily: Font.semibold},
  totalLabel: {fontSize: 15, fontFamily: Font.semibold},
  totalValue: {fontSize: 15, fontFamily: Font.semibold, color: COLOR.primary},
  noteContainer: {marginBottom: 15},
  noteLabel: {
    fontSize: 15,
    fontFamily: Font.semibold,
    marginBottom: 6,
    marginTop: 20,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  voucherCard: {
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    marginTop: 15,
  },
  voucherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  voucherIcon: {
    width: 36,
    height: 36,
    marginRight: 10,
  },
  offerApplied: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLOR.lightGrey,
    borderRadius: 8,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    marginStart: 15,
  },
  serviceLabel: {fontSize: 15, fontFamily: Font.semibold, color: '#333'},
  serviceSub: {fontSize: 12, color: '#888', marginTop: 2},
  removeIcon: {width: 14, height: 14, tintColor: '#444'},

  offerAppliedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  offerAppliedText: {fontSize: 14, fontFamily: Font.medium, color: '#444'},
  offerCode: {fontSize: 14, fontFamily: Font.semibold, color: '#222'},

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  strikePrice: {
    fontSize: 14,
    color: '#888',
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  finalPrice: {fontSize: 16, fontFamily: Font.semibold, color: COLOR.primary},
});

export default BookingScreen;
