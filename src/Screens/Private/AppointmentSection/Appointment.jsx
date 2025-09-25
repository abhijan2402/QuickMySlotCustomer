import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import HomeHeader from '../../../Components/HomeHeader';
import {COLOR} from '../../../Constants/Colors';
import {Typography} from '../../../Components/UI/Typography';
import {images} from '../../../Components/UI/images';
import {windowHeight} from '../../../Constants/Dimensions';
import {Font} from '../../../Constants/Font';
import {useIsFocused} from '@react-navigation/native';
import {GET_WITH_TOKEN} from '../../../Backend/Api';
import {GET_BOOKING_LIST} from '../../../Constants/ApiRoute';

const Appointment = ({navigation}) => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isFocused) {
      getBookingList();
    }
  }, [isFocused]);

  const getBookingList = () => {
    setLoading(true);
    GET_WITH_TOKEN(
      GET_BOOKING_LIST,
      success => {
        console.log(success);

        setLoading(false);
      },
      error => {
        setLoading(false);
        console.log(success);
      },
      fail => {
        setLoading(false);
        console.log(fail);
      },
    );
  };

  const filters = [
    {label: 'All'},
    {label: 'Pending'},
    {label: 'Completed'},
    {label: 'Declined'},
  ];

  const appointments = [
    {
      id: '1',
      title: 'Haircut',
      date: 'June 10, 2025, 2 PM',
      status: 'Pending',
      salon: 'Glamour Touch Salon',
      service: 'Luxury salon services',
      image:
        'https://im.whatshot.in/img/2019/May/shutterstock-653296774-cropped-1-1557311742.jpg',
      address: '123 Main Street, New Delhi',
      contact: '+91 9876543210',
      amount: '₹500',
    },
    {
      id: '2',
      title: 'Facial',
      date: 'June 11, 2025, 4 PM',
      status: 'Completed',
      salon: 'Elite Spa Center',
      service: 'Premium facial treatment',
      image:
        'https://www.architectmagazine.com/wp-content/uploads/sites/5/2020/95ad8aa6ba5c41399fbca1f1458e7ff1.jpg',
      address: '56 Park Lane, Mumbai',
      contact: '+91 9123456780',
      amount: '₹1200',
    },
    {
      id: '3',
      title: 'Massage',
      date: 'June 12, 2025, 6 PM',
      status: 'Declined',
      salon: 'Relax & Heal',
      service: 'Full body massage therapy',
      image:
        'https://jaipurspacenter.in/wp-content/uploads/2024/12/Spa-in-Vishwakarma-Industrial-Area-Jaipur.jpg',
      address: '88 Wellness Road, Bangalore',
      contact: '+91 9988776655',
      amount: '₹1500',
    },
  ];

  const getStatusColor = status => {
    switch (status) {
      case 'Pending':
        return '#FFD700';
      case 'Completed':
        return '#4CAF50';
      case 'Declined':
        return '#E53935';
      default:
        return '#555';
    }
  };

  const getBackgroundStatusColor = status => {
    switch (status) {
      case 'Pending':
        return '#FFD700';
      case 'Completed':
        return '#4CAF50';
      case 'Declined':
        return '#E53935';
      default:
        return '#555';
    }
  };

  const renderAppointment = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('AppointmentDetail')}
        style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.leftSection}>
            <Image source={{uri: item.image}} style={styles.serviceImage} />
            <View style={{marginLeft: 12, flex: 1}}>
              <Typography
                font={Font.medium}
                style={styles.title}
                numberOfLines={1}>
                {item.title}
              </Typography>
              <Typography style={styles.salonName}>{item.salon}</Typography>
            </View>
          </View>
          <Typography
            style={[
              styles.status,
              {
                color: getStatusColor(item.status),
                backgroundColor: getBackgroundStatusColor(item.status) + '25',
              },
            ]}>
            {item.status}
          </Typography>
        </View>

        <View style={styles.divider} />
        <View style={styles.bottomRow}>
          <Typography style={styles.salonService}>{item.service}</Typography>
          <Typography style={styles.amount}>{item.amount}</Typography>
        </View>
        <View style={styles.infoRow}>
          <Image source={images.calendar} style={{height: 16, width: 16}} />
          <Typography style={styles.dateText}>{item.date}</Typography>
        </View>
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Image source={images.mark} style={{height: 16, width: 16}} />
            <Typography style={styles.details} numberOfLines={1}>
              {item.address}
            </Typography>
          </View>

          <View style={styles.infoRow}>
            <Image source={images.call} style={{height: 14, width: 14}} />
            <Typography style={styles.details}>{item.contact}</Typography>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <HomeHeader
        title="My Appointments"
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.black}
      />
      <View></View>

      <View style={styles.filterRow}>
        {filters.map(filter => {
          const isSelected = selectedFilter === filter.label;
          return (
            <TouchableOpacity
              key={filter.label}
              style={[
                styles.filterButton,
                {
                  backgroundColor: isSelected ? COLOR.primary : COLOR.white,
                  borderColor: isSelected ? COLOR.primary : '#ddd',
                },
              ]}
              onPress={() => setSelectedFilter(filter.label)}>
              <Typography
                style={[
                  styles.filterText,
                  {color: isSelected ? COLOR.white : COLOR.black},
                ]}>
                {filter.label}
              </Typography>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={appointments}
        keyExtractor={item => item.id}
        renderItem={renderAppointment}
        contentContainerStyle={{paddingBottom: 20}}
        ListEmptyComponent={() => {
          return (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: windowHeight * 0.3,
              }}>
              <Image source={images.noData} />
              <Typography size={20} fontWeight={'500'} style={{marginTop: 10}}>
                No Appointments found
              </Typography>
            </View>
          );
        }}
      />
    </View>
  );
};

export default Appointment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
    paddingHorizontal: 15,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 13,
    fontFamily: Font.semibold,
  },
  card: {
    backgroundColor: COLOR.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#f2f2f2',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceImage: {
    width: 55,
    height: 55,
    borderRadius: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: Font.bold,
    color: COLOR.black,
  },
  salonName: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  status: {
    fontSize: 12,
    fontFamily: Font.semibold,
    paddingVertical: 3,
    paddingHorizontal: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  dateText: {
    fontSize: 13,
    fontFamily: Font.semibold,

    color: '#444',
    marginLeft: 10,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginVertical: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  salonService: {
    fontSize: 13,
    color: '#666',
    fontFamily: Font.semibold,
  },
  infoSection: {
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    fontSize: 13,
    marginRight: 6,
  },
  details: {
    fontSize: 13,
    color: '#555',
    flexShrink: 1,
    marginLeft: 10,
    marginTop: 2,
    fontFamily: Font.medium,
  },
  amount: {
    fontSize: 15,
    // fontWeight: '700',
    color: COLOR.primary,
    fontFamily: Font.semibold,
  },
});
