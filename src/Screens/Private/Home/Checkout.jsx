import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {COLOR} from '../../../Constants/Colors';
import HomeHeader from '../../../Components/HomeHeader';
import CustomButton from '../../../Components/CustomButton';

const Checkout = ({navigation}) => {
  const [selectedPayment, setSelectedPayment] = useState('card');

  const paymentOptions = [
    {id: 'card', label: 'Credit/Debit Card', icon: '💳'},
    {id: 'upi', label: 'UPI', icon: '💲'},
    {id: 'gpay', label: 'Google Pay', icon: '🅶'},
    {id: 'after', label: 'Pay After Service', icon: '💵'},
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <HomeHeader
        title="Checkout"
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.primary}
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={{padding: 16}}>
        {/* Service Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Service details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Service:</Text>
            <Text style={styles.value}>Haircut</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>Duration:</Text>
            <Text style={styles.value}>1 Hour</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>Date & Time:</Text>
            <Text style={styles.value}>June 10, 2025, 2 PM</Text>
          </View>
        </View>

        {/* Provider Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Provider Details</Text>
          <View style={styles.providerRow}>
            <Image
              source={{
                uri: 'https://www.shutterstock.com/image-photo/portrait-pretty-relaxed-young-woman-600nw-2478831041.jpg',
              }}
              style={styles.providerIcon}
            />
            <View>
              <Text style={styles.providerName}>Glamour Touch Salon</Text>
              <Text style={styles.rating}>⭐ 3.5</Text>
              <Text style={styles.providerDesc}>Luxury salon services</Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        {/* <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Method</Text>
          {paymentOptions.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.paymentOption,
                selectedPayment === item.id && styles.paymentSelected,
              ]}
              onPress={() => setSelectedPayment(item.id)}>
              <Text style={styles.radio}>
                {selectedPayment === item.id ? '●' : '○'}
              </Text>
              <Text style={styles.paymentText}>
                {item.icon} {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View> */}
      </ScrollView>

      <CustomButton
        title={'Book Now'}
        onPress={() => navigation.navigate('BookingConfirmation')}
        style={{marginBottom: 50}}
      />
    </View>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backArrow: {fontSize: 20},
  headerTitle: {fontSize: 18, fontWeight: '600'},

  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  cardTitle: {fontSize: 14, fontWeight: '600', marginBottom: 8},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: {fontSize: 13, color: '#555'},
  value: {fontSize: 13, fontWeight: '500'},
  divider: {
    height: 1,
    backgroundColor: COLOR.primary,
    marginVertical: 4,
    opacity: 0.4,
  },

  providerRow: {flexDirection: 'row', alignItems: 'center'},
  providerIcon: {width: 36, height: 36, marginRight: 10, borderRadius: 6},
  providerName: {fontSize: 14, fontWeight: '600'},
  rating: {fontSize: 12, color: '#777'},
  providerDesc: {fontSize: 12, color: '#777'},

  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  paymentSelected: {borderColor: COLOR.primary},
  radio: {fontSize: 16, marginRight: 8},
  paymentText: {fontSize: 14},

  bookButton: {
    backgroundColor: COLOR.primary,
    padding: 16,
    alignItems: 'center',
  },
  bookText: {color: '#fff', fontSize: 16, fontWeight: '600'},
});
