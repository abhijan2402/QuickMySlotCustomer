import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  SafeAreaView,
} from 'react-native';
import { COLOR } from '../../../Constants/Colors';
import { Font } from '../../../Constants/Font';

const { width } = Dimensions.get('window');

const CouponCarousel = ({ promoData, cashbackPercentage, title = "Offers available for you" }) => {

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const coupons = [
    {
      id: 1,
      title: 'Get 20% OFF',
      description: '10% Discount + 10% Cashback',
    },
    {
      id: 2,
      title: 'Summer Special Deal',
      description: '15% OFF on all items',
    },
    {
      id: 3,
      title: 'Free Shipping',
      description: 'On orders above $50',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % coupons.length;
      setCurrentIndex(nextIndex);

      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: nextIndex * width,
          animated: true,
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{title}</Text>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={true} // allow manual scrolling
        onMomentumScrollEnd={event => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / width,
          );
          setCurrentIndex(newIndex);
        }}>
        {/* {promoData.map((coupon, index) => ( */}
        <View style={styles.card}>
          <View style={styles.contentRow}>
            <Image
              source={require('../../../assets/Images/discount.png')}
              style={styles.icon}
            />
            <View style={styles.textContainer}>
              <Text style={styles.title}>
                Total discount upto{' '}
                {cashbackPercentage
                  ? Number(cashbackPercentage.replace('%', '')) + 20
                  : 20}
                %
              </Text>

              <Text style={styles.description}>
                {cashbackPercentage != "0"
                  ? `${cashbackPercentage} discount + Cashback upto 20%`
                  : 'Cashback upto 20%'}
              </Text>
            </View>

            {/* <Text style={styles.title}>{coupons.promo_code}</Text> */}
            {/* <Text style={styles.description}>{coupons?.type}{' '}₹{coupons.amount} + {cashbackPercentage} Cashback</Text> */}

            {/* Pagination section */}
            {promoData.length > 1 && <View style={styles.pageInfo}>
              <Text style={styles.pageText}>
                {currentIndex + 1}/{promoData.length}
              </Text>
              <View style={styles.dots}>
                {promoData.map((_, dotIndex) => (
                  <View
                    key={dotIndex}
                    style={[
                      styles.dot,
                      dotIndex === currentIndex && styles.dotActive,
                    ]}
                  />
                ))}
              </View>
            </View>}
          </View>
        </View>
        {/* ))} */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // paddingTop: 20,
    marginBottom: 5,
  },
  header: {
    fontSize: 17,
    fontFamily: Font.semibold,
    marginHorizontal: 20,
    marginBottom: 5,
    color: '#000',
  },
  card: {
    width: width - 40,
    marginHorizontal: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLOR.primary
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,

  },
  title: {
    fontSize: 14,
    color: '#000',
    fontFamily: Font.semibold,
  },
  description: {
    fontSize: 13,
    color: COLOR.primary,
    marginTop: 2,
    fontFamily: Font.medium,
  },
  pageInfo: {
    alignItems: 'flex-end',
  },
  pageText: {
    fontSize: 13,
    color: COLOR.primary,
    fontFamily: Font.mediumd,
  },
  dots: {
    flexDirection: 'row',
    marginTop: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ccc',
    marginHorizontal: 2,
  },
  dotActive: {
    backgroundColor: COLOR.primary,
  },
});

export default CouponCarousel;
