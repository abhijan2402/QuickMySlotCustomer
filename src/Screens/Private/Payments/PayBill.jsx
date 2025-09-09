import React, {useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import Button from '../../../Components/UI/Button';
import HomeHeader from '../../../Components/HomeHeader';
import CustomButton from '../../../Components/CustomButton';
import {COLOR} from '../../../Constants/Colors';
import {Typography} from '../../../Components/UI/Typography';

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

  return (
    <View style={{flex: 1, backgroundColor: 'white', padding: 20}}>
      <HomeHeader
        title="Pending Payments"
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.black}
      />

      <ScrollView style={{marginTop:10}}>
        {appointments.map(appointment => {
          const selectedItems = services.filter(service =>
            appointment.services.includes(service.id),
          );
          const subtotal = selectedItems.reduce((sum, s) => sum + s.price, 0);
          const tax = subtotal * 0.1;
          const platformFee = 2;
          const total = subtotal + tax + platformFee;

          return (
            <View key={appointment.id} style={styles.bookingCard}>
              {/* Salon Image */}
              <Image
                source={{
                  uri: 'https://im.whatshot.in/img/2019/May/shutterstock-653296774-cropped-1-1557311742.jpg',
                }}
                style={styles.salonImage}
                resizeMode="cover"
              />

              {/* Salon Info */}
              <Typography style={styles.salonName}>
                Glamour Touch Salon
              </Typography>
              <Typography style={styles.salonRating}>⭐️⭐️⭐️ (3.5)</Typography>
              <Typography style={styles.salonTagline}>
                Luxury salon services
              </Typography>

              {/* Appointment Info */}
              <Typography style={styles.bookingLabel}>
                Appointment: {appointment.date} at {appointment.time}
              </Typography>
              <Typography style={styles.bookingLabel}>
                Due Date: {appointment.dueDate}
              </Typography>
              <Typography style={styles.bookingLabel}>
                Amount Due:{' '}
                <Typography style={styles.amountDue}>
                  ${total.toFixed(2)}
                </Typography>
              </Typography>

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
          );
        })}
      </ScrollView>

      {/* Modal for Payment Details */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Typography style={styles.sheetTitle}>Payment Details</Typography>
            <ScrollView style={styles.scrollView}>
              {selectedAppointment && (
                <>
                  <View style={styles.bookingInfo}>
                    <Typography style={styles.bookingLabel}>
                      Appointment ID:
                    </Typography>
                    <Typography style={styles.bookingValue}>
                      {selectedAppointment.id}
                    </Typography>
                  </View>
                  <View style={styles.bookingInfo}>
                    <Typography style={styles.bookingLabel}>
                      Date & Time:
                    </Typography>
                    <Typography style={styles.bookingValue}>
                      {selectedAppointment.date} at {selectedAppointment.time}
                    </Typography>
                  </View>

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

                  {/* Pricing Summary */}
                  {(() => {
                    const selectedItems = services.filter(s =>
                      selectedAppointment.services.includes(s.id),
                    );
                    const subtotal = selectedItems.reduce(
                      (sum, s) => sum + s.price,
                      0,
                    );
                    const tax = subtotal * 0.1;
                    const platformFee = 2;
                    const total = subtotal + tax + platformFee;

                    return (
                      <>
                        <View style={styles.billRow}>
                          <Typography style={styles.billLabel}>
                            Subtotal
                          </Typography>
                          <Typography style={styles.billValue}>
                            ${subtotal.toFixed(2)}
                          </Typography>
                        </View>
                        <View style={styles.billRow}>
                          <Typography style={styles.billLabel}>
                            Taxes (10%)
                          </Typography>
                          <Typography style={styles.billValue}>
                            ${tax.toFixed(2)}
                          </Typography>
                        </View>
                        <View style={styles.billRow}>
                          <Typography style={styles.billLabel}>
                            Platform Fee
                          </Typography>
                          <Typography style={styles.billValue}>
                            ${platformFee.toFixed(2)}
                          </Typography>
                        </View>
                        <View style={styles.amountDueContainer}>
                          <Typography style={styles.amountLabel}>
                            Total Due:
                          </Typography>
                          <Typography style={styles.amountValue}>
                            ${total.toFixed(2)}
                          </Typography>
                        </View>
                      </>
                    );
                  })()}
                </>
              )}
            </ScrollView>
            <CustomButton
            style={{width: '100%'}}
              onPress={() => {
                console.log('Payment initiated for', selectedAppointment?.id);
                setModalVisible(false);
              }}
              title={'Pay Now'}
            />
            <CustomButton
              style={{
                backgroundColor: 'white',
                borderWidth: 1,
                borderColor: 'gray',
                marginTop: 10,
                width: '100%'
              }}
              textStyle={{color: 'gray'}}
              onPress={() => {
                setModalVisible(false);
              }}
              title={'Cancel'}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PayBill;

const styles = StyleSheet.create({
  sheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLOR.primary,
    textAlign: 'center',
  },
  bookingCard: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  bookingLabel: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 5,
  },
  bookingValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: '50%',
    maxHeight: '80%',
  },
  scrollView: {
    marginVertical: 10,
  },
  bookingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  billLabel: {
    fontSize: 14,
    color: '#555',
  },
  billValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  amountDueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
    marginTop: 10,
  },
  amountLabel: {
    fontSize: 18,
    color: 'gray',
  },
  amountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLOR.primary,
  },
  payButton: {
    backgroundColor: COLOR.primary,
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
  },
  cancelButtonText: {
    color: 'gray',
    fontSize: 16,
  },
  salonImage: {
    width: '100%',
    height: 140,
    borderRadius: 10,
    marginBottom: 10,
  },
  salonName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLOR.primary,
    marginBottom: 4,
  },
  salonRating: {
    fontSize: 14,
    color: COLOR.textSecondary,
    marginBottom: 2,
  },
  salonTagline: {
    fontSize: 14,
    color: COLOR.grey,
    marginBottom: 8,
  },
  amountDue: {
    color: COLOR.primary,
    fontWeight: 'bold',
  },
});
