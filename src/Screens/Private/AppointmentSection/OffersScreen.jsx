import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import HomeHeader from '../../../Components/HomeHeader';
import {COLOR} from '../../../Constants/Colors';
import {useNavigation} from '@react-navigation/native';
import {Typography} from '../../../Components/UI/Typography';
import Input from '../../../Components/Input';
import {Font} from '../../../Constants/Font'; // <-- Assuming font constants

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
    <View style={styles.mainContainer}>
      <HomeHeader
        title="Available Offers"
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.primary}
      />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false} // Hides scroll bar
      >
        {/* How to Avail Offer Section */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>How to avail the offer?</Text>

          <View style={styles.steps}>
            <View style={styles.stepCard}>
              <Text style={styles.stepTitle}>STEP 1</Text>
              <Text style={styles.stepText}>
                Book your appointment{'\n'}via the app
              </Text>
            </View>

            <View style={styles.stepCard}>
              <Text style={styles.stepTitle}>STEP 2</Text>
              <Text style={styles.stepText}>
                Go and avail the{'\n'}services
              </Text>
            </View>

            <View style={styles.stepCard}>
              <Text style={styles.stepTitle}>STEP 3</Text>
              <Text style={styles.stepText}>
                Pay bill with app{'\n'}to avail the offer
              </Text>
            </View>
          </View>
        </View>

        {/* Coupon Input */}
        <View style={{marginHorizontal: 5, marginBottom: 20}}>
          <Input
            label="Offers available for you"
            placeholder="Enter Coupon Code"
            style={{borderColor: COLOR.primary}}
            labelStyle={{fontFamily: Font.semibold}}
          />
        </View>

        {/* Offers List */}
        {offers.map((offer, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              <Typography style={styles.code}>{offer.code}</Typography>
              <TouchableOpacity>
                <Typography style={styles.apply}>APPLY</Typography>
              </TouchableOpacity>
            </View>

            <Typography style={styles.offerTitle}>{offer.title}</Typography>
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

        <View style={{height: 50}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  /** MAIN LAYOUT */
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    paddingBottom: 0,
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },

  /** Info Box */
  infoBox: {
    backgroundColor: '#f1f6ff',
    // padding: 20,
    borderRadius: 16,
    paddingVertical: 20,
    margin: 16,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#d8e4ff',
  },
  infoTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: Font.bold,
    marginBottom: 20,
    color: '#222',
  },
  steps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepCard: {
    // flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 4,
    paddingVertical: 16,
    paddingHorizontal: 5,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e6e6e6',
    elevation: 2,
    width: '30%',
  },
  stepTitle: {
    fontSize: 14,
    fontFamily: Font.bold,
    color: COLOR.primary,
    marginBottom: 6,
  },
  stepText: {
    fontSize: 13,
    textAlign: 'center',
    fontFamily: Font.regular,
    color: '#333',
    lineHeight: 18,
  },

  /** Offer Card */
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
    fontFamily: Font.semibold,
    color: '#005fa3',
    fontSize: 13,
  },
  apply: {
    color: COLOR.primary,
    fontFamily: Font.semibold,
    fontSize: 14,
  },

  /** Offer Details */
  offerTitle: {
    fontFamily: Font.bold,
    fontSize: 16,
    marginBottom: 4,
    color: '#222',
  },
  discount: {
    color: 'green',
    fontFamily: Font.semibold,
    marginBottom: 4,
    fontSize: 14,
  },
  days: {
    fontFamily: Font.semibold,
    color: '#555',
    marginBottom: 4,
    fontSize: 13,
  },
  description: {
    fontFamily: Font.regular,
    color: '#333',
    marginBottom: 6,
    fontSize: 13,
  },
  tnc: {
    color: COLOR.primary,
    fontFamily: Font.medium,
    fontSize: 13,
  },
});
