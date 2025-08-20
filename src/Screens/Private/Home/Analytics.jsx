import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import {COLOR} from '../../../Constants/Colors';
import HomeHeader from '../../../Components/HomeHeader';

const {width} = Dimensions.get('window');

const MyAnalytics = ({navigation}) => {
  return (
    <View style={styles.container}>
      <HomeHeader
        title="My Analytics"
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.black}
      />

      <ScrollView contentContainerStyle={{padding: 15}}>
        {/* Spending & Savings */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Spending & Savings</Text>

          <View style={styles.grid}>
            <View style={styles.box}>
              <Text style={styles.amount}>$245.00</Text>
              <Text style={styles.label}>Spent This Month</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.amount}>$45.00</Text>
              <Text style={styles.label}>Saved This Month</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.amount}>5</Text>
              <Text style={styles.label}>Total Bookings</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.amount}>3</Text>
              <Text style={styles.label}>Favorite Providers</Text>
            </View>
          </View>
        </View>

        {/* Cashback Banner */}
        <View style={styles.cashbackCard}>
          <Text style={styles.cashbackAmount}>$12.50</Text>
          <Text style={styles.cashbackText}>
            Cashback Earned This Month{'\n'}from wallet recharges and bookings!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default MyAnalytics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
    // marginHorizontal :15
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    // padding: 15,
    backgroundColor: COLOR.white,
    justifyContent: 'space-between',
  },
  backArrow: {
    fontSize: 20,
    color: COLOR.black,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLOR.black,
  },
  profileCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLOR.lightGrey,
  },
  card: {
    backgroundColor: COLOR.white,
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: COLOR.lightGrey,
    marginBottom: 15,
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 10,
    color: COLOR.black,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  box: {
    width: (width - 60) / 2.5,
    borderWidth: 1,
    borderColor: COLOR.lightGrey,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  amount: {
    color: COLOR.primary || '#8E44AD',
    fontWeight: 'bold',
    fontSize: 16,
  },
  label: {
    color: COLOR.black,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  cashbackCard: {
    backgroundColor: COLOR.primary || '#8E44AD',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cashbackAmount: {
    color: COLOR.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  cashbackText: {
    color: COLOR.white,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
});
