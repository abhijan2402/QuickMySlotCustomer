import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import HomeHeader from '../../../Components/HomeHeader';
import {COLOR} from '../../../Constants/Colors';
import {handleCall, handleOpenMap} from '../../../Constants/Utils';
import {Typography} from '../../../Components/UI/Typography';
import ConfirmModal from '../../../Components/UI/ConfirmModel';
import Button from '../../../Components/UI/Button';
import {Font} from '../../../Constants/Font';
import {useIsFocused} from '@react-navigation/native';
import {GET_WITH_TOKEN, POST_WITH_TOKEN} from '../../../Backend/Api';
import {CANCEL_BOOKING, GET_BOOKING_DETAILS} from '../../../Constants/ApiRoute';

const AppointmentDetail = ({route, navigation}) => {
  const [cancelAppointment, setCancelAppointment] = useState(false);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(false);

  useEffect(() => {
    if (isFocused) {
      getBookingList();
    }
  }, [isFocused]);

  const getBookingList = () => {
    setLoading(true);
    GET_WITH_TOKEN(
      GET_BOOKING_DETAILS + 27,
      success => {
        console.log(success);
        setData(success?.data);
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

    const CancelBooking = () => {
    setLoading(true);
    POST_WITH_TOKEN(
      CANCEL_BOOKING + 27,
      success => {
        console.log(success);
        setLoading(false);
      },
      error => {
        setLoading(false);
        console.log(error);
         setCancelAppointment(false)
        navigation.goBack()
      },
      fail => {
        setLoading(false);
        console.log(fail);
      },
    );
  };

const [time, date] = Object.entries(data?.schedule_time ?? {})[0] || [];
  const amount = Number(data?.amount) || 0;
  const tax = Number(data?.tax) || 0;
  const platformFee = Number(data?.platform_fee) || 0;
  const grandTotal = amount + tax + platformFee;

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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 5, paddingBottom: 10}}>
        {/* Shop Info */}
        <View style={styles.card}>
          <Typography style={styles.sectionTitle}>Shop Details</Typography>
          <Image source={{uri: data?.vendor?.image}} style={styles.shopImg} />
          <Typography style={styles.shopName}>
            {data?.vendor?.business_name}
          </Typography>
          <TouchableOpacity onPress={() => handleOpenMap('')}>
            <Typography style={[styles.text, {marginTop: 3}]}>
              📍{data?.vendor?.address}
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleCall('9876367898')}>
            <Typography style={[styles.text, {marginTop: 5}]}>
              📞 +91 {data?.vendor?.phone_number}
            </Typography>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.chatBtn}>
            <Typography style={styles.chatBtnText}>💬 Chat</Typography>
          </TouchableOpacity> */}
          <Button
            title={'Chat'}
            containerStyle={{
              height: 45,
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: COLOR.primary,
              marginTop: 10,
              marginBottom: 0,
            }}
            titleColor={COLOR.primary}
          />
        </View>

        {/* Customer Info */}
        <View style={styles.card}>
          <Typography style={styles.sectionTitle}>Customer Details</Typography>
          <Typography style={styles.text}>👤 {data?.customer?.name}</Typography>
          <TouchableOpacity onPress={() => handleCall('9876367898')}>
            <Typography style={[styles.text, {marginTop: 5}]}>
              📞 +91 {data?.customer?.phone_number}
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOpenMap('')}>
            <Typography style={[styles.text, {marginTop: 5}]}>
              📍 {data?.customer?.address}
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Service Date/Time */}
        <View style={styles.card}>
          <Typography style={styles.sectionTitle}>Service Schedule</Typography>
          <Typography style={[styles.text, {marginTop: 5}]}>
            📅 {date}
          </Typography>
          <Typography style={[styles.text, {marginTop: 5}]}>
            ⏰ {time}
          </Typography>
        </View>

        {/* Services Breakdown */}
        <View style={styles.card}>
          <Typography style={styles.sectionTitle}>Services</Typography>
          {/* {appointment.services.map((service, index) => ( */}
            <View style={styles.serviceRow}>
              <Typography style={styles.text}>{data?.service?.name}</Typography>
              <Typography style={styles.text}>₹{data?.service?.price}</Typography>
            </View>
          {/* ))} */}
        </View>

        {/* Price Details */}
        <View style={styles.priceCard}>
          <Typography style={styles.priceTitle}>Price Details</Typography>
          <View style={styles.serviceRow}>
            <Typography style={styles.text}>Sub Total</Typography>
            <Typography style={styles.text}>₹{data?.amount}</Typography>
          </View>
          <View style={styles.serviceRow}>
            <Typography style={styles.text}>Taxes (GST)</Typography>
            <Typography style={styles.text}>₹{data?.tax}</Typography>
          </View>
          <View style={styles.serviceRow}>
            <Typography style={styles.text}>Platform Fee</Typography>
            <Typography style={styles.text}>₹{data.platform_fee}</Typography>
          </View>
          <View style={styles.divider} />
          <View style={styles.serviceRow}>
            <Typography style={styles.grandTotal}>Grand Total</Typography>
            <Typography style={styles.grandTotal}>₹{grandTotal}</Typography>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.card}>
          <Typography style={styles.sectionTitle}>Payment Method</Typography>
          <Typography style={styles.text}>
            💳 {appointment.paymentMethod}
          </Typography>
        </View>

        {/* Cancel Button */}

        <Button
          onPress={() => setCancelAppointment(true)}
          title={'Cancel Appointment'}
          titleColor={COLOR.red}
          containerStyle={{
            borderWidth: 1,
            borderColor: COLOR.red,
            backgroundColor: 'white',
            marginTop: 20,
          }}
        />
      </ScrollView>
      <ConfirmModal
        visible={cancelAppointment}
        close={() => setCancelAppointment(false)}
        title="Cancel Appointment"
        description="Are you sure you want to Cancel Appointment?"
        yesTitle="Yes"
        noTitle="No"
        onPressYes={() => CancelBooking()}
        onPressNo={() => setCancelAppointment(false)}
      />
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
    marginTop: 10,
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
    fontFamily: Font.bold,
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
    fontFamily: Font.semibold,
    color: COLOR.black,
    marginBottom: 3,
  },
  text: {
    fontSize: 13,
    fontFamily: Font.semibold,
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
    fontFamily: Font.medium,
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
    backgroundColor: 'rgba(121, 111, 195, 0.08)',
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(121, 111, 195, 0.3)',
  },

  priceTitle: {
    fontSize: 15,
    marginBottom: 8,
    color: COLOR.primary,
    fontFamily: Font.medium,
  },
  grandTotal: {
    fontSize: 15,
    color: COLOR.primary,
    fontFamily: Font.medium,
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
    fontFamily: Font.medium,
    fontSize: 15,
  },
});
