import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import HomeHeader from '../../../Components/HomeHeader';
import {COLOR} from '../../../Constants/Colors';
import { handleCall, handleOpenMap } from '../../../Constants/Utils';
import { Typography } from '../../../Components/UI/Typography';

const AppointmentDetail = ({route, navigation}) => {
  const appointment = route?.params?.appointment || {
    id: '1',
    shopName: 'Glamour Touch Salon',
    shopImage:
      'https://www.theparkhotels.com/images/site-specific/indore/aura-spa/spa-1.jpg',
    shopAddress: '123 Main Street, New Delhi',
    shopContact: '+91 9876543210',
    customerName: 'Abhishek Sharma',
    customerPhone: '+91 9123456780',
    customerAddress: 'B-42, Patel Nagar, New Delhi',
    date: 'June 20, 2025',
    time: '2:00 PM',
    services: [
      {name: 'Haircut', price: 400},
      {name: 'Hair Wash', price: 200},
    ],
    subTotal: 600,
    tax: 60,
    discount: 50,
    total: 610,
    paymentMethod: 'UPI (Google Pay)',
  };

  return (
    <View style={styles.container}>
      <HomeHeader
        title="Appointment Detail"
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.black}
      />
      <ScrollView
        contentContainerStyle={{paddingHorizontal: 5, paddingBottom: 10}}>
        
        {/* Shop Info */}
        <View style={styles.card}>
          <Typography style={styles.sectionTitle}>Shop Details</Typography>
          <Image source={{uri: appointment.shopImage}} style={styles.shopImg} />
          <Typography style={styles.shopName}>{appointment.shopName}</Typography>
          <TouchableOpacity onPress={() => handleOpenMap('')}>
            <Typography style={styles.text}>{appointment.shopAddress}</Typography>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleCall('9876567898')}>
            <Typography style={styles.text}>📞 {appointment.shopContact}</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chatBtn}>
            <Typography style={styles.chatBtnText}>💬 Chat</Typography>
          </TouchableOpacity>
        </View>

        {/* Customer Info */}
        <View style={styles.card}>
          <Typography style={styles.sectionTitle}>Customer Details</Typography>
          <Typography style={styles.text}>👤 {appointment.customerName}</Typography>
          <TouchableOpacity>
            <Typography style={styles.text}>📞 {appointment.customerPhone}</Typography>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOpenMap('')}>
            <Typography style={styles.text}>📍 {appointment.customerAddress}</Typography>
          </TouchableOpacity>
        </View>

        {/* Service Date/Time */}
        <View style={styles.card}>
          <Typography style={styles.sectionTitle}>Service Schedule</Typography>
          <Typography style={styles.text}>📅 {appointment.date}</Typography>
          <Typography style={styles.text}>⏰ {appointment.time}</Typography>
        </View>

        {/* Services Breakdown */}
        <View style={styles.card}>
          <Typography style={styles.sectionTitle}>Services</Typography>
          {appointment.services.map((service, index) => (
            <View key={index} style={styles.serviceRow}>
              <Typography style={styles.text}>{service.name}</Typography>
              <Typography style={styles.text}>₹{service.price}</Typography>
            </View>
          ))}
        </View>

        {/* Price Details */}
        <View style={styles.priceCard}>
          <Typography style={styles.priceTitle}>Price Details</Typography>
          <View style={styles.serviceRow}>
            <Typography style={styles.text}>Sub Total</Typography>
            <Typography style={styles.text}>₹{appointment.subTotal}</Typography>
          </View>
          <View style={styles.serviceRow}>
            <Typography style={styles.text}>Taxes (GST)</Typography>
            <Typography style={styles.text}>₹{appointment.tax}</Typography>
          </View>
          <View style={styles.serviceRow}>
            <Typography style={styles.text}>Discount</Typography>
            <Typography style={styles.text}>-₹{appointment.discount}</Typography>
          </View>
          <View style={styles.divider} />
          <View style={styles.serviceRow}>
            <Typography style={styles.grandTotal}>Grand Total</Typography>
            <Typography style={styles.grandTotal}>₹{appointment.total}</Typography>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.card}>
          <Typography style={styles.sectionTitle}>Payment Method</Typography>
          <Typography style={styles.text}>💳 {appointment.paymentMethod}</Typography>
        </View>

        {/* Cancel Button */}
        <TouchableOpacity style={styles.cancelBtn}>
          <Typography style={styles.cancelBtnText}>Cancel Appointment</Typography>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default AppointmentDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: COLOR.white,
    borderRadius: 10,
    padding: 15,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
    color: COLOR.primary,
  },
  shopImg: {
    width: '100%',
    height: 140,
    borderRadius: 8,
    marginBottom: 8,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLOR.black,
    marginBottom: 3,
  },
  text: {
    fontSize: 13,
    color: '#444',
    marginBottom: 3,
  },
  chatBtn: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: COLOR.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  chatBtnText: {
    color: COLOR.white,
    fontWeight: '600',
    fontSize: 13,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    marginVertical: 6,
  },
  priceCard: {
    backgroundColor: '#F5F9FF',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#B3D4FF',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 3,
    elevation: 3,
  },
  priceTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1E3A8A',
  },
  grandTotal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  cancelBtn: {
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'red',
  },
  cancelBtnText: {
    color: COLOR.red,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 15,
  },
});
