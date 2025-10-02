import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import {COLOR} from '../../../Constants/Colors';
import HomeHeader from '../../../Components/HomeHeader';
import {Typography} from '../../../Components/UI/Typography';
import {Font} from '../../../Constants/Font';
import {useIsFocused} from '@react-navigation/native';
import {GET_ANALYTICS} from '../../../Constants/ApiRoute';
import {GET_WITH_TOKEN} from '../../../Backend/Api';
import {CURRENCY} from '../../../Backend/Utility';

const {width} = Dimensions.get('window');

const MyAnalytics = ({navigation}) => {
  const [data, setData] = useState();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isFocused) {
      getBookingList();
    }
  }, [isFocused]);

  const getBookingList = () => {
    setLoading(true);
    GET_WITH_TOKEN(
      GET_ANALYTICS,
      success => {
        console.log(success?.data, 'analytics--->>');
        setData(success?.data);
        setLoading(false);
      },
      error => {
        setLoading(false);
        console.log(success);
      },
      fail => {
        setLoading(false);
        console.log(fail);
      },
    );
  };
  return (
    <View style={styles.container}>
      <HomeHeader
        title="My Analytics"
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.black}
      />

      <ScrollView
        contentContainerStyle={{paddingHorizontal: 10, paddingVertical: 15}}>
        {/* Spending & Savings */}
        <View style={styles.card}>
          <Typography style={styles.sectionTitle}>
            Spending & Savings
          </Typography>

          <View style={styles.grid}>
            <View style={styles.box}>
              <Typography style={styles.amount}>
                {CURRENCY}
                {data?.spend_this_month || '0.00'}
              </Typography>
              <Typography style={styles.label}>Spent This Month</Typography>
            </View>
            <View style={styles.box}>
              <Typography style={styles.amount}>
                {CURRENCY}
                {data?.saved_this_month || '0.00'}
              </Typography>
              <Typography style={styles.label}>Saved This Month</Typography>
            </View>
            <View style={styles.box}>
              <Typography style={styles.amount}>
                {data?.total_bookings}
              </Typography>
              <Typography style={styles.label}>Total Bookings</Typography>
            </View>
            <View style={styles.box}>
              <Typography style={styles.amount}>
                {data?.favorite_providers || '0'}
              </Typography>
              <Typography style={styles.label}>Favorite Providers</Typography>
            </View>
          </View>
        </View>
        {/* Cashback Banner */}
        <View style={styles.cashbackCard}>
          <Typography style={styles.cashbackAmount}>
            {CURRENCY}
            {data?.cashback_earned || '0.00'}
          </Typography>
          <Typography style={styles.cashbackText}>
            Cashback Earned This Month{'\n'}from wallet recharges and bookings!
          </Typography>
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
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontFamily: Font.semibold,
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
    fontFamily: Font.semibold,
    fontSize: 16,
  },
  label: {
    color: COLOR.black,
    fontSize: 12,
    textAlign: 'center',
    fontFamily: Font.medium,
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
    fontFamily: Font.bold,
  },
  cashbackText: {
    color: COLOR.white,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    fontFamily: Font.medium,
  },
});
