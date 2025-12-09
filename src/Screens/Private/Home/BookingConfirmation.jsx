import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { COLOR } from '../../../Constants/Colors';
import HomeHeader from '../../../Components/HomeHeader';
import { Typography } from '../../../Components/UI/Typography';
import Button from '../../../Components/UI/Button';
import { images } from '../../../Components/UI/images';
import ConfirmModal from '../../../Components/UI/ConfirmModel';
import { handleCall, openMapWithDirections } from '../../../Constants/Utils';
import moment from 'moment';
import {
  cleanImageUrl,
  getShopStatusMessage,
  isShopOpen,
  ToastMsg,
} from '../../../Backend/Utility';
import { Font } from '../../../Constants/Font';
import { CANCEL_BOOKING, GET_BOOKING_DETAILS } from '../../../Constants/ApiRoute';
import { POST_WITH_TOKEN } from '../../../Backend/Api';

const BookingConfirmation = ({ navigation, route }) => {
  const [cancelBooking, setCancelBooking] = useState(false);
  const data = route?.params?.data;
  // console.log('ABBBBB', data?.bookingData?.data?.booking?.id);
  const [shopStatus, setShopStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelAppointment, setCancelAppointment] = useState(false);

  // useEffect(() => {
  //   if (data?.businessData) {
  //     calculateShopStatus();
  //   }
  // }, [data?.businessData]);

  const calculateShopStatus = () => {
    const status = isShopOpen(
      data?.businessData.working_days,
      data?.businessData.daily_start_time,
      data?.businessData.daily_end_time,
    );
    setShopStatus(status);
  };

  const CancelBooking = () => {
    setLoading(true);
    POST_WITH_TOKEN(
      CANCEL_BOOKING + data?.bookingData?.data?.booking?.id,
      {},
      success => {
        // console.log(success, 'dsaddasdadasdadsadas');
        setLoading(false);
        setCancelAppointment(false);
        navigation.replace('BottomNavigation');
        ToastMsg('Booking Cancelled Successfully');
      },
      error => {
        setLoading(false);
        console.log(error, 'eqewqewqewqeqeqw');
        ToastMsg(error?.data.message);
        setCancelAppointment(false);
      },
      fail => {
        setLoading(false);
        console.log(fail, 'fdfdfdfdfdfdfd');
      },
    );
  };

  return (
    <View style={styles.container}>
      <>
        <HomeHeader
          title="Booking Confirmation"
          leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
          leftTint={COLOR.black}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginHorizontal: 5 }}>
          <>
            {/* <View style={styles.noticeContainer}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/128/1827/1827343.png',
                }}
                style={styles.noticeIcon}
              />
              <Typography style={styles.noticeText}>
                The salon is currently closed. They will confirm your
                appointment as soon as they open.
              </Typography>
            </View> */}

            {/* {shopStatus && !shopStatus.isOpen && (
              <View style={styles.closedBanner}>
                <Typography style={styles.closedText}>
                  ⚠️ The salon is currently closed
                </Typography>
                <Typography style={styles.noticeText}>
                  They will confirm your appointment as soon as they open.
                </Typography>
                <Typography style={styles.nextOpeningText}>
                  {shopStatus.nextOpening}
                </Typography>
              </View>
            )} */}

            {/* Shop Status Info (Always show) */}
            {/* {shopStatus && (
              <View
                style={[
                  styles.statusInfo,
                  shopStatus.isOpen ? styles.openStatus : styles.closedStatus,
                ]}>
                <Typography style={styles.statusText}>
                  {getShopStatusMessage(shopStatus)}
                </Typography>
              </View>
            )} */}
            <View
              style={{
                backgroundColor: "#E8F1FF",
                borderWidth: 1,
                borderColor: "#3B82F6",
                padding: 12,
                borderRadius: 10,
                marginVertical: 5,
                shadowColor: "#3B82F6",
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Typography style={{ color: "#1E3A8A", fontSize: 14, }} font={Font.medium}>
                {data?.businessData?.business_name} will confirm your service request in next 15 minutes.
              </Typography>
            </View>
            {/* What To Do Next */}
            <View style={styles.section}>
              <Typography style={styles.sectionTitle}>
                What To Do Next
              </Typography>
              <Typography style={styles.listItem}>
                • Visit the location after receiving a confirmation
              </Typography>
              <Typography style={styles.listItem}>
                • Pay your bill on QuickSlot with any online payment to avail
                the offer
              </Typography>
            </View>

            {/* Things To Remember */}
            <View style={styles.section}>
              <Typography style={styles.sectionTitle}>
                Things To Remember
              </Typography>
              <Typography style={styles.listItem}>
                • You can change or add new services at the location
              </Typography>
              <Typography style={styles.listItem}>
                • Cash payments are not accepted
              </Typography>
            </View>

            {/* Salon Details */}
            <View style={styles.section}>
              <Typography style={styles.sectionTitle}>Provider Details</Typography>
              <Typography style={styles.salonName}>
                {data?.businessData?.business_name}
              </Typography>

              <View style={styles.salonRow}>
                {/* <Image
                  source={{ uri: cleanImageUrl(data?.businessData?.image) }}
                  style={styles.salonLogo}
                /> */}
                <Typography style={styles.salonAddress}>
                  {data?.businessData?.exact_location}
                </Typography>
              </View>

              {/* Call & Directions */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleCall(data?.businessData?.phone_number)}>
                  <Image source={images.call} style={styles.actionIcon} />
                  <Typography style={styles.actionText}>Call Us</Typography>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() =>
                    openMapWithDirections(data?.businessData?.exact_location)
                  }>
                  <Image source={images.mark} style={styles.actionIcon} />
                  <Typography style={styles.actionText}>
                    Get Directions
                  </Typography>
                </TouchableOpacity>
              </View>

              {/* <TouchableOpacity style={styles.callBtn}>
                <Typography style={styles.callText}>
                  ABC Hairdressing
                </Typography>
                <Typography style={styles.callSubText}>
                  For queries or instant confirmation
                </Typography>
              </TouchableOpacity> */}
              {/* <Button
                title={'Pay Now'}
                containerStyle={{marginTop: 15, marginBottom: 5}}
              /> */}
            </View>

            {/* Appointment Details */}
            <View style={styles.section}>
              <Typography style={styles.sectionTitle}>
                Appointment Details
              </Typography>
              {/* <Typography style={styles.detailText}>
                Appointment Id: {data?.bookingData?.data?.order_id}
              </Typography> */}
              <Typography style={styles.detailText}>
                Date:{' '}
                {moment(
                  Object.values(
                    data?.bookingData?.data?.booking?.schedule_time || {},
                  )[0]
                ).format('DD MMM, YYYY') || 'N/A'}
              </Typography>
              {/* <Typography style={styles.detailText}>
                Time:{' '}
                {timeKeys?.map(v => {
                  return moment(v, 'HH:mm').format('hh:mm A') + ', ';
                })}
              </Typography> */}
            </View>

            {/* Services Booked */}
            <View style={styles.section}>
              <Typography style={styles.sectionTitle}>
                Services Booked
              </Typography>
              {data?.selectedServices?.map((service, index) => {
                return (
                  <View style={styles.serviceRow}>

                    <View>
                      <Typography style={styles.serviceName}>
                        {service?.service?.name}
                      </Typography>
                      <Typography style={styles.serviceSubText}>
                        {service?.service?.description}
                      </Typography>
                    </View>
                  </View>
                )
              })}
            </View>

            {/* Cancel & Reschedule */}
            <View style={styles.footerRow}>
              <Button
                onPress={() => setCancelAppointment(true)}
                title={'Cancel'}
                titleColor={COLOR.red}
                leftImgStyle={{
                  height: 16,
                  width: 16,
                  marginRight: 10,
                  tintColor: COLOR.red,
                }}
                containerStyle={{
                  width: '100%',
                  backgroundColor: 'white',
                  borderWidth: 1,
                  borderColor: COLOR.red,
                }}
              />
              {/* <Button
                title={'Reschedule'}
                leftImgStyle={{height: 16, width: 16, marginRight: 10}}
                containerStyle={{width: '45%'}}
                onPress={() => navigation.navigate('BottomNavigation')}
              /> */}
            </View>
          </>
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
      </>
    </View>
  );
};

export default BookingConfirmation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  noticeContainer: {
    flexDirection: 'row',
    backgroundColor: '#fef6e4',
    padding: 12,
    marginVertical: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  noticeIcon: { width: 28, height: 28, marginRight: 8 },
  noticeText: { flex: 1, color: '#d98c00', fontSize: 14 },
  section: {
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    paddingHorizontal: 5,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  listItem: { fontSize: 14, color: '#444', marginVertical: 2 },
  salonName: { fontSize: 15, fontWeight: '600', marginBottom: 10 },
  salonRow: { flexDirection: 'row', alignItems: 'center' },
  salonLogo: {
    width: 80,
    height: '100%',
    marginRight: 10,
    resizeMode: 'contain',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  salonAddress: { flex: 1, fontSize: 13, color: '#555' },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: COLOR?.primaryLight,
    borderRadius: 8,
  },
  actionBtn: { alignItems: 'center' },
  actionIcon: { width: 22, height: 22, marginBottom: 4 },
  actionText: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  callBtn: {
    borderWidth: 1,
    borderColor: COLOR.primary,
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  callText: { textAlign: 'center', color: COLOR.primary, fontWeight: '600' },
  callSubText: { textAlign: 'center', fontSize: 12, color: '#888' },
  payBtn: {
    backgroundColor: COLOR.primary,
    padding: 15,
    borderRadius: 8,
    marginTop: 12,
  },
  payText: { textAlign: 'center', color: '#fff', fontWeight: '600' },
  detailText: { fontSize: 14, color: '#444', marginVertical: 3 },
  serviceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  serviceIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
    overflow: 'hidden',
    borderRadius: 8,
  },
  serviceName: { fontSize: 15, fontWeight: '600' },
  serviceSubText: { fontSize: 13, color: '#888', marginTop: 2 },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  cancelText: { color: 'red', fontWeight: '600' },
  rescheduleBtn: {
    backgroundColor: '#c9d8f5',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  rescheduleText: { color: '#333', fontWeight: '600' },
  closedBanner: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    margin: 5,
    marginBottom: 10,
  },
  closedText: {
    fontFamily: Font.bold,
    color: '#856404',
    fontSize: 14,
    marginBottom: 4,
  },
  noticeText: {
    fontFamily: Font.regular,
    color: '#856404',
    fontSize: 12,
    marginBottom: 4,
  },
  nextOpeningText: {
    fontFamily: Font.semibold,
    color: '#856404',
    fontSize: 12,
  },
  statusInfo: {
    padding: 10,
    borderRadius: 8,
    margin: 5,
    marginBottom: 10,
  },
  openStatus: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
  },
  closedStatus: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
  },
  statusText: {
    fontFamily: Font.semibold,
    fontSize: 13,
    textAlign: 'center',
  },
});
