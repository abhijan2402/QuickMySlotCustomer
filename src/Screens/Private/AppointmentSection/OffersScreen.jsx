import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import HomeHeader from '../../../Components/HomeHeader';
import { COLOR } from '../../../Constants/Colors';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Typography } from '../../../Components/UI/Typography';
import Input from '../../../Components/Input';
import { Font } from '../../../Constants/Font';
import { GET_WITH_TOKEN } from '../../../Backend/Api';
import {
  HIGHLIGHTED_PROMO_CODE,
  PROMO_VENDOR,
} from '../../../Constants/ApiRoute';
import CartModal from '../../../Components/CartModal';

const OffersScreen = ({ navigation, route }) => {
  const businessId = route?.params?.businessId || null;
  console.log('businessId--->', businessId);

  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const [promoData, setPromoData] = useState([]);

  useEffect(() => {
    if (isFocused) {
      getPromo();
    }
  }, [isFocused]);

  const getPromo = () => {
    setLoading(true);
    GET_WITH_TOKEN(
      businessId ? PROMO_VENDOR + businessId : HIGHLIGHTED_PROMO_CODE,
      success => {
        setPromoData(success?.data || []);
        setLoading(false);
      },
      error => {
        setLoading(false);
        console.log(error);
      },
      fail => {
        setLoading(false);
        console.log(fail);
      },
    );
  };

  // Format date to readable format
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Check if offer is active based on dates
  const isOfferActive = offer => {
    const now = new Date();
    const startDate = new Date(offer.start_on);
    const endDate = new Date(offer.expired_on);
    return now >= startDate && now <= endDate && offer.isActive;
  };

  // Generate offer title based on type and amount
  const getOfferTitle = offer => {
    if (offer.type === 'flat') {
      return `Get ₹${offer.amount} OFF`;
    } else if (offer.type === 'percentage') {
      return `Get ${offer.amount}% OFF`;
    }
    return `Get ${offer.amount} OFF`;
  };

  // Generate discount description
  const getDiscountDescription = offer => {
    if (offer.type === 'flat') {
      return `Flat ₹${offer.amount} discount on total bill`;
    } else if (offer.type === 'percentage') {
      return `${offer.amount}% discount on total bill`;
    }
    return offer.description || 'Special discount offer';
  };

  // Generate validity text
  const getValidityText = offer => {
    const start = formatDate(offer.start_on);
    const end = formatDate(offer.expired_on);
    return `Valid from ${start} to ${end}`;
  };

  return (
    <View style={styles.mainContainer}>
      <HomeHeader
        title="Available Offers"
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.primary}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* How to Avail Offer Section */}
        {!businessId && (
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
        )}

        {/* Coupon Input */}
        {/* <View style={{marginHorizontal: 5, marginBottom: 20}}>
          <Input
            label="Offers available for you"
            placeholder="Enter Coupon Code"
            style={{borderColor: COLOR.primary}}
            labelStyle={{fontFamily: Font.semibold}}
          />
        </View> */}

        {/* Loading State */}
        {loading && (
          <View style={styles.loadingContainer}>
            <Typography style={styles.loadingText}>
              Loading offers...
            </Typography>
          </View>
        )}

        {/* No Offers State */}
        {!loading && promoData.length === 0 && (
          <View style={styles.noOffersContainer}>
            <Typography style={styles.noOffersText}>
              No offers available at the moment
            </Typography>
          </View>
        )}

        {/* Dynamic Offers List */}
        {!loading &&
          promoData.map((offer, index) => (
            <View
              key={offer.id}
              style={[
                styles.card,
                !isOfferActive(offer) && styles.inactiveCard,
              ]}>
              <View style={styles.cardHeader}>
                <Typography style={styles.code}>{offer.promo_code}</Typography>
                {isOfferActive(offer) && businessId && (
                  <TouchableOpacity
                    onPress={() => {
                      getSelectedOffer(offer);
                      navigation.goBack();
                    }}
                    style={{
                      padding: 6,
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: isOfferActive(offer)
                        ? COLOR.primary
                        : '#ccc',
                    }}
                    disabled={!isOfferActive(offer)}>
                    <Typography
                      style={[
                        styles.apply,
                        !isOfferActive(offer) && styles.disabledApply,
                      ]}>
                      {isOfferActive(offer) ? 'APPLY' : 'EXPIRED'}
                    </Typography>
                  </TouchableOpacity>
                )}
              </View>

              {/* Status Badge */}
              {!isOfferActive(offer) && (
                <View style={styles.expiredBadge}>
                  <Typography style={styles.expiredText}>
                    Offer Expired
                  </Typography>
                </View>
              )}

              <Typography style={styles.offerTitle}>
                {getOfferTitle(offer)}
              </Typography>
              <Typography style={styles.discount}>
                {getDiscountDescription(offer)}
              </Typography>
              <Typography style={styles.days}>
                {getValidityText(offer)}
              </Typography>
              <Typography style={styles.description}>
                {offer.description ||
                  'Special discount offer for our valued customers.'}
              </Typography>

              {offer.extra_text && (
                <Typography style={styles.extraText}>
                  {offer.extra_text}
                </Typography>
              )}

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Cms', {
                    title: 'Terms & Conditions',
                    slug: 'terms-condition',
                  });
                }}>
                <Typography style={styles.tnc}>T&C +</Typography>
              </TouchableOpacity>
            </View>
          ))}

        <View style={{ height: 50 }} />

      </ScrollView>
      <CartModal />
    </View>
  );
};

export default OffersScreen;

const styles = StyleSheet.create({
  /** MAIN LAYOUT */
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingBottom: 0,
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },

  /** Info Box */
  infoBox: {
    backgroundColor: '#f1f6ff',
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

  /** Loading & No Offers */
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontFamily: Font.medium,
    color: COLOR.primary,
    fontSize: 16,
  },
  noOffersContainer: {
    alignItems: 'center',
    padding: 40,
  },
  noOffersText: {
    fontFamily: Font.medium,
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
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
    position: 'relative',
  },
  inactiveCard: {
    backgroundColor: '#f5f5f5',
    borderColor: '#d0d0d0',
    opacity: 0.7,
  },

  /** Card Header */
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
  disabledApply: {
    color: '#999',
  },

  /** Status Badge */
  expiredBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  expiredText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: Font.semibold,
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
  extraText: {
    fontFamily: Font.regular,
    color: '#666',
    marginBottom: 6,
    fontSize: 12,
    fontStyle: 'italic',
  },
  tnc: {
    color: COLOR.primary,
    fontFamily: Font.medium,
    fontSize: 13,
  },
});
