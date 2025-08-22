import React, {useRef, useMemo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import {COLOR} from '../Constants/Colors';

const CustomBarButton = () => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);
  const handleOpenSheet = () => {
    bottomSheetRef.current?.expand();
  };
  const handleCloseSheet = () => {
    bottomSheetRef.current?.close();
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
        onPress={handleOpenSheet}>
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
      
      {/* Bottom Sheet */}
     
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
  bottomSheetContent: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLOR.primary,
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
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