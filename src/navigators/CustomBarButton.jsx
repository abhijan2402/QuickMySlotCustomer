import React, {useRef, useMemo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image, Modal, ScrollView} from 'react-native';
import {COLOR} from '../Constants/Colors';

const CustomBarButton = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const bookingData = {
    bookingId: 'BK123456',
    amountDue: '$150.00',
    dueDate: '2023-12-15',
    service: 'Hotel Booking',
    room: 'Deluxe Suite',
    nights: 3,
    checkIn: '2023-12-10',
    checkOut: '2023-12-13'
  };

  const handlePayBillPress = () => {
    setIsModalVisible(true);
    // If using BottomSheet component instead of Modal:
    // bottomSheetRef.current?.expand();
  };

  const handleClose = () => {
    setIsModalVisible(false);
    // If using BottomSheet component instead of Modal:
    // bottomSheetRef.current?.close();
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.99}
        style={{
          top: -20,
          justifyContent: 'center',
          alignItems: 'center',
          ...styles.shadow,
        }}
        onPress={handlePayBillPress}>
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: COLOR.primary,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 5,
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 12,
            }}>
            Pay Bill
          </Text>
        </View>
      </TouchableOpacity>
      
      {/* Modal for showing booking details */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.sheetTitle}>Payment Details</Text>
            
            <ScrollView style={styles.scrollView}>
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingLabel}>Booking ID:</Text>
                <Text style={styles.bookingValue}>{bookingData.bookingId}</Text>
              </View>
              
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingLabel}>Service:</Text>
                <Text style={styles.bookingValue}>{bookingData.service}</Text>
              </View>
              
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingLabel}>Room Type:</Text>
                <Text style={styles.bookingValue}>{bookingData.room}</Text>
              </View>
              
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingLabel}>Nights:</Text>
                <Text style={styles.bookingValue}>{bookingData.nights}</Text>
              </View>
              
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingLabel}>Check-in:</Text>
                <Text style={styles.bookingValue}>{bookingData.checkIn}</Text>
              </View>
              
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingLabel}>Check-out:</Text>
                <Text style={styles.bookingValue}>{bookingData.checkOut}</Text>
              </View>
              
              <View style={styles.amountDueContainer}>
                <Text style={styles.amountLabel}>Amount Due:</Text>
                <Text style={styles.amountValue}>{bookingData.amountDue}</Text>
              </View>
              
              <View style={styles.dueDateContainer}>
                <Text style={styles.dueDateLabel}>Due Date:</Text>
                <Text style={styles.dueDateValue}>{bookingData.dueDate}</Text>
              </View>
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.payButton}
              onPress={() => {
                // Handle payment logic here
                console.log('Payment initiated');
                handleClose();
              }}
            >
              <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Alternative using Bottom Sheet component (if you prefer) */}
      {/* 
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
      >
        <View style={styles.bottomSheetContent}>
          // Same content as the modal
        </View>
      </BottomSheet>
      */}
    </>
  );
};

export default CustomBarButton;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
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
  sheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLOR.primary,
    textAlign: 'center',
  },
  bookingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  bookingLabel: {
    fontSize: 16,
    color: 'gray',
  },
  bookingValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  amountDueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
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
  dueDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 25,
  },
  dueDateLabel: {
    fontSize: 16,
    color: 'gray',
  },
  dueDateValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  payButton: {
    backgroundColor: COLOR.primary,
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
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
});