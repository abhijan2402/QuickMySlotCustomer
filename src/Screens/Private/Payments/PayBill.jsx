import React, {useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  ImageBackground,
} from 'react-native';
import HomeHeader from '../../../Components/HomeHeader';
import CustomButton from '../../../Components/CustomButton';
import {COLOR} from '../../../Constants/Colors';
import {Typography} from '../../../Components/UI/Typography';
import {Font} from '../../../Constants/Font';

const PayBill = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 'AP12345',
      customerName: 'John Doe',
      date: '2025-08-22',
      time: '3:00 PM',
      services: [1, 2],
      dueDate: '2025-08-24',
    },
    {
      id: 'AP12346',
      customerName: 'Emma Watson',
      date: '2025-08-23',
      time: '11:00 AM',
      services: [3],
      dueDate: '2025-08-25',
    },
  ]);

  const services = [
    {id: 1, name: 'Haircut & Styling', price: 40},
    {id: 2, name: 'Hair Spa', price: 50},
    {id: 3, name: 'Hair Coloring', price: 100},
    {id: 4, name: 'Manicure', price: 25},
    {id: 5, name: 'Pedicure', price: 30},
  ];

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const calculateTotals = appointment => {
    const selectedItems = services.filter(service =>
      appointment.services.includes(service.id),
    );
    const subtotal = selectedItems.reduce((sum, s) => sum + s.price, 0);
    const tax = subtotal * 0.1;
    const platformFee = 2;
    const total = subtotal + tax + platformFee;

    return {subtotal, tax, platformFee, total};
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <HomeHeader
        title="Pending Payments"
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.black}
      />

      <ScrollView showsVerticalScrollIndicator={false} style={{marginTop: 15}}>
        {appointments.map(appointment => {
          const {total} = calculateTotals(appointment);

          return (
            <View key={appointment.id} style={styles.bookingCard}>
              {/* Top Image */}
              <ImageBackground
                source={{
                  uri: 'https://im.whatshot.in/img/2019/May/shutterstock-653296774-cropped-1-1557311742.jpg',
                }}
                style={styles.salonImage}
                imageStyle={{
                  borderTopLeftRadius: 14,
                  borderTopRightRadius: 14,
                }}>
                {/* Floating Total Badge */}
                <View style={styles.amountBadge}>
                  <Typography style={styles.amountBadgeText}>
                    ${total.toFixed(2)}
                  </Typography>
                </View>
              </ImageBackground>

              {/* Details */}
              <View style={styles.detailsSection}>
                <Typography style={styles.salonName}>
                  Glamour Touch Salon
                </Typography>
                <Typography style={styles.salonRating}>
                  ⭐️⭐️⭐️ (3.5)
                </Typography>

                <View style={{marginTop: 10}}>
                  <Typography style={styles.detailText}>
                    Appointment: {appointment.date} at {appointment.time}
                  </Typography>
                  <Typography style={styles.detailText}>
                    Due Date: {appointment.dueDate}
                  </Typography>
                </View>

                {/* Pay Now Button */}
                <TouchableOpacity
                  style={styles.payButton}
                  onPress={() => {
                    setSelectedAppointment(appointment);
                    setModalVisible(true);
                  }}>
                  <Typography style={styles.payButtonText}>Pay Now</Typography>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Typography style={styles.sheetTitle}>Payment Details</Typography>

            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}>
              {selectedAppointment && (
                <>
                  {/* Appointment Info */}
                  <View style={styles.infoRow}>
                    <Typography style={styles.infoLabel}>
                      Appointment ID
                    </Typography>
                    <Typography style={styles.infoValue}>
                      {selectedAppointment.id}
                    </Typography>
                  </View>
                  <View style={styles.infoRow}>
                    <Typography style={styles.infoLabel}>
                      Date & Time
                    </Typography>
                    <Typography style={styles.infoValue}>
                      {selectedAppointment.date} at {selectedAppointment.time}
                    </Typography>
                  </View>

                  {/* Services */}
                  <Typography style={styles.sectionTitle}>Services</Typography>
                  {selectedAppointment.services.map(serviceId => {
                    const service = services.find(s => s.id === serviceId);
                    return (
                      <View key={service.id} style={styles.billRow}>
                        <Typography style={styles.billLabel}>
                          {service.name}
                        </Typography>
                        <Typography style={styles.billValue}>
                          ${service.price.toFixed(2)}
                        </Typography>
                      </View>
                    );
                  })}

                  {/* Summary */}
                  {(() => {
                    const {subtotal, tax, platformFee, total} =
                      calculateTotals(selectedAppointment);
                    return (
                      <View style={styles.summaryBox}>
                        <View style={styles.billRow}>
                          <Typography style={styles.summaryLabel}>
                            Subtotal
                          </Typography>
                          <Typography style={styles.summaryValue}>
                            ${subtotal.toFixed(2)}
                          </Typography>
                        </View>
                        <View style={styles.billRow}>
                          <Typography style={styles.summaryLabel}>
                            Taxes (10%)
                          </Typography>
                          <Typography style={styles.summaryValue}>
                            ${tax.toFixed(2)}
                          </Typography>
                        </View>
                        <View style={styles.billRow}>
                          <Typography style={styles.summaryLabel}>
                            Platform Fee
                          </Typography>
                          <Typography style={styles.summaryValue}>
                            ${platformFee.toFixed(2)}
                          </Typography>
                        </View>

                        <View style={styles.totalRow}>
                          <Typography style={styles.totalLabel}>
                            Total
                          </Typography>
                          <Typography style={styles.totalValue}>
                            ${total.toFixed(2)}
                          </Typography>
                        </View>
                      </View>
                    );
                  })()}
                </>
              )}
            </ScrollView>

            {/* Modal Actions */}
            <CustomButton
              style={{width: '100%', marginTop: 10}}
              onPress={() => {
                console.log('Payment initiated for', selectedAppointment?.id);
                setModalVisible(false);
              }}
              title="Confirm Payment"
            />
            <CustomButton
              style={styles.cancelButton}
              textStyle={styles.cancelButtonText}
              onPress={() => setModalVisible(false)}
              title="Cancel"
            />
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
    padding: 20,
  },

  /** Appointment Card */
  bookingCard: {
    backgroundColor: COLOR.white,
    borderRadius: 14,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  salonImage: {
    width: '100%',
    height: 140,
  },

  /** Floating Total Badge */
  amountBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLOR.primary,
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  amountBadgeText: {
    fontSize: 13,
    fontFamily: Font.semibold,
    color: COLOR.white,
  },

  /** Details Section */
  detailsSection: {
    padding: 15,
  },
  salonName: {
    fontSize: 17,
    fontFamily: Font.bold,
    color: COLOR.black,
  },
  salonRating: {
    fontSize: 13,
    fontFamily: Font.medium,
    color: COLOR.textSecondary,
    marginTop: 2,
  },
  detailText: {
    fontSize: 13,
    color: COLOR.textSecondary,
    fontFamily: Font.medium,
    marginBottom: 4,
  },

  /** Pay Button */
  payButton: {
    backgroundColor: COLOR.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  payButtonText: {
    color: COLOR.white,
    fontSize: 15,
    fontFamily: Font.bold,
  },

  /** Modal */
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLOR.white,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 20,
    maxHeight: '80%',
  },
  sheetTitle: {
    fontSize: 20,
    fontFamily: Font.bold,
    color: COLOR.primary,
    textAlign: 'center',
    marginBottom: 20,
  },

  /** Modal ScrollView */
  scrollView: {
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: Font.medium,
    color: COLOR.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: Font.semibold,
    color: COLOR.black,
  },

  /** Services */
  sectionTitle: {
    fontSize: 15,
    fontFamily: Font.semibold,
    color: COLOR.black,
    marginVertical: 10,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billLabel: {
    fontSize: 13,
    fontFamily: Font.medium,
    color: COLOR.textSecondary,
  },
  billValue: {
    fontSize: 13,
    fontFamily: Font.semibold,
    color: COLOR.black,
  },

  /** Summary Box */
  summaryBox: {
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  summaryLabel: {
    fontSize: 13,
    fontFamily: Font.medium,
    color: COLOR.textSecondary,
  },
  summaryValue: {
    fontSize: 13,
    fontFamily: Font.bold,
    color: COLOR.black,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    paddingTop: 10,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 15,
    fontFamily: Font.bold,
    color: COLOR.primary,
  },
  totalValue: {
    fontSize: 16,
    fontFamily: Font.bold,
    color: COLOR.primary,
  },

  /** Cancel Button */
  cancelButton: {
    backgroundColor: COLOR.white,
    borderWidth: 1,
    borderColor: COLOR.textSecondary,
    marginTop: 10,
    width: '100%',
  },
  cancelButtonText: {
    color: COLOR.textSecondary,
    fontFamily: Font.medium,
  },
});
