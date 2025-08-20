import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import HomeHeader from '../../../Components/HomeHeader';
import {COLOR} from '../../../Constants/Colors';

const Appointment = ({navigation}) => {
  const [selectedFilter, setSelectedFilter] = useState('All');

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

  const renderAppointment = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('AppointmentDetail');
        }}
        style={styles.card}>
        {/* Image + Info */}
        <View style={styles.row}>
          <Image source={{uri: item.image}} style={styles.serviceImage} />
          <View style={{flex: 1, marginLeft: 10}}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={[styles.status, {color: getStatusColor(item.status)}]}>
              {item.status}
            </Text>
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Shop Details */}
        <View style={{marginTop: 5}}>
          <Text style={styles.salonName}>{item.salon}</Text>
          <Text style={styles.salonService}>{item.service}</Text>
          <Text style={styles.details}>📍 {item.address}</Text>
          <Text style={styles.details}>📞 {item.contact}</Text>
          <Text style={styles.amount}>💰 {item.amount}</Text>
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

      {/* Filters */}
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
              <Text
                style={[
                  styles.filterText,
                  {color: isSelected ? COLOR.white : COLOR.black},
                ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Appointments List */}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={appointments}
        keyExtractor={item => item.id}
        renderItem={renderAppointment}
        contentContainerStyle={{paddingBottom: 20}}
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
    fontWeight: '500',
  },
  card: {
    backgroundColor: COLOR.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceImage: {
    width: 55,
    height: 55,
    borderRadius: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: COLOR.black,
  },
  status: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginVertical: 8,
  },
  salonName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLOR.black,
  },
  salonService: {
    fontSize: 12,
    color: '#777',
    marginBottom: 4,
  },
  details: {
    fontSize: 12,
    color: '#555',
    marginBottom: 2,
  },
  amount: {
    fontSize: 13,
    fontWeight: '600',
    color: COLOR.primary,
    marginTop: 4,
  },
});
