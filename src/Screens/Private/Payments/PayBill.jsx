import React, {useEffect, useState} from 'react';
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
} from 'react-native';
import HomeHeader from '../../../Components/HomeHeader';
import CustomButton from '../../../Components/CustomButton';
import {COLOR} from '../../../Constants/Colors';
import {Typography} from '../../../Components/UI/Typography';
import {Font} from '../../../Constants/Font';
import {useIsFocused} from '@react-navigation/native';
import {GET_WITH_TOKEN} from '../../../Backend/Api';
import {GET_BOOKING_LIST} from '../../../Constants/ApiRoute';
import moment from 'moment';

const {width} = Dimensions.get('window');

const PayBill = () => {
  const isFocused = useIsFocused();

  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Calculate totals based on API data
  const calculateTotals = appointment => {
    const subtotal = parseFloat(appointment?.amount) || 0;
    const tax = parseFloat(appointment?.tax) || 0;
    const platformFee = parseFloat(appointment?.platform_fee) || 0;
    const total = subtotal + tax + platformFee;

    return {subtotal, tax, platformFee, total};
  };

  // Format date and time from schedule_time object
  const formatDateTime = scheduleTime => {
    if (!scheduleTime) return {date: 'N/A', time: 'N/A'};

    try {
      const timeKeys = Object.keys(scheduleTime).filter(key =>
        key.includes(':'),
      );
      if (timeKeys.length === 0) return {date: 'N/A', time: 'N/A'};

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

      return {date: formattedDate, time};
    } catch (error) {
      return {date: 'N/A', time: 'N/A'};
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
    GET_WITH_TOKEN(
      GET_BOOKING_LIST +
        `?status=pending&date=${moment(new Date()).format(
          'YYYY-MM-DD',
        )}&is_has_order_id=1`,
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

  const renderAppointmentCard = appointment => {
    const {total} = calculateTotals(appointment);
    const {date, time} = formatDateTime(appointment.schedule_time);
    const timeSlots = getAllTimeSlots(appointment.schedule_time);

    return (
      <View key={appointment.id} style={styles.bookingCard}>
        {/* Top Image with Overlay */}
        <ImageBackground
          source={{uri: getServiceImage(appointment)}}
          style={styles.salonImage}
          imageStyle={styles.salonImageStyle}>
          {/* Image Overlay */}
          <View style={styles.imageOverlay} />

          {/* Status Badge */}
          <View
            style={[styles.statusBadge, getStatusStyle(appointment.status)]}>
            <Typography style={styles.statusText}>
              {appointment.status?.toUpperCase()}
            </Typography>
          </View>

          {/* Floating Total Badge */}
          <View style={styles.amountBadge}>
            <Typography style={styles.amountBadgeText}>
              {formatCurrency(total)}
            </Typography>
          </View>

          {/* Service Info Overlay */}
          <View style={styles.imageInfo}>
            <Typography style={styles.serviceNameOverlay}>
              {getServiceName(appointment)}
            </Typography>
            <Typography style={styles.vendorNameOverlay}>
              {getVendorName(appointment)}
            </Typography>
          </View>
        </ImageBackground>

        {/* Details Section */}
        <View style={styles.detailsSection}>
          {/* Basic Info Row */}
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Typography style={styles.infoLabel}>Order ID</Typography>
              <Typography style={styles.infoValue} numberOfLines={1}>
                {appointment.order_id}
              </Typography>
            </View>
            <View style={styles.infoItem}>
              <Typography style={styles.infoLabel}>Appointment</Typography>
              <Typography style={styles.infoValue}>{date}</Typography>
            </View>
          </View>

          {/* Time Slots */}
          {timeSlots.length > 0 && (
            <View style={styles.timeSlotsContainer}>
              <Typography style={styles.timeSlotsLabel}>Time Slots:</Typography>
              <View style={styles.timeSlots}>
                {timeSlots.slice(0, 3).map((slot, index) => (
                  <View key={index} style={styles.timeChip}>
                    <Typography style={styles.timeChipText}>
                      {slot.time}
                    </Typography>
                  </View>
                ))}
                {timeSlots.length > 3 && (
                  <View style={styles.moreTimeChip}>
                    <Typography style={styles.moreTimeText}>
                      +{timeSlots.length - 3}
                    </Typography>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Service Details */}
          <View style={styles.serviceDetails}>
            <View style={styles.serviceDetailRow}>
              <Typography style={styles.detailLabel}>Service:</Typography>
              <Typography style={styles.detailValue}>
                {getServiceName(appointment)}
              </Typography>
            </View>
            {appointment.note && (
              <View
                style={[styles.serviceDetailRow, {alignItems: 'flex-start'}]}>
                <Typography style={styles.detailLabel}>Note:</Typography>
                <Typography style={styles.noteText}>
                  {appointment.note}
                </Typography>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.payButton}
              onPress={() => {
                setSelectedAppointment(appointment);
                setModalVisible(true);
              }}>
              <Typography style={styles.payButtonText}>Pay Now</Typography>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.detailsButton}>
              <Typography style={styles.detailsButtonText}>Details</Typography>
            </TouchableOpacity> */}
          </View>
        </View>
      </View>
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
        {/* Summary Card */}
        {appointments.length > 0 && (
          <View style={styles.summaryCard}>
            <Typography style={styles.summaryTitle}>Payment Summary</Typography>
            <View style={styles.summaryRow}>
              <Typography style={styles.summaryText}>
                Total Pending: {appointments.length} appointment(s)
              </Typography>
              <Typography style={styles.summaryAmount}>
                {formatCurrency(
                  appointments.reduce(
                    (total, apt) => total + calculateTotals(apt).total,
                    0,
                  ),
                )}
              </Typography>
            </View>
          </View>
        )}

        {/* Appointments List */}
        <View style={styles.appointmentsList}>
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
                      source={{uri: getServiceImage(selectedAppointment)}}
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
                        const {subtotal, tax, platformFee, total} =
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
    shadowOffset: {width: 0, height: 2},
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
    shadowOffset: {width: 0, height: 4},
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
});
