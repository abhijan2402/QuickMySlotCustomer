import React, {useState} from 'react';
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

const BookingScreen = ({navigation}) => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(27);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [note, setNote] = useState('');
  const [selectTime, setSelectTime] = useState(null);
  const [availOffer, setAvailOffer] = useState(false);
  const [calculate, setCalculate] = useState(false);

  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [dateStart, setDateStart] = useState(null);
  const {isKeyboardVisible} = useKeyboard();
  const [showServices, setShowServices] = useState(false);

  // Mock location data with provider availability
  const mockLocation = {
    id: 'location-1',
    name: 'Test Location',
    provider_availability: [
      {
        date: moment().utc().format('YYYY-MM-DD'), // Today
        time_slot: [
          {start_time: '09:00:00', end_time: '10:00:00'},
          {start_time: '10:00:00', end_time: '11:00:00'},
          {start_time: '11:00:00', end_time: '12:00:00'},
          {start_time: '14:00:00', end_time: '15:00:00'},
          {start_time: '15:00:00', end_time: '16:00:00'},
        ],
      },
      {
        date: moment().add(1, 'days').utc().format('YYYY-MM-DD'), // Tomorrow
        time_slot: [
          {start_time: '09:00:00', end_time: '10:00:00'},
          {start_time: '10:30:00', end_time: '11:30:00'},
          {start_time: '13:00:00', end_time: '14:00:00'},
        ],
      },
      {
        date: moment().add(2, 'days').utc().format('YYYY-MM-DD'),
        time_slot: [
          {start_time: '08:00:00', end_time: '09:00:00'},
          {start_time: '11:00:00', end_time: '12:00:00'},
          {start_time: '15:00:00', end_time: '16:00:00'},
        ],
      },
    ],
  };

  const [location_id, setLocation_id] = useState(mockLocation);

  const services = [
    {id: 1, name: 'Haircut & Styling', price: 45},
    {id: 2, name: 'Hair Spa', price: 60},
    {id: 3, name: 'Hair Coloring', price: 120},
  ];

  const times = [
    '08:00 AM',
    '08:30 AM',
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '13:00 PM',
    '13:30 PM',
    '14:00 PM',
    '14:30 PM',
    '15:00 PM',
    '15:30 PM',
    '16:00 PM',
    '16:30 PM',
  ];

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

  const platformFee = 2;
  const subtotal = selectedItems.reduce((sum, s) => sum + s.price, 0);
  const tax = subtotal * 0.1;
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
                Glamour Touch Salon
              </Typography>
              <Typography style={styles.salonSubtitle}>
                Luxury salon services
              </Typography>
            </View>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={images.support}
                style={{height: 18, width: 18}}
                tintColor={COLOR.primary}
              />
              <Typography
                size={16}
                fontWeight={'500'}
                style={{marginLeft: 5}}
                color={COLOR.primary}>
                Support
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Date Selector */}
          <Typography
            size={16}
            fontWeight={'500'}
            style={{marginTop: 20, marginBottom: 5}}>
            Select Date & Time of Appoinment
          </Typography>
          <ScheduleCard
            selected_date={
              selectTime?.date || moment()?.utc()?.format('YYYY-MM-DD')
            }
            locationId={location_id?.id}
            onChangeDateVal={(val, month) => {
              let selected_date = `${month?.year}-${String(
                month?.month + 1,
              ).padStart(2, '0')}-${String(val?.date).padStart(2, '0')}`;

              setDateStart(selected_date);
              const temp = location_id?.provider_availability?.find(
                v => v?.date == selected_date,
              );
              const now = new Date();
              const todayStr = now.toISOString().split('T')[0];

              let upcomingSlots = [];

              if (temp?.date === todayStr) {
                upcomingSlots = temp?.time_slot.filter(slot => {
                  const slotStart = new Date(
                    `${temp?.date}T${slot?.start_time}`,
                  );
                  return slotStart > now;
                });
              } else {
                upcomingSlots = temp?.time_slot;
              }

              setAvailableTimeSlots(
                convertTimeSlots(
                  upcomingSlots || temp?.time_slot || [],
                  selected_date,
                ),
              );
            }}
          />

          {/* Time Selector */}
          <Typography style={styles.sectionTitle}>Choose Time</Typography>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <Typography size={16}>You can select up-to 3 time slots</Typography>
            <Image
              source={images.info}
              style={{height: 15, width: 15, marginLeft: 5}}
            />
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

          {/* Choose Offer Button */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('OffersScreen');
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
          <View style={styles.offerApplied}>
            <View style={{flexDirection: 'row'}}>
              <Image source={images.offer} style={{height: 24, width: 24}} />
              <View style={{marginLeft: 10}}>
                <Typography size={14} fontWeight={'500'}>
                  Offer Applied
                </Typography>
                <Typography size={16} fontWeight={'500'} style={{marginTop: 3}}>
                  FIRST40
                </Typography>
              </View>
            </View>
            <View style={{marginRight: 10}}>
              <Image source={images.cross2} style={{height: 14, width: 14}} />
            </View>
          </View>

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
                <Typography size={14} fontWeight={'500'}>
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
              <Typography size={14} fontWeight={'500'}>
                ₹ 944
              </Typography>
            </View>

            {/* Services List */}
            {showServices && (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    justifyContent: 'space-around',
                  }}>
                  <View style={{alignItems: 'center'}}>
                    <Image
                      source={images.manhair}
                      style={{height: 20, width: 20, marginBottom: 5}}
                      tintColor={COLOR.primary}
                    />
                    <Typography size={12} fontWeight={'500'}>
                      Men
                    </Typography>
                  </View>
                  <View>
                    <Typography
                      size={12}
                      fontWeight={'500'}
                      style={{
                        width: windowWidth * 0.65,
                        borderBottomWidth: 1,
                        paddingBottom: 5,
                        borderBottomColor: COLOR.lightGrey,
                      }}>
                      Men's Grooming
                    </Typography>
                    <View style={styles.serviceRow}>
                      <View>
                        <Typography style={styles.serviceLabel}>
                          Bread Trim
                        </Typography>
                        <Typography style={styles.serviceSub}>
                          From ₹ 300 + GST
                        </Typography>
                      </View>
                      <TouchableOpacity>
                        <Image
                          source={images.cross2}
                          style={styles.removeIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    justifyContent: 'space-around',
                  }}>
                  <View style={{alignItems: 'center'}}>
                    <Image
                      source={images.manhair}
                      style={{height: 20, width: 20, marginBottom: 5}}
                      tintColor={COLOR.primary}
                    />
                    <Typography size={12} fontWeight={'500'}>
                      Men
                    </Typography>
                  </View>
                  <View>
                    <Typography
                      size={12}
                      fontWeight={'500'}
                      style={{
                        width: windowWidth * 0.65,
                        borderBottomWidth: 1,
                        paddingBottom: 5,
                        borderBottomColor: COLOR.lightGrey,
                      }}>
                      Hair Care | Haircut{' '}
                    </Typography>
                    <View style={styles.serviceRow}>
                      <View>
                        <Typography style={styles.serviceLabel}>
                          Haircut
                        </Typography>
                        <Typography style={styles.serviceSub}>
                          Includes hair wash
                        </Typography>
                        <Typography style={styles.serviceSub}>
                          From ₹ 300 + GST
                        </Typography>
                      </View>
                      <TouchableOpacity>
                        <Image
                          source={images.cross2}
                          style={styles.removeIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Offer Applied */}
            <View style={styles.offerAppliedRow}>
              <Typography style={styles.offerAppliedText}>
                Offer Applied
              </Typography>
              <Typography style={styles.offerCode}>FIRST40</Typography>
            </View>

            {/* Total */}
            <View style={styles.totalRow}>
              <Typography style={styles.totalLabel}>Approx Total</Typography>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Typography style={styles.strikePrice}>
                  ₹${(total + 50).toFixed(2)}
                </Typography>
                <Typography style={styles.finalPrice}>
                  {' '}
                  ₹{total.toFixed(2)}
                </Typography>
              </View>
            </View>
          </View>

          <LinearGradient
            colors={['#796FC3', '#ADA4E2']}
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
                <Typography size={16} fontWeight="600" color="#fff">
                  Earn 15% Discount Voucher
                </Typography>
                <Typography
                  size={14}
                  fontWeight="600"
                  color="#fff"
                  style={{marginTop: 2}}>
                  + ₹103
                </Typography>
              </View>
            </View>

            <Typography
              size={13}
              fontWeight="400"
              color="#f3f3f3"
              style={{
                marginTop: 10,
                lineHeight: 20,
                letterSpacing: 0.3,
              }}>
              💡 Use this voucher to save on your next appointment!
            </Typography>
          </LinearGradient>
          <Typography
            size={15}
            fontWeight={'400'}
            color="gray"
            lineHeight={20}
            style={{marginBottom: 15}}>
            <Typography size={15} fontWeight={'400'}>
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
                  size={16}
                  fontWeight={'500'}
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
                  size={16}
                  fontWeight={'500'}
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
                  size={16}
                  fontWeight={'500'}
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
            />
          </View>
          {/* Book Now */}
          <Button
            title="Book Now"
            containerStyle={{marginBottom: 10, marginTop: 10}}
            onPress={() => {
              navigation.navigate('BookingConfirmation', {
                selectedServices,
                total,
                note,
                selectedTimes,
              });
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 10,
          }}>
          <Typography
            size={18}
            fontWeight={'700'}
            textAlign={'center'}
            style={{marginTop: 10}}>
            How to avail the offer ?
          </Typography>
          <TouchableOpacity style={{}} onPress={() => setAvailOffer(false)}>
            <Image source={images.cross2} style={{height: 16, width: 16}} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={{}}>
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 15,
              marginTop: 20,
              borderWidth: 1,
              borderColor: COLOR.lightGrey,
              borderRadius: 16,
            }}>
            <Typography size={16} fontWeight={'500'} color={COLOR.primary}>
              Step 1
            </Typography>
            <Typography size={18} fontWeight={'500'} style={{marginTop: 5}}>
              Book your appoinment with the app
            </Typography>
          </View>
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 15,
              marginTop: 15,
              borderWidth: 1,
              borderColor: COLOR.lightGrey,
              borderRadius: 16,
            }}>
            <Typography size={16} fontWeight={'500'} color={COLOR.primary}>
              Step 2
            </Typography>
            <Typography size={18} fontWeight={'500'} style={{marginTop: 5}}>
              Visit for your appoinment to avail all the services
            </Typography>
          </View>
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 15,
              marginTop: 15,
              borderWidth: 1,
              borderColor: COLOR.lightGrey,
              borderRadius: 16,
            }}>
            <Typography size={16} fontWeight={'500'} color={COLOR.primary}>
              Step 3
            </Typography>
            <Typography size={18} fontWeight={'500'} style={{marginTop: 5}}>
              Pay your bill with the app using any mode of online payment after
              availing your services
            </Typography>
          </View>
          <Typography size={14} fontWeight={'500'} style={{marginTop: 15}}>
            *Discount will be applicable on the final bill amount including all
            taxes.
          </Typography>
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 15,
              marginTop: 15,
              borderWidth: 1,
              borderColor: COLOR.lightGrey,
              borderRadius: 16,
            }}>
            <Typography
              size={18}
              fontWeight={'500'}
              textAlign={'center'}
              color={COLOR.primary}>
              Sample Bill
            </Typography>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 15,
              }}>
              <Typography size={14} fontWeight={'500'}>
                if Total Bill is
              </Typography>
              <Typography size={14} fontWeight={'500'}>
                ₹ 944
              </Typography>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 15,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image source={images.promo} style={{height: 16, width: 18}} />
                <Typography
                  size={14}
                  fontWeight={'500'}
                  style={{marginLeft: 10}}>
                  Discount Voucher
                </Typography>
              </View>

              <Typography size={14} fontWeight={'500'}>
                - ₹ 25
              </Typography>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 15,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={images.discount}
                  style={{height: 16, width: 16}}
                />
                <Typography
                  size={14}
                  fontWeight={'500'}
                  style={{marginLeft: 10}}>
                  25% Discount
                </Typography>
              </View>
              <Typography size={14} fontWeight={'500'}>
                - ₹ 229
              </Typography>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 15,
                borderBottomWidth: 1,
                borderBottomColor: COLOR.lightGrey,
                paddingBottom: 20,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image source={images.phone} style={{height: 16, width: 16}} />
                <Typography
                  size={14}
                  fontWeight={'500'}
                  style={{marginLeft: 10}}>
                  Platform Fee
                </Typography>
              </View>
              <Typography size={14} fontWeight={'500'}>
                + ₹ 10
              </Typography>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 15,
              }}>
              <Typography size={14} fontWeight={'500'}>
                Net Payable Amount :
              </Typography>
              <Typography size={14} fontWeight={'500'}>
                + ₹ 690
              </Typography>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image source={images.money} style={{height: 16, width: 16}} />
                <Typography
                  size={14}
                  fontWeight={'500'}
                  style={{marginLeft: 10}}>
                  15% Discount Voucher Earned
                </Typography>
              </View>
              <Typography size={14} fontWeight={'500'}>
                + ₹ 103
              </Typography>
            </View>
            <Typography
              size={14}
              fontWeight={'500'}
              style={{marginTop: 20, marginBottom: 5}}>
              Note: App Discount Voucher earned can be used to pay for next
              appoinment at any partner on the app
            </Typography>
          </View>
          <TouchableOpacity>
            <Typography
              size={16}
              fontWeight={'500'}
              color={COLOR.primary}
              style={{marginTop: 15}}>
              Still confused ?
            </Typography>
          </TouchableOpacity>

          <Button
            containerStyle={{
              width: '100%',
              marginTop: 15,
              backgroundColor: 'green',
            }}
            title={'Whatsapp Customer Care'}
            leftImg={images.discount}
            leftImgStyle={{
              height: 20,
              width: 20,
              tintColor: COLOR.white,
              marginRight: 20,
            }}
          />
        </ScrollView>
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <Typography size={18} fontWeight={'500'} textAlign={'center'}>
            This is a Sample bill for your refrence
          </Typography>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 20,
            }}>
            <View
              style={{
                width: '66%',
                borderWidth: 1,
                borderColor: COLOR.primary,
                borderRadius: 8,
                height: 50,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
              }}>
              <TextInput
                style={{flex: 1, marginRight: 10, color: COLOR.black}}
              />
              <TouchableOpacity>
                <Image source={images.cross2} style={{height: 14, width: 14}} />
              </TouchableOpacity>
            </View>
            <Button
              containerStyle={{width: '30%', height: 50, marginBottom: 0}}
              title={'Calculate'}
            />
          </View>
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 15,
              marginTop: 15,
              borderWidth: 1,
              borderColor: COLOR.lightGrey,
              borderRadius: 16,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 5,
              }}>
              <Typography size={14} fontWeight={'500'}>
                if Total Bill is
              </Typography>
              <Typography size={14} fontWeight={'500'}>
                ₹ 944
              </Typography>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 15,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={images.promo}
                  style={{height: 16, width: 18}}
                  tintColor={COLOR.primary}
                />
                <Typography
                  size={14}
                  fontWeight={'500'}
                  style={{marginLeft: 10}}>
                  Discount Voucher
                </Typography>
              </View>

              <Typography size={14} fontWeight={'500'}>
                - ₹ 25
              </Typography>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 15,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={images.discount}
                  style={{height: 16, width: 16}}
                  tintColor={COLOR.primary}
                />
                <Typography
                  size={14}
                  fontWeight={'500'}
                  style={{marginLeft: 10}}>
                  25% Discount
                </Typography>
              </View>
              <Typography size={14} fontWeight={'500'}>
                - ₹ 229
              </Typography>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 15,
                borderBottomWidth: 1,
                borderBottomColor: COLOR.lightGrey,
                paddingBottom: 20,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image source={images.phone} style={{height: 16, width: 16}} />
                <Typography
                  size={14}
                  fontWeight={'500'}
                  style={{marginLeft: 10}}>
                  Platform Fee
                </Typography>
              </View>
              <Typography size={14} fontWeight={'500'}>
                + ₹ 10
              </Typography>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 15,
              }}>
              <Typography size={14} fontWeight={'500'}>
                Net Payable Amount :
              </Typography>
              <Typography size={14} fontWeight={'500'}>
                + ₹ 690
              </Typography>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image source={images.money} style={{height: 16, width: 16}} />
                <Typography
                  size={14}
                  fontWeight={'500'}
                  style={{marginLeft: 10}}>
                  15% Discount Voucher Earned
                </Typography>
              </View>
              <Typography size={14} fontWeight={'500'}>
                + ₹ 103
              </Typography>
            </View>
            <Typography
              size={14}
              fontWeight={'500'}
              style={{marginTop: 20, marginBottom: 5}}>
              Note: App Discount Voucher earned can be used to pay for next
              appoinment at any partner on the app
            </Typography>
          </View>
        </ScrollView>
      </SimpleModal>
    </View>
  );
};

export default BookingScreen;

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
  salonName: {color: COLOR.primary, fontSize: 16, fontWeight: '600'},
  salonSubtitle: {color: COLOR.black, fontSize: 14},

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
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
  },
  selectedTimeBox: {backgroundColor: COLOR.primary},
  timeText: {color: '#333', fontSize: 13},
  selectedTimeText: {color: '#fff'},
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
  offerText: {fontSize: 15, fontWeight: '600', color: COLOR.primary},
  billContainer: {
    backgroundColor: COLOR.white,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLOR.lightGrey,
  },
  billTitle: {fontSize: 16, fontWeight: '600', marginBottom: 10},
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  billLabel: {fontSize: 14, color: '#555'},
  billValue: {fontSize: 14, fontWeight: '600'},
  totalLabel: {fontSize: 15, fontWeight: '700'},
  totalValue: {fontSize: 15, fontWeight: '700', color: COLOR.primary},
  noteContainer: {marginBottom: 15},
  noteLabel: {fontSize: 15, fontWeight: '600', marginBottom: 6, marginTop: 20},
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
  },
  serviceLabel: {fontSize: 15, fontWeight: '600', color: '#333'},
  serviceSub: {fontSize: 12, color: '#888', marginTop: 2},
  removeIcon: {width: 14, height: 14, tintColor: '#444'},

  offerAppliedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  offerAppliedText: {fontSize: 14, fontWeight: '600', color: '#444'},
  offerCode: {fontSize: 14, fontWeight: '600', color: '#222'},

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
  finalPrice: {fontSize: 16, fontWeight: 'bold', color: COLOR.primary},
});
