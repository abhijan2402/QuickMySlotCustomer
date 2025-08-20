import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import HomeHeader from '../../../Components/HomeHeader';
import {COLOR} from '../../../Constants/Colors';

const AppointmentDetail = ({route, navigation}) => {
  // Dummy Data (Replace with route.params or API)
  const appointment = route?.params?.appointment || {
    id: '1',
    shopName: 'Glamour Touch Salon',
    shopImage:
      'https://www.theparkhotels.com/images/site-specific/indore/aura-spa/spa-1.jpg', // shop banner
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
        contentContainerStyle={{paddingHorizontal: 15, paddingBottom: 30}}>
        {/* Shop Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Shop Details</Text>
          <Image source={{uri: appointment.shopImage}} style={styles.shopImg} />
          <Text style={styles.shopName}>{appointment.shopName}</Text>
          <Text style={styles.text}>{appointment.shopAddress}</Text>
          <Text style={styles.text}>📞 {appointment.shopContact}</Text>
          <TouchableOpacity style={styles.chatBtn}>
            <Text style={styles.chatBtnText}>💬 Chat</Text>
          </TouchableOpacity>
        </View>

        {/* Customer Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Customer Details</Text>
          <Text style={styles.text}>👤 {appointment.customerName}</Text>
          <Text style={styles.text}>📞 {appointment.customerPhone}</Text>
          <Text style={styles.text}>📍 {appointment.customerAddress}</Text>
        </View>

        {/* Service Date/Time */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Service Schedule</Text>
          <Text style={styles.text}>📅 {appointment.date}</Text>
          <Text style={styles.text}>⏰ {appointment.time}</Text>
        </View>

        {/* Services Breakdown */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Services</Text>
          {appointment.services.map((service, index) => (
            <View key={index} style={styles.serviceRow}>
              <Text style={styles.text}>{service.name}</Text>
              <Text style={styles.text}>₹{service.price}</Text>
            </View>
          ))}
        </View>

        {/* Price Details */}
        <View style={styles.priceCard}>
          <Text style={styles.priceTitle}>Price Details</Text>
          <View style={styles.serviceRow}>
            <Text style={styles.text}>Sub Total</Text>
            <Text style={styles.text}>₹{appointment.subTotal}</Text>
          </View>
          <View style={styles.serviceRow}>
            <Text style={styles.text}>Taxes (GST)</Text>
            <Text style={styles.text}>₹{appointment.tax}</Text>
          </View>
          <View style={styles.serviceRow}>
            <Text style={styles.text}>Discount</Text>
            <Text style={styles.text}>-₹{appointment.discount}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.serviceRow}>
            <Text style={styles.grandTotal}>Grand Total</Text>
            <Text style={styles.grandTotal}>₹{appointment.total}</Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <Text style={styles.text}>💳 {appointment.paymentMethod}</Text>
        </View>

        {/* Cancel Button */}
        <TouchableOpacity style={styles.cancelBtn}>
          <Text style={styles.cancelBtnText}>Cancel Appointment</Text>
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
  },
  card: {
    backgroundColor: COLOR.white,
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
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
    backgroundColor: '#E53935',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
  },
  cancelBtnText: {
    color: COLOR.white,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 15,
  },
});
