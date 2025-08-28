import React, {useState} from 'react';
import {
  View,
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
import {Typography} from '../../../Components/UI/Typography';

const BookingScreen = ({navigation}) => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(27);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [note, setNote] = useState('');
  const [selectTime, setSelectTime] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [dateStart, setDateStart] = useState(null);

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
      } else {
        alert('You can select up to 3 time slots only');
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
      <HomeHeader
        title="Available Services"
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.primary}
        onLeftPress={() => navigation.goBack()}
      />

      <View style={{flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1,marginHorizontal:5}}>
          {/* Salon Card */}
          <View style={styles.salonCard}>
            <Typography style={styles.salonName}>
              Glamour Touch Salon
            </Typography>
            <Typography style={styles.salonSubtitle}>
              Luxury salon services
            </Typography>
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
          <Typography size={16} style={{ marginBottom: 10}}>
            You can select up-to 3 time slots
          </Typography>

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
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/128/726/726476.png',
                }}
                style={styles.offerIcon}
              />
              <Typography style={styles.offerText}>Choose Offer</Typography>
            </View>

            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/2985/2985179.png',
              }}
              style={[styles.offerIcon, {marginRight: 0}]}
            />
          </TouchableOpacity>

          {/* Price Breakdown */}
          <View style={styles.billContainer}>
            <Typography style={styles.billTitle}>Bill Details</Typography>

            {selectedItems.map(item => (
              <View key={item.id} style={styles.billRow}>
                <Typography style={styles.billLabel}>{item.name}</Typography>
                <Typography style={styles.billValue}>
                  ${item.price.toFixed(2)}
                </Typography>
              </View>
            ))}

            <View style={styles.billRow}>
              <Typography style={styles.billLabel}>Subtotal</Typography>
              <Typography style={styles.billValue}>
                ${subtotal.toFixed(2)}
              </Typography>
            </View>

            <View style={styles.billRow}>
              <Typography style={styles.billLabel}>Taxes (10%)</Typography>
              <Typography style={styles.billValue}>
                ${tax.toFixed(2)}
              </Typography>
            </View>

            <View style={styles.billRow}>
              <Typography style={styles.billLabel}>Platform Fee</Typography>
              <Typography style={styles.billValue}>
                ${platformFee.toFixed(2)}
              </Typography>
            </View>

            <View style={styles.billRow}>
              <Typography style={styles.totalLabel}>Total</Typography>
              <Typography style={styles.totalValue}>
                ${total.toFixed(2)}
              </Typography>
            </View>
          </View>

          {/* Add Note */}
          <View style={styles.noteContainer}>
            <Typography style={styles.noteLabel}>Request / Add Note</Typography>
            <TextInput
              style={styles.noteInput}
              placeholder="Type your request here..."
              multiline
              value={note}
              onChangeText={setNote}
            />
          </View>

          {/* Book Now */}
          <CustomButton
            title="Book Now"
            style={{width: '100%', marginBottom: 10,marginTop:10}}
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
      </View>
    </View>
  );
};

export default BookingScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', paddingHorizontal: 15},
  salonCard: {
    backgroundColor: COLOR.primary,
    padding: 15,
    borderRadius: 8,
    marginTop:10
  },
  salonName: {color: '#fff', fontSize: 16, fontWeight: '600'},
  salonSubtitle: {color: '#eee', fontSize: 14},
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
    width: windowWidth / 4.92,
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
    margin:1
  },
  offerIcon: {width: 24, height: 24, marginRight: 10},
  offerText: {fontSize: 15, fontWeight: '600', color: COLOR.primary},
  billContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
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
  noteContainer: { marginBottom: 15},
  noteLabel: {fontSize: 15, fontWeight: '600', marginBottom: 6,marginTop:20},
  noteInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    minHeight: 60,
    textAlignVertical: 'top',
    
  },
});
