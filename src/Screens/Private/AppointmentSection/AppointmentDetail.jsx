import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
} from 'react-native';
import HomeHeader from '../../../Components/HomeHeader';
import { COLOR } from '../../../Constants/Colors';
import { handleCall, handleOpenMap } from '../../../Constants/Utils';
import { Typography } from '../../../Components/UI/Typography';
import ConfirmModal from '../../../Components/UI/ConfirmModel';
import Button from '../../../Components/UI/Button';
import { Font } from '../../../Constants/Font';
import { useIsFocused } from '@react-navigation/native';
import { GET_WITH_TOKEN, POST_WITH_TOKEN } from '../../../Backend/Api';
import { CANCEL_BOOKING, GET_BOOKING_DETAILS } from '../../../Constants/ApiRoute';
import { images } from '../../../Components/UI/images';
import moment from 'moment';
import { cleanImageUrl } from '../../../Backend/Utility';

const AppointmentDetail = ({ route, navigation }) => {
  const [cancelAppointment, setCancelAppointment] = useState(false);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(false);
  // console.log(data, 'data--->');

  const id = route?.params?.appointment?.id || '';
  useEffect(() => {
    if (isFocused) {
      getBookingList();
    }
  }, [isFocused]);

  const getBookingList = () => {
    setLoading(true);
    GET_WITH_TOKEN(
      GET_BOOKING_DETAILS + id,
      success => {
        console.log(success?.data, 'booking details');
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
      CANCEL_BOOKING + id,
      success => {
        console.log(success);
        setLoading(false);
      },
      error => {
        setLoading(false);
        console.log(error);
        setCancelAppointment(false);
        navigation.goBack();
      },
      fail => {
        setLoading(false);
        console.log(fail);
      },
    );
  };

  const [time, date] = Object.entries(data?.schedule_time ?? {})[0] || [];
  const dateKeys =
    Object.values(
      data?.schedule_time || route?.params?.appointment?.schedule_time || {},
    )[0]

  const timeKeys = Object.keys(
    data?.schedule_time || route?.params?.appointment?.schedule_time,
  );
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
      { name: 'Haircut', price: 400 },
      { name: 'Hair Wash', price: 200 },
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
        contentContainerStyle={{ paddingHorizontal: 5, paddingBottom: 10 }}>
        {/* Shop Info */}
        <View style={styles.card}>
          <Typography style={styles.sectionTitle}>Shop Details</Typography>
          <Image
            source={{
              uri:
                cleanImageUrl(data?.vendor?.portfolio_images[0]?.image_url) ||
                cleanImageUrl(data?.service?.image),
            }}
            style={styles.shopImg}
          />
          <Typography style={styles.shopName}>{data?.vendor?.business_name}</Typography>
          <TouchableOpacity onPress={() => handleOpenMap('')}>
            <View style={styles.infoRow}>
              <Image
                source={images.mark}
                style={{ height: 16, width: 16, marginTop: 5 }}
              />
              <Typography style={styles.details} numberOfLines={2}>
                {data.vendor?.exact_location || 'Address not available'}
              </Typography>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleCall('9876367898')}>
            <View style={styles.infoRow}>
              <Image
                source={images.call}
                style={{ height: 16, width: 16 }}
              />
              <Typography style={styles.details} numberOfLines={2}>
                {data.vendor?.phone_number || 'Address not available'}
              </Typography>
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.chatBtn}>
            <Typography style={styles.chatBtnText}>💬 Chat</Typography>
          </TouchableOpacity>
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
          /> */}
        </View>

        {/* Customer Info */}
        <View style={styles.card}>
          <Typography style={styles.sectionTitle}>Customer Details</Typography>
          <Typography style={styles.text}>👤 {data?.customer?.name}</Typography>
          <TouchableOpacity onPress={() => handleCall('9876367898')}>
            <View style={styles.infoRow}>
              <Image
                source={images.call}
                style={{ height: 16, width: 16 }}
              />
              <Typography style={styles.details} numberOfLines={2}>
                {data.vendor?.phone_number || 'Address not available'}
              </Typography>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOpenMap('')}>
            <View style={styles.infoRow}>
              <Image
                source={images.mark}
                style={{ height: 16, width: 16, marginTop: 5 }}
              />
              <Typography style={styles.details} numberOfLines={2}>
                {data?.customer?.address || 'Address not available'}
              </Typography>
            </View>
          </TouchableOpacity>
        </View>

        {/* Service Date/Time */}
        <View style={styles.card}>
          <Typography style={styles.sectionTitle}>Service Schedule</Typography>
          <Typography style={[styles.text, { marginTop: 5 }]}>
            📅 {moment(dateKeys).format("DD MMM, YYYY")}
          </Typography>
          <Typography style={[styles.text, { marginTop: 5 }]}>
            ⏰{' '}
            {timeKeys?.map((v, index) => {
              return (
                moment(v, 'HH:mm').format('hh:mm A') +
                (index == timeKeys?.length - 1 ? '' : ', ')
              );
            })}
          </Typography>
        </View>

        {/* Services Breakdown */}
        <View style={styles.card}>
          <Typography style={styles.sectionTitle}>Services</Typography>

          {Array.isArray(data?.services) && (
            data.services.map((service, index) => (
              <View key={index} style={styles.serviceRow}>
                <Typography style={styles.text}>{service?.name}</Typography>
                <Typography style={styles.text}>₹{service?.price}</Typography>
              </View>
            ))
          )}

          {data?.note ? <Typography style={{ borderTopWidth: 1, borderTopColor: COLOR.primary }}>Note: {data.note}</Typography> : null}
        </View>


        {/* Price Details */}
        <View style={styles.priceCard}>
          <Typography style={styles.priceTitle}>Price Details</Typography>
          <View style={styles.serviceRow}>
            <Typography style={styles.text}>Sub Total</Typography>
            <Typography style={styles.text}>₹{data?.calculation_breakdown?.subtotal}</Typography>
          </View>

          {
            data?.gst_amount != "0.00" &&
            <View style={styles.serviceRow}>
              <Typography style={styles.text}>Taxes (GST)</Typography>
              <Typography style={styles.text}>₹{data?.tax}</Typography>
            </View>
          }
          <View style={styles.serviceRow}>
            <Typography style={styles.text}>Convenience fee</Typography>
            <Typography style={styles.text}>₹{data?.convenience_fee}</Typography>
          </View>
          <View style={styles.serviceRow}>
            <Typography style={styles.text}>Platform Fee</Typography>
            <Typography style={styles.text}>₹{data?.calculation_breakdown?.platform_fee}</Typography>
          </View>
          <View style={styles.divider} />
          <View style={styles.serviceRow}>
            <Typography style={styles.grandTotal}>Grand Total</Typography>
            <Typography style={styles.grandTotal}>₹{data?.final_amount}</Typography>
          </View>
        </View>

        {/* Payment Method */}
        {/* <View style={styles.card}>
          <Typography style={styles.sectionTitle}>Payment Method</Typography>
          <Typography style={styles.text}>
            💳 {appointment.paymentMethod}
          </Typography>
        </View> */}

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

        <Button
          onPress={() => Linking.openURL(data?.invoice_pdf)}
          title={'Download Invoice'}
          titleColor={COLOR.white}
          containerStyle={{
            borderWidth: 1,
            borderColor: COLOR.red,
            backgroundColor: COLOR.primary,
            marginTop: 10,
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
    shadowOffset: { width: 0, height: 1 },
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
    backgroundColor: '#f0f0f0',
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
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  details: {
    fontSize: 13,
    flexShrink: 1,
    marginLeft: 10,
    marginTop: 2,
    fontFamily: Font.medium,
  },
});
