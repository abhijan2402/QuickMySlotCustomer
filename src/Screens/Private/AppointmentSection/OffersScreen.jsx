import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import HomeHeader from '../../../Components/HomeHeader';
import {COLOR} from '../../../Constants/Colors';
import {useNavigation} from '@react-navigation/native';
import {Typography} from '../../../Components/UI/Typography';
import Input from '../../../Components/Input';

const offers = [
  {
    code: 'FIRST40',
    title: 'Get 40% OFF',
    discount: '20% Discount + 20% Cashback',
    days: 'Valid on All Days',
    description:
      'After availing your services, pay at the salon using app via any mode of online payment and get 20% Discount & 20% Cashback as Cash on the net payable amount.',
  },
  {
    code: 'WEEKEND10',
    title: 'Get 10% OFF',
    discount: '5% Discount + 5% Cashback',
    days: 'Valid on Friday, Saturday, and Sunday',
    description:
      'After availing your services, pay at the salon using app via any mode of online payment and get 5% Discount & 5% Cashback as Cash on the net payable amount.',
  },
  {
    code: 'GLAMUP40',
    title: 'Get 40% OFF',
    discount: '25% Discount + 15% Cashback',
    days: 'Valid on Tuesday',
    description:
      'After availing your services, pay at the salon using app via any mode of online payment and get 25% Discount & 15% Cashback as Cash on the net payable amount.',
  },
];

export default function OffersScreen() {
  const navigation = useNavigation();
  return (
    <ScrollView style={styles.container}>
      <HomeHeader
        title="Available Offers"
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.primary}
      />
      <View style={{marginHorizontal: 5, marginBottom: 20}}>
        <Input
          label="Offers available for you"
          placeholder="Enter Coupon Code"
          style={{borderColor: COLOR.primary}}
        />
      </View>

      {offers.map((offer, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.cardHeader}>
            <Typography style={styles.code}>{offer.code}</Typography>
            <TouchableOpacity>
              <Typography style={styles.apply}>APPLY</Typography>
            </TouchableOpacity>
          </View>

          <Typography style={styles.title}>{offer.title}</Typography>
          <Typography style={styles.discount}>{offer.discount}</Typography>
          <Typography style={styles.days}>{offer.days}</Typography>
          <Typography style={styles.description}>
            {offer.description}
          </Typography>

          <TouchableOpacity>
            <Typography style={styles.tnc}>T&C +</Typography>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  subHeading: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '500',
    marginTop: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    marginHorizontal: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  code: {
    backgroundColor: '#d0e7ff',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    fontWeight: '600',
    color: '#005fa3',
  },
  apply: {
    color: '#007BFF',
    fontWeight: '600',
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 4,
  },
  discount: {
    color: 'green',
    fontWeight: '600',
    marginBottom: 4,
  },
  days: {
    fontWeight: '500',
    color: '#555',
    marginBottom: 4,
  },
  description: {
    color: '#333',
    marginBottom: 6,
  },
  tnc: {
    color: '#007BFF',
    fontWeight: '500',
  },
});
