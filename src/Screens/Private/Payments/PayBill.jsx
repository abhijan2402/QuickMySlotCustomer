import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Text,
  TextInput
} from 'react-native';
import HomeHeader from '../../../Components/HomeHeader';
import CustomButton from '../../../Components/CustomButton';
import { COLOR } from '../../../Constants/Colors';
import { Typography } from '../../../Components/UI/Typography';
import { Font } from '../../../Constants/Font';
import { useIsFocused } from '@react-navigation/native';
import { GET_WITH_TOKEN, POST_FORM_DATA, POST_WITH_TOKEN } from '../../../Backend/Api';
import { BOOKING_VERIFY, GET_BOOKING_LIST } from '../../../Constants/ApiRoute';
import moment from 'moment';
import RazorpayCheckout from 'react-native-razorpay';
import { ToastMsg, windowHeight, windowWidth } from '../../../Backend/Utility';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

const PayBill = () => {
  const isFocused = useIsFocused();
  const [updatedCalculation, setupdatedCalculation] = useState(null)
  const [updatedOrderId, setupdatedOrderId] = useState(null)
  const [showExtraPayInput, setShowExtraPayInput] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [extraPayAmount, setExtraPayAmount] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const userdata = useSelector(store => store.userDetails);

  // Calculate totals based on API data
  const calculateTotals = appointment => {
    const subtotal = parseFloat(appointment?.amount) || 0;
    const tax = parseFloat(appointment?.tax) || 0;
    const platformFee = parseFloat(appointment?.platform_fee) || 0;
    const total = subtotal + tax + platformFee;

    return { subtotal, tax, platformFee, total };
  };

  // Format date and time from schedule_time object
  const formatDateTime = scheduleTime => {
    if (!scheduleTime) return { date: 'N/A', time: 'N/A' };

    try {
      const timeKeys = Object.keys(scheduleTime).filter(key =>
        key.includes(':'),
      );
      if (timeKeys.length === 0) return { date: 'N/A', time: 'N/A' };

      // Get the first time slot
      const time = timeKeys[0];
      const date = scheduleTime[time];

      // Handle different date formats from API
      let formattedDate;
      try {
        formattedDate = moment(date, [
          'YYYY-MM-DD',
          'DD/MM/YYYY',
          'YYYY/MM/DD',
        ]).format('MMM DD, YYYY');
      } catch {
        formattedDate = 'Invalid Date';
      }

      return { date: formattedDate, time };
    } catch (error) {
      return { date: 'N/A', time: 'N/A' };
    }
  };

  // Get all time slots for an appointment
  const getAllTimeSlots = scheduleTime => {
    if (!scheduleTime) return [];

    try {
      return Object.keys(scheduleTime)
        .filter(key => key.includes(':'))
        .map(time => ({
          time,
          date: scheduleTime[time],
        }));
    } catch (error) {
      return [];
    }
  };

  // Format currency
  const formatCurrency = amount => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  // Get status badge style
  const getStatusStyle = status => {
    switch (status) {
      case 'pending':
        return styles.statusPending;
      case 'confirmed':
        return styles.statusConfirmed;
      case 'completed':
        return styles.statusCompleted;
      default:
        return styles.statusPending;
    }
  };

  // Get service image or fallback
  const getServiceImage = appointment => {
    return (
      appointment?.service?.image ||
      'https://im.whatshot.in/img/2019/May/shutterstock-653296774-cropped-1-1557311742.jpg'
    );
  };

  // Get service name
  const getServiceName = appointment => {
    return (
      appointment?.service?.name || appointment?.service_name || 'Hair Service'
    );
  };

  // Get vendor name
  const getVendorName = appointment => {
    return (
      appointment?.customer?.business_name ||
      appointment?.customer?.name ||
      'Salon'
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    getBookingList();
    setTimeout(() => setRefreshing(false), 1000);
  };

  useEffect(() => {
    if (isFocused) {
      getBookingList();
    }
  }, [isFocused]);

  const getBookingList = () => {
    setLoader(true);
    // GET_BOOKING_LIST +
    // `?status=pending&date=2026-01-21`,
    //    GET_BOOKING_LIST +
    // `?status=accepted&date=${moment(new Date()).format(
    //   'YYYY-MM-DD',
    // )}`,
    GET_WITH_TOKEN(
      // GET_BOOKING_LIST,
      GET_BOOKING_LIST +
      `?status=accepted&date=${moment(new Date()).format(
        'YYYY-MM-DD',
      )}`,
      success => {

        setAppointments(success?.data || []);
        setLoader(false);
      },
      error => {
        setLoader(false);
        console.log('Error in booking list:', error);
      },
      fail => {
        setLoader(false);
        console.log('Failed to get booking list:', fail);
      },
    );
  };

  const bookPay = (id, amount = 0, subtotalVal = 0) => {
    const formData = new FormData()
    console.log(amount, subtotalVal, "AMOUBDBDB", Number(amount) - Number(subtotalVal));
    // if (Number(amount) - Number(subtotalVal) < 0) {
    //   ToastMsg("Amount must be greater than total amount");
    //   return
    // }
    const updatedAmount = Number(amount) - Number(subtotalVal)
    console.log(updatedAmount, "UPDARATATAT");

    formData.append("additional_amount", updatedAmount)

    // setLoading(true);
    // return
    POST_FORM_DATA(
      'customer/booking-create/' + id,
      formData,
      success => {
        console.log(success?.data?.calculation_breakdown, 'PAYYYYYY____', success?.data?.order_id,);
        setupdatedCalculation(success?.data?.calculation_breakdown)
        setupdatedOrderId(success?.data?.booking?.order_id || success?.data?.order_id)
        setSelectedAppointmentId(null)
        getBookingList()
        if (updatedAmount == 0) {
        }
        setTimeout(() => {
          ToastMsg("Taking to payment page...")
          initiateRazorpayPayment(success?.data?.booking?.order_id || success?.data?.order_id, id)
        }, 3000);
        setExtraPayAmount(null)
      },
      error => {
        console.log(error, "ERRRR");
        ToastMsg(error?.message);

        // setLoading(false);
        // console.log(success);
      },
      fail => {
        console.log(fail, "FDAIIAI");
        ToastMsg(fail?.message);

        // setLoading(false);
        console.log(fail);
      },
    );
  };


  // renderAppointmentCard
  const renderAppointmentCard = (appointment) => {
    const isSelected = selectedAppointmentId === appointment.id;

    return (
      <View
        style={{
          backgroundColor: "#fff",
          padding: 14,
          borderRadius: 12,
          marginBottom: 12,
          elevation: 3,
          borderWidth: 1,
          borderColor: COLOR.primary
        }}
      >
        {/* Shop Name */}
        <Text style={{ fontSize: 18, fontFamily: Font.semibold }}>
          {appointment?.vendor?.business_name ||
            appointment?.vendor?.name ||
            "Shop name"}
        </Text>

        {/* Address */}
        <Text style={{ color: "#555", marginTop: 2, fontFamily: Font.medium }}>
          {appointment?.vendor?.FullAddress ||
            appointment?.vendor?.city ||
            "Address not available"}
        </Text>

        {/* Service Name */}
        <Text style={{ marginTop: 6, fontWeight: "600" }}>
          Service: {appointment?.services?.[0]?.name || "-"}
        </Text>

        {/* Date */}
        <Text style={{ marginTop: 4 }}>
          Date: {Object.values(appointment?.schedule_time || {})?.[0] || "-"}
        </Text>

        {/* Time Slots */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 6 }}>
          {appointment?.schedule_time &&
            Object.keys(appointment.schedule_time).map((time, index) => (
              <View
                key={index}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  backgroundColor: COLOR.backgroundLight,
                  borderRadius: 20,
                  marginRight: 6,
                  marginTop: 4,
                }}
              >
                <Text>{time}</Text>
              </View>
            ))}
        </View>

        {/* Amounts */}
        <Text style={{ marginTop: 10, fontWeight: "600" }}>
          Subtotal: ₹ {appointment?.subtotal || "-"}
        </Text>

        <Text style={{ marginTop: 4, fontWeight: "700", fontSize: 16 }}>
          Final Amount: ₹ {appointment?.final_amount}
        </Text>
        {
          updatedCalculation?.subtotal &&
          <View style={styles.priceCard}>
            <Typography style={styles.priceTitle}>Price Details</Typography>
            <View style={styles.serviceRow}>
              <Typography style={styles.text}>Sub Total</Typography>
              <Typography style={styles.text}>
                ₹{Number(updatedCalculation?.subtotal || 0).toFixed(2)}
              </Typography>
            </View>

            {
              updatedCalculation?.gst_amount != "0.00" &&
              <View style={styles.serviceRow}>
                <Typography style={styles.text}>Taxes (GST)</Typography>
                <Typography style={styles.text}>₹{updatedCalculation?.tax}</Typography>
              </View>
            }
            <View style={styles.serviceRow}>
              <Typography style={styles.text}>Convenience fee</Typography>
              <Typography style={styles.text}>₹{Number(updatedCalculation?.convenience_fee || 0)?.toFixed(2)}
              </Typography>
            </View>
            <View style={styles.serviceRow}>
              <Typography style={styles.text}>Platform Fee</Typography>
              <Typography style={styles.text}>₹{updatedCalculation?.platform_fee}</Typography>
            </View>
            {updatedCalculation?.total_discount_amount > 0 && (
              <View style={styles.serviceRow}>
                <Typography style={styles.offerAppliedText}>Discount</Typography>
                <Typography style={[styles.offerCode, { color: 'green' }]}>
                  -₹{updatedCalculation?.total_discount_amount && updatedCalculation?.total_discount_amount?.toFixed(2)}
                </Typography>
              </View>
            )}
            {
              updatedCalculation?.cashback_amount &&
              <Typography style={[styles.offerAppliedText, { marginTop: 10, color: COLOR.green }]}>You will get a cashback of ₹{updatedCalculation?.cashback_amount}</Typography>

            }
            <View style={styles.divider} />
            <View style={styles.serviceRow}>
              <Typography style={styles.grandTotal}>Grand Total</Typography>
              <Typography style={styles.grandTotal}>₹{Number(updatedCalculation?.final_amount || 0)?.toFixed(2)}</Typography>
            </View>
          </View>

        }


        {/* -------- Add Another Payment -------- */}
        {/* ---- Pay Now button ---- */}


        {/* -------- Amount Input -------- */}
        {/* {isSelected && ( */}
        <View style={{ marginTop: 12 }}>
          <TextInput
            placeholder="Enter amount to pay"
            keyboardType="numeric"
            value={extraPayAmount}
            onChangeText={setExtraPayAmount}
            style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10 }}
          />

          <TouchableOpacity
            style={{ backgroundColor: COLOR.primary, marginTop: 10, padding: 12, borderRadius: 8 }}
            onPress={() => {
              console.log("Pay Amount:", JSON.parse(appointment?.calculation_breakdown)?.subtotal);
              if (extraPayAmount == null) {
                bookPay(appointment.id, 0)

              }
              if (extraPayAmount < appointment?.final_amount) {
                ToastMsg("Please enter a valid amount")
                return
              }
              // return
              if (appointment?.order_id) {

                bookPay(appointment.id, extraPayAmount, JSON.parse(appointment?.calculation_breakdown)?.subtotal)
              }
              else {
                console.log(JSON.parse(appointment?.calculation_breakdown)?.subtotal, "FINAL2");

                bookPay(appointment.id, extraPayAmount, JSON.parse(appointment?.calculation_breakdown)?.subtotal)
              }
              // setSelectedAppointmentId(null); // optional: close after pay
            }}
          >
            <Text style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}>
              Pay Now
            </Text>
          </TouchableOpacity>
        </View>
        {/* <Text style={{ textAlign: "center", marginTop: 10 }}>
          Or
        </Text>
        {!isSelected && (
          <>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => bookPay(appointment.id, 0)}
                style={{ marginTop: 14, backgroundColor: COLOR.primary, padding: 10, borderRadius: 8, width: windowWidth / 1.19 }}
              >
                <Text style={{ color: COLOR.white, textAlign: "center", fontWeight: "600" }}>
                  Pay Now
                </Text>
              </TouchableOpacity>

            </View>
          </>
        )} */}
        {/* )} */}
      </View>
    );
  };

  const razorpayConfig = {
    key_id: 'rzp_live_Rtp1NvclC2UEPp', // Only key_id should be in frontend
    currency: 'INR',
    name: 'QuickMySlot',
    description: 'Add Amount to Wallet',
  };

  const initiateRazorpayPayment = async (orderId, bookingID, amount) => {
    // const amount = Paymentbreakdown?.final_amount;
    // if (!amount || amount <= 0) {
    //   ToastMsg('Please enter a valid amount');
    //   return;
    // }
    // setLoading(true);
    console.log("JOOOO", orderId, bookingID, amount);

    try {
      // Step 1: Create Razorpay order on your backend
      // const orderData = await handleSubmit(is_paid_key);
      // const orderId = orderData?.order_id || orderData?.data?.razorpay_order_id;
      // const bookingID = orderData?.data?.booking?.id

      if (!orderId) {
        // // console.log('Order data received:', orderData);
        throw new Error(
          'Failed to create payment order - no order ID received',
        );
      }

      // Step 2: Initialize Razorpay checkout
      const options = {
        description: 'Booking Payment',
        image: 'https://your-app-logo.png', // Your app logo
        currency: razorpayConfig.currency,
        key: razorpayConfig.key_id,
        // amount: amount * 100, // Convert to paise
        name: razorpayConfig.name,
        order_id: orderId, // Use the extracted order ID
        prefill: {
          email: userdata?.email || 'user@example.com',
          contact: userdata?.phone_number || '9999999999',
          name: userdata?.name || 'User',
        },
        theme: { color: COLOR.primary },
      };

      console.log('Razorpay options:', options);

      // Step 3: Open Razorpay checkout
      RazorpayCheckout.open(options)
        .then(data => {
          // Step 4: Verify payment on your backend
          verifyPayment({
            bookingId: bookingID,
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_order_id: data.razorpay_order_id,
            razorpay_signature: data.razorpay_signature,
          });
        })
        .catch(error => {
          console.log(error, "EEEEEEE");

          // setLoading(false);
          if (error.code === 2) {
            ToastMsg('Payment was cancelled');
          } else if (error.code === 0) {
            // Network error

            ToastMsg(error?.description || 'Network error. Please check your connection.');
          } else {
            // Other errors
            ToastMsg(error.description || 'Payment failed. Please try again.');
          }
        });
    } catch (error) {
      console.log(error, "EOJEOJ");

      setLoading(false);
      ToastMsg(
        error.message || 'Failed to initialize payment. Please try again.',
      );
    }
  };

  const verifyPayment = paymentData => {
    const formData = new FormData();
    formData.append('booking_id', paymentData.bookingId);
    formData.append('razorpay_signature', paymentData.razorpay_signature);
    formData.append('razorpay_order_id', paymentData.razorpay_order_id);
    formData.append('razorpay_payment_id', paymentData.razorpay_payment_id);

    POST_FORM_DATA(
      BOOKING_VERIFY, // This should be your payment verification endpoint
      formData,
      success => {
        // console.log(success, 'successsuccesssuccess');
        setLoading(false);
        ToastMsg(success?.message);
        navigation.pop();
        // navigation.navigate('BookingConfirmation', {
        //   data: {
        //     selectedServices: cartItems,
        //     total: total,
        //     note,
        //     selectedTimes,
        //     bookingData: success,
        //     businessData,
        //   },
        // });
        // navigation.navigate('BookingConfirmation', {
        //   data: {
        //     selectedServices: cartValue,
        //     total: Paymentbreakdown?.final_amount,
        //     note,
        //     selectedTimes,
        //     bookingData: success,
        //     businessData: shopData,
        //   },
        // });
        getBookingList()
      },
      error => {
        console.log(error, 'errorerrorerrorerror');
        setLoading(false);
        ToastMsg(error?.data?.message);
      },
      fail => {
        setLoading(false);
        ToastMsg('Network error. Please try again.');
      },
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <HomeHeader
        title="Pending Payments"
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.black}
      />

      {/* Content */}
      <View style={styles.appointmentsList}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLOR.primary]}
              tintColor={COLOR.primary}
            />
          }>

          {/* Appointments List */}
          <View >
            {appointments.map(renderAppointmentCard)}
          </View>

          {/* Empty State */}
          {appointments.length === 0 && !loader && (
            <View style={styles.emptyState}>
              <Typography style={styles.emptyStateIcon}>💳</Typography>
              <Typography style={styles.emptyStateTitle}>
                No Pending Payments
              </Typography>
              <Typography style={styles.emptyStateText}>
                You don't have any pending payments at the moment.
              </Typography>
            </View>
          )}

          {/* Loading State */}
          {loader && (
            <View style={styles.loadingState}>
              <ActivityIndicator size="large" color={COLOR.primary} />
              <Typography style={styles.loadingText}>
                Loading appointments...
              </Typography>
            </View>
          )}
        </ScrollView>

      </View>

      {/* Payment Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Typography style={styles.sheetTitle}>Payment Details</Typography>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <Typography style={styles.closeButtonText}>✕</Typography>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScrollView}
              showsVerticalScrollIndicator={false}>
              {selectedAppointment && (
                <>
                  {/* Appointment Overview */}
                  <View style={styles.modalOverview}>
                    <ImageBackground
                      source={{ uri: getServiceImage(selectedAppointment) }}
                      style={styles.modalImage}
                      imageStyle={styles.modalImageStyle}>
                      <View style={styles.modalImageOverlay} />
                      <Typography style={styles.modalServiceName}>
                        {getServiceName(selectedAppointment)}
                      </Typography>
                    </ImageBackground>
                  </View>

                  {/* Basic Information */}
                  <View style={styles.modalSection}>
                    <Typography style={styles.sectionTitle}>
                      Appointment Information
                    </Typography>
                    <View style={styles.infoGrid}>
                      <View style={styles.infoItemModal}>
                        <Typography style={styles.infoLabelModal}>
                          Order ID
                        </Typography>
                        <Typography style={styles.infoValueModal}>
                          {selectedAppointment.order_id}
                        </Typography>
                      </View>
                      <View style={styles.infoItemModal}>
                        <Typography style={styles.infoLabelModal}>
                          Status
                        </Typography>
                        <View
                          style={[
                            styles.statusBadgeModal,
                            getStatusStyle(selectedAppointment.status),
                          ]}>
                          <Typography style={styles.statusTextModal}>
                            {selectedAppointment.status}
                          </Typography>
                        </View>
                      </View>
                      <View style={styles.infoItemModal}>
                        <Typography style={styles.infoLabelModal}>
                          Date
                        </Typography>
                        <Typography style={styles.infoValueModal}>
                          {
                            formatDateTime(selectedAppointment.schedule_time)
                              .date
                          }
                        </Typography>
                      </View>
                      <View style={styles.infoItemModal}>
                        <Typography style={styles.infoLabelModal}>
                          Vendor
                        </Typography>
                        <Typography style={styles.infoValueModal}>
                          {getVendorName(selectedAppointment)}
                        </Typography>
                      </View>
                    </View>
                  </View>

                  {/* Time Slots */}
                  <View style={styles.modalSection}>
                    <Typography style={styles.sectionTitle}>
                      Scheduled Times
                    </Typography>
                    <View style={styles.timeSlotsGrid}>
                      {getAllTimeSlots(selectedAppointment.schedule_time).map(
                        (slot, index) => (
                          <View key={index} style={styles.timeSlotModal}>
                            <Typography style={styles.timeSlotTime}>
                              {slot.time}
                            </Typography>
                            <Typography style={styles.timeSlotDate}>
                              {moment(slot.date, [
                                'YYYY-MM-DD',
                                'DD/MM/YYYY',
                                'YYYY/MM/DD',
                              ]).format('MMM DD')}
                            </Typography>
                          </View>
                        ),
                      )}
                    </View>
                  </View>

                  {/* Payment Breakdown */}
                  <View style={styles.modalSection}>
                    <Typography style={styles.sectionTitle}>
                      Payment Breakdown
                    </Typography>
                    <View style={styles.paymentBreakdown}>
                      {(() => {
                        const { subtotal, tax, platformFee, total } =
                          calculateTotals(selectedAppointment);
                        return (
                          <>
                            <View style={styles.breakdownRow}>
                              <Typography style={styles.breakdownLabel}>
                                Service Amount
                              </Typography>
                              <Typography style={styles.breakdownValue}>
                                {formatCurrency(subtotal)}
                              </Typography>
                            </View>
                            <View style={styles.breakdownRow}>
                              <Typography style={styles.breakdownLabel}>
                                Taxes
                              </Typography>
                              <Typography style={styles.breakdownValue}>
                                {formatCurrency(tax)}
                              </Typography>
                            </View>
                            <View style={styles.breakdownRow}>
                              <Typography style={styles.breakdownLabel}>
                                Platform Fee
                              </Typography>
                              <Typography style={styles.breakdownValue}>
                                {formatCurrency(platformFee)}
                              </Typography>
                            </View>
                            <View style={styles.totalRowModal}>
                              <Typography style={styles.totalLabelModal}>
                                Total Amount
                              </Typography>
                              <Typography style={styles.totalValueModal}>
                                {formatCurrency(total)}
                              </Typography>
                            </View>
                          </>
                        );
                      })()}
                    </View>
                  </View>

                  {/* Additional Information */}
                  {selectedAppointment.note && (
                    <View style={styles.modalSection}>
                      <Typography style={styles.sectionTitle}>
                        Additional Notes
                      </Typography>
                      <View style={styles.notesBox}>
                        <Typography style={styles.notesText}>
                          {selectedAppointment.note}
                        </Typography>
                      </View>
                    </View>
                  )}
                </>
              )}
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <CustomButton
                style={styles.confirmButton}
                onPress={() => {
                  console.log(
                    'Payment initiated for',
                    selectedAppointment?.order_id,
                  );
                  setModalVisible(false);
                }}
                title="Confirm Payment"
              />
              <CustomButton
                style={styles.cancelButtonModal}
                textStyle={styles.cancelButtonText}
                onPress={() => setModalVisible(false)}
                title="Cancel"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PayBill;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background || '#F8F8F8',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: COLOR.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: Font.bold,
    color: COLOR.primary,
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 14,
    fontFamily: Font.medium,
    color: COLOR.textSecondary,
  },
  summaryAmount: {
    fontSize: 18,
    fontFamily: Font.bold,
    color: COLOR.primary,
  },

  // Appointment Card
  bookingCard: {
    backgroundColor: COLOR.white,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  salonImage: {
    width: '100%',
    height: 160,
    justifyContent: 'space-between',
  },
  salonImageStyle: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 12,
  },
  statusPending: {
    backgroundColor: '#FFF3CD',
  },
  statusConfirmed: {
    backgroundColor: '#D1ECF1',
  },
  statusCompleted: {
    backgroundColor: '#D4EDDA',
  },
  statusText: {
    fontSize: 11,
    fontFamily: Font.bold,
    color: COLOR.black,
  },
  amountBadge: {
    alignSelf: 'flex-end',
    backgroundColor: COLOR.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 12,
  },
  amountBadgeText: {
    fontSize: 14,
    fontFamily: Font.bold,
    color: COLOR.white,
  },
  imageInfo: {
    padding: 12,
  },
  serviceNameOverlay: {
    fontSize: 18,
    fontFamily: Font.bold,
    color: COLOR.white,
    marginBottom: 4,
  },
  vendorNameOverlay: {
    fontSize: 14,
    fontFamily: Font.medium,
    color: COLOR.white,
    opacity: 0.9,
  },

  // Details Section
  detailsSection: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: Font.medium,
    color: COLOR.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: Font.semibold,
    color: COLOR.black,
  },
  timeSlotsContainer: {
    marginBottom: 12,
  },
  timeSlotsLabel: {
    fontSize: 12,
    fontFamily: Font.medium,
    color: COLOR.textSecondary,
    marginBottom: 8,
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeChip: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  timeChipText: {
    fontSize: 12,
    fontFamily: Font.medium,
    color: COLOR.textSecondary,
  },
  moreTimeChip: {
    backgroundColor: COLOR.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  moreTimeText: {
    fontSize: 12,
    fontFamily: Font.medium,
    color: COLOR.white,
  },
  serviceDetails: {
    marginBottom: 16,
  },
  serviceDetailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 13,
    fontFamily: Font.medium,
    color: COLOR.textSecondary,
    width: 70,
  },
  detailValue: {
    fontSize: 13,
    fontFamily: Font.semibold,
    color: COLOR.black,
    flex: 1,
  },
  noteText: {
    fontSize: 13,
    fontFamily: Font.medium,
    color: COLOR.textSecondary,
    flex: 1,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  payButton: {
    backgroundColor: COLOR.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    flex: 2,
    alignItems: 'center',
  },
  payButtonText: {
    color: COLOR.white,
    fontSize: 14,
    fontFamily: Font.bold,
  },
  detailsButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLOR.textSecondary,
    flex: 1,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: COLOR.textSecondary,
    fontSize: 14,
    fontFamily: Font.medium,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: Font.bold,
    color: COLOR.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: Font.medium,
    color: COLOR.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Loading State
  loadingState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: Font.medium,
    color: COLOR.textSecondary,
    marginTop: 12,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLOR.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sheetTitle: {
    fontSize: 20,
    fontFamily: Font.bold,
    color: COLOR.primary,
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: COLOR.textSecondary,
  },
  modalScrollView: {
    padding: 20,
  },
  modalOverview: {
    marginBottom: 20,
  },
  modalImage: {
    height: 120,
    borderRadius: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  modalImageStyle: {
    borderRadius: 12,
  },
  modalImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalServiceName: {
    fontSize: 18,
    fontFamily: Font.bold,
    color: COLOR.white,
    padding: 16,
  },
  modalSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Font.bold,
    color: COLOR.black,
    marginBottom: 12,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  infoItemModal: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  infoLabelModal: {
    fontSize: 12,
    fontFamily: Font.medium,
    color: COLOR.textSecondary,
    marginBottom: 4,
  },
  infoValueModal: {
    fontSize: 14,
    fontFamily: Font.semibold,
    color: COLOR.black,
  },
  statusBadgeModal: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusTextModal: {
    fontSize: 11,
    fontFamily: Font.bold,
    color: COLOR.black,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  timeSlotModal: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    margin: 4,
    minWidth: (width - 80) / 3,
    alignItems: 'center',
  },
  timeSlotTime: {
    fontSize: 14,
    fontFamily: Font.bold,
    color: COLOR.primary,
    marginBottom: 4,
  },
  timeSlotDate: {
    fontSize: 12,
    fontFamily: Font.medium,
    color: COLOR.textSecondary,
  },
  paymentBreakdown: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 14,
    fontFamily: Font.medium,
    color: COLOR.textSecondary,
  },
  breakdownValue: {
    fontSize: 14,
    fontFamily: Font.semibold,
    color: COLOR.black,
  },
  totalRowModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#DEE2E6',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabelModal: {
    fontSize: 16,
    fontFamily: Font.bold,
    color: COLOR.primary,
  },
  totalValueModal: {
    fontSize: 18,
    fontFamily: Font.bold,
    color: COLOR.primary,
  },
  notesBox: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
  },
  notesText: {
    fontSize: 14,
    fontFamily: Font.medium,
    color: COLOR.textSecondary,
    lineHeight: 20,
  },
  modalActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  confirmButton: {
    width: '100%',
    marginBottom: 12,
  },
  cancelButtonModal: {
    backgroundColor: COLOR.white,
    borderWidth: 1,
    borderColor: COLOR.textSecondary,
    width: '100%',
  },
  cancelButtonText: {
    color: COLOR.textSecondary,
    fontFamily: Font.medium,
  },
  appointmentsList: {
    // borderWidth: 1,
    height: windowHeight / 1.2
  }
  ,

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
});
