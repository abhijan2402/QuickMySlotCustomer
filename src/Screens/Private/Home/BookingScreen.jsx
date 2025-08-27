import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import {COLOR} from '../../../Constants/Colors';
import HomeHeader from '../../../Components/HomeHeader';
import CustomButton from '../../../Components/CustomButton';
import {windowHeight, windowWidth} from '../../../Constants/Dimensions';
import ScheduleCard from '../../../Components/UI/ScheduleCard';
import moment from 'moment';

const BookingScreen = ({navigation}) => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(27);
  const [selectedTime, setSelectedTime] = useState(null);
  const [note, setNote] = useState('');
  const [selectTime, setSelectTime] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [dateStart, setDateStart] = useState(null);
  const [location_id, setLocation_id] = useState(mockLocation);

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
      // Add more dates as needed
    ],
  };

  // Demo services (not displayed but used for price calc if selected)
  const services = [
    {
      id: 1,
      name: 'Haircut & Styling',
      price: 45,
    },
    {
      id: 2,
      name: 'Hair Spa',
      price: 60,
    },
    {
      id: 3,
      name: 'Hair Coloring',
      price: 120,
    },
  ];

  const dates = [
    {day: 27, label: 'Fri'},
    {day: 28, label: 'Sat'},
    {day: 29, label: 'Sun'},
    {day: 30, label: 'Mon'},
    {day: 31, label: 'Tue'},
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

  // If no services selected, show demo price
  const selectedItems =
    selectedServices.length > 0
      ? services.filter(s => selectedServices.includes(s.id))
      : [services[0]]; // default demo service
  const platformFee = 2; // fixed platform fee
  const subtotal = selectedItems.reduce((sum, s) => sum + s.price, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax + platformFee;

  // Mock function to convert time slots (replace with your actual implementation)
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
      <HomeHeader
        title="Available Services"
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.primary}
        onLeftPress={() => navigation.goBack()}
      />

      <View
        style={{
          // height: windowHeight / 1.2,
          flex: 1,
        }}>
        <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
          {/* Salon Card */}
          <View style={styles.salonCard}>
            <Text style={styles.salonName}>Glamour Touch Salon</Text>
            <Text style={styles.salonSubtitle}>Luxury salon services</Text>
          </View>

          {/* Date Selector */}

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
              const todayStr = now.toISOString().split('T')[0]; // "YYYY-MM-DD"

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

          {/*  */}

          {/* <Text style={styles.sectionTitle}>Choose Date & Time</Text> */}
          {/* <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dateRow}>
            {dates.map(d => (
              <TouchableOpacity
                key={d.day}
                style={[
                  styles.dateBox,
                  selectedDate === d.day && styles.selectedDateBox,
                ]}
                onPress={() => setSelectedDate(d.day)}>
                <Text
                  style={[
                    styles.dateDay,
                    selectedDate === d.day && styles.selectedDateText,
                  ]}>
                  {d.day}
                </Text>
                <Text
                  style={[
                    styles.dateLabel,
                    selectedDate === d.day && styles.selectedDateText,
                  ]}>
                  {d.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView> */}

          {/* Time Selector */}
          <Text style={styles.sectionTitle}>Choose Time</Text>
          <View style={styles.timeGrid}>
            {times.map(time => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeBox,
                  selectedTime === time && styles.selectedTimeBox,
                ]}
                onPress={() => setSelectedTime(time)}>
                <Text
                  style={[
                    styles.timeText,
                    selectedTime === time && styles.selectedTimeText,
                  ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Choose Offer Button */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('OffersScreen');
            }}
            style={styles.offerBtn}>
            <View style={{flexDirection:"row",alignItems:"center"}}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/128/726/726476.png',
                }}
                style={styles.offerIcon}
              />
              <Text style={styles.offerText}>Choose Offer</Text>
            </View>

            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/2985/2985179.png',
              }}
              style={[
                styles.offerIcon,
                {marginRight: 0},
              ]}
            />
          </TouchableOpacity>

          {/* Price Breakdown */}

          <View style={styles.billContainer}>
            <Text style={styles.billTitle}>Bill Details</Text>

            {/* Show each selected service */}
            {selectedItems.map(item => (
              <View key={item.id} style={styles.billRow}>
                <Text style={styles.billLabel}>{item.name}</Text>
                <Text style={styles.billValue}>${item.price.toFixed(2)}</Text>
              </View>
            ))}

            {/* Subtotal */}
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Subtotal</Text>
              <Text style={styles.billValue}>${subtotal.toFixed(2)}</Text>
            </View>

            {/* Tax */}
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Taxes (10%)</Text>
              <Text style={styles.billValue}>${tax.toFixed(2)}</Text>
            </View>

            {/* Platform Fee */}
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Platform Fee</Text>
              <Text style={styles.billValue}>${platformFee.toFixed(2)}</Text>
            </View>

            {/* Total */}
            <View style={styles.billRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>

          {/* Add Note */}
          <View style={styles.noteContainer}>
            <Text style={styles.noteLabel}>Request / Add Note</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="Type your request here..."
              multiline
              value={note}
              onChangeText={setNote}
            />
          </View>

          {/* Book Now Button */}
          <CustomButton
            title="Book Now"
            style={{width: '94%', marginBottom: 20}}
            onPress={() => {
              // Checkout
              navigation.navigate('BookingConfirmation', {
                selectedServices,
                total,
                note,
              });
            }}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default BookingScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},

  salonCard: {
    backgroundColor: COLOR.primary,
    padding: 15,
    borderRadius: 8,
    margin: 15,
  },
  salonName: {color: '#fff', fontSize: 16, fontWeight: '600'},
  salonSubtitle: {color: '#eee', fontSize: 14},

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 5,
  },

  dateRow: {paddingHorizontal: 15},
  dateBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  selectedDateBox: {backgroundColor: COLOR.primary},
  dateDay: {fontSize: 16, fontWeight: '600', color: '#333'},
  dateLabel: {fontSize: 12, color: '#666'},
  selectedDateText: {color: '#fff'},

  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    marginBottom: 20,
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
    width: windowWidth / 4.82,
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
    marginHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    justifyContent: 'space-between',
  },
  offerIcon: {width: 24, height: 24, marginRight: 10},
  offerText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLOR.primary,
    // width: windowWidth / 1.2,
  },

  billContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    margin: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
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

  noteContainer: {
    marginHorizontal: 15,
    marginBottom: 15,
  },
  noteLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
    textAlignVertical: 'top',
  },
});
