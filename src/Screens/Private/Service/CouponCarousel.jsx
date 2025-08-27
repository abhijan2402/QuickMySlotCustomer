import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  SafeAreaView,
} from 'react-native';

const {width} = Dimensions.get('window');

const CouponCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const coupons = [
    {
      id: 1,
      title: 'Get 20% OFF',
      description: '10% Discount + 10% Cashback',
      // icon: require('./assets/discount-icon.png'), // Add your local icon here
    },
    {
      id: 2,
      title: 'Summer Special Deal',
      description: '15% OFF on all items',
      // icon: require('./assets/discount-icon.png'),
    },
    {
      id: 3,
      title: 'Free Shipping',
      description: 'On orders above $50',
      // icon: require('./assets/discount-icon.png'),
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
      <Text style={styles.header}>Offers available for you</Text>
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
        {coupons.map((coupon, index) => (
          <View key={coupon.id} style={styles.card}>
            <View style={styles.contentRow}>
              <Image
                source={require('../../../assets/Images/discount.png')}
                style={styles.icon}
              />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{coupon.title}</Text>
                <Text style={styles.description}>{coupon.description}</Text>
              </View>

              {/* Pagination section */}
              <View style={styles.pageInfo}>
                <Text style={styles.pageText}>
                  {currentIndex + 1}/{coupons.length}
                </Text>
                <View style={styles.dots}>
                  {coupons.map((_, dotIndex) => (
                    <View
                      key={dotIndex}
                      style={[
                        styles.dot,
                        dotIndex === currentIndex && styles.dotActive,
                      ]}
                    />
                  ))}
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // paddingTop: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 20,
    marginBottom: 15,
    color: '#000',
  },
  card: {
    width: width - 40,
    marginHorizontal: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  pageInfo: {
    alignItems: 'flex-end',
  },
  pageText: {
    fontSize: 13,
    color: '#007bff',
    fontWeight: '500',
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
    backgroundColor: '#007bff',
  },
});

export default CouponCarousel;
