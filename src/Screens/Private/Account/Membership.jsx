import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {COLOR} from '../../../Constants/Colors';
import {Typography} from '../../../Components/UI/Typography';
import {Font} from '../../../Constants/Font';
import HomeHeader from '../../../Components/HomeHeader';
import {useIsFocused} from '@react-navigation/native';
import {GET_WITH_TOKEN, POST_FORM_DATA} from '../../../Backend/Api'; // Added POST_FORM_DATA import
import {
  GET_MEMBERSHIP_LIST,
  MEMBERSHIP_CREATE_ORDER,
  MEMBERSHIP_VERIFY_PAYMENT,
} from '../../../Constants/ApiRoute';
import {useSelector} from 'react-redux';
import RazorpayCheckout from 'react-native-razorpay';
import {ToastMsg} from '../../../Backend/Utility'; // Added ToastMsg import

const {width} = Dimensions.get('window');

const Membership = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const isFocus = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false); // Separate loading for payment
  console.log(membershipPlans, 'membershipPlans------>>');
  const userdata = useSelector(store => store.userDetails);

  // Razorpay configuration
  const razorpayConfig = {
    key_id: 'rzp_test_RL1gmdHRZxYSlx',
    currency: 'INR',
    name: 'QuickMySlot',
    description: 'Membership Subscription',
  };

  useEffect(() => {
    if (isFocus) {
      getMembershipList();
    }
  }, [isFocus]);

  const getMembershipList = () => {
    setLoading(true);
    GET_WITH_TOKEN(
      GET_MEMBERSHIP_LIST,
      success => {
        console.log(JSON.stringify(success), 'successsuccesssuccess-->>>');
        setLoading(false);
        if (success?.status && success?.data) {
          setMembershipPlans(success.data);
          if (success.data.length > 0) {
            setSelectedPlan(success.data[0].id);
          }
        }
      },
      error => {
        console.log(error, 'errorerrorerror>>');
        setLoading(false);
      },
      fail => {
        console.log(fail, 'errorerrorerror>>');
        setLoading(false);
      },
    );
  };

  const createRazorpayOrder = async subscription_id => {
    try {
      const formData = new FormData();
      formData.append('subscription_id', subscription_id);
      formData.append('role', 'customer');

      const orderResponse = await new Promise((resolve, reject) => {
        POST_FORM_DATA(
          MEMBERSHIP_CREATE_ORDER,
          formData,
          success => {
            console.log('Order creation success:', success);
            resolve(success);
          },
          error => {
            console.log('Order creation error:', JSON.stringify(error));
            reject(error);
          },
          fail => {
            console.log('Order creation fail:', fail);
            reject(fail);
          },
        );
      });

      return orderResponse;
    } catch (error) {
      console.log('Order creation exception:', error);
      throw new Error('Failed to create order: ' + error.message);
    }
  };

  const verifyPayment = (paymentData, plan) => {
    console.log(plan, 'plan in verify payment');
    const formData = new FormData();
    formData.append('subscription_id', plan.id);
    formData.append('razorpay_signature', paymentData.razorpay_signature);
    formData.append('razorpay_order_id', paymentData.razorpay_order_id);
    formData.append('razorpay_payment_id', paymentData.razorpay_payment_id);
    POST_FORM_DATA(
      MEMBERSHIP_VERIFY_PAYMENT,
      formData,
      success => {
        setPaymentLoading(false);
        ToastMsg('Membership subscription successful!');
      },
      error => {
        console.log(error, 'Membership verification error>>');

        setPaymentLoading(false);
        ToastMsg('Payment verification failed. Please contact support.');
      },
      fail => {
        setPaymentLoading(false);
        ToastMsg('Network error. Please try again.');
      },
    );
  };

  const initiateRazorpayPayment = async plan => {
    setPaymentLoading(true);
    try {
      // Step 1: Create Razorpay order on your backend
      const orderData = await createRazorpayOrder(plan.id);

      // Check the response structure
      const orderId =
        orderData?.order_id || orderData?.data?.order_id || orderData?.data?.id;

      if (!orderId) {
        console.log('Order data received:', orderData);
        throw new Error(
          'Failed to create payment order - no order ID received',
        );
      }

      // Convert price to paise (Razorpay expects amount in smallest currency unit)
      const amountInPaise = Math.round(parseFloat(plan.price) * 100);

      // Step 2: Initialize Razorpay checkout
      const options = {
        description: `Membership: ${plan.subscription_name}`,
        image: 'https://your-app-logo.png', // Your app logo
        currency: razorpayConfig.currency,
        key: razorpayConfig.key_id,
        amount: amountInPaise,
        name: razorpayConfig.name,
        order_id: orderId,
        prefill: {
          email: userdata?.email || 'user@example.com',
          contact: userdata?.phone_number || '9999999999',
          name: userdata?.name || 'User',
        },
        theme: {color: COLOR.primary},
      };

      console.log('Razorpay options:', options);

      // Step 3: Open Razorpay checkout
      RazorpayCheckout.open(options)
        .then(data => {
          // Payment successful
          console.log('Payment Success:', data);

          // Step 4: Verify payment on your backend
          verifyPayment(
            {
              razorpay_payment_id: data.razorpay_payment_id,
              razorpay_order_id: data.razorpay_order_id,
              razorpay_signature: data.razorpay_signature,
            },
            plan,
          );
        })
        .catch(error => {
          setPaymentLoading(false);
          console.log('Razorpay Payment Error:', error);

          // Handle different error cases
          if (error.code === 2) {
            // Payment cancelled by user
            ToastMsg('Payment was cancelled');
          } else if (error.code === 0) {
            // Network error
            ToastMsg('Network error. Please check your connection.');
          } else {
            // Other errors
            ToastMsg(error.description || 'Payment failed. Please try again.');
          }
        });
    } catch (error) {
      setPaymentLoading(false);
      console.log('Razorpay Init Error:', error);
      ToastMsg(
        error.message || 'Failed to initialize payment. Please try again.',
      );
    }
  };

  const handleSubscribe = plan => {
    Alert.alert(
      'Confirm Subscription',
      `Are you sure you want to subscribe to ${plan.subscription_name} for ₹${plan.price}/${plan.validity}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Subscribe',
          onPress: () => {
            initiateRazorpayPayment(plan);
          },
        },
      ],
    );
  };

  // Function to parse features from the extra field
  const parseFeatures = plan => {
    const features = [];

    // Add features from extra array
    if (plan.extra && Array.isArray(plan.extra)) {
      plan.extra.forEach(feature => {
        if (
          feature &&
          typeof feature === 'string' &&
          feature !== plan.extra?.key_word
        ) {
          features.push(feature);
        }
      });
    }

    // Add description as a feature
    if (plan.description) {
      features.push(plan.description);
    }

    // Add key_word if available
    if (plan.extra?.key_word) {
      features.push(`${plan.extra.key_word} Focus`);
    }

    return features;
  };

  // Function to get period display text
  const getPeriodDisplay = validity => {
    switch (validity) {
      case 'monthly':
        return 'mo';
      case 'yearly':
        return 'yr';
      case 'weekly':
        return 'wk';
      default:
        return validity;
    }
  };

  const PlanCard = ({plan, index}) => {
    const features = parseFeatures(plan);
    const isPopular = index === 1; // Mark second plan as popular, adjust as needed
    const isSelected = selectedPlan === plan.id;

    return (
      <TouchableOpacity
        style={[
          styles.planCard,
          isSelected && styles.selectedPlan,
          isPopular && styles.popularPlan,
        ]}
        onPress={() => setSelectedPlan(plan.id)}
        activeOpacity={0.8}>
        {isPopular && (
          <View style={styles.popularBadge}>
            <Typography size={12} color={COLOR.white} font={Font.semibold}>
              Most Popular
            </Typography>
          </View>
        )}

        <View style={styles.planHeader}>
          <Typography size={20} font={Font.bold} color={COLOR.black}>
            {plan.subscription_name}
          </Typography>
          <Typography size={14} color="#666" style={styles.planDescription}>
            {plan.type === 'customer' ? 'Customer Plan' : 'Business Plan'}
          </Typography>
        </View>

        <View style={styles.priceContainer}>
          <Typography size={32} font={Font.bold} color={COLOR.primary}>
            ₹{plan.price}
          </Typography>
          <Typography size={16} color="#666" style={styles.period}>
            /{getPeriodDisplay(plan.validity)}
          </Typography>
        </View>

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.checkIcon}>
                <Typography size={12} color={COLOR.white}>
                  ✓
                </Typography>
              </View>
              <Typography size={14} color="#555" style={styles.featureText}>
                {feature}
              </Typography>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.subscribeButton, isSelected && styles.selectedButton]}
          onPress={() => initiateRazorpayPayment(plan)}
          disabled={paymentLoading}>
          <Typography
            size={16}
            font={Font.semibold}
            color={isSelected ? COLOR.white : COLOR.primary}>
            {paymentLoading ? 'Processing...' : 'Subscribe Now'}
          </Typography>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <HomeHeader
          title="Upgrade Your Experience"
          leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
          leftTint={COLOR.black}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLOR.primary} />
          <Typography size={16} color="#666" style={{marginTop: 10}}>
            Loading plans...
          </Typography>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HomeHeader
        title="Upgrade Your Experience"
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.black}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Typography size={16} color="#666" style={styles.subtitle}>
            Choose the plan that suits you best. Unlock exclusive features,
            enjoy premium support, and maximize your visibility.
          </Typography>
        </View>

        <View style={styles.plansContainer}>
          {membershipPlans.length > 0 ? (
            membershipPlans.map((plan, index) => (
              <PlanCard key={plan.id} plan={plan} index={index} />
            ))
          ) : (
            <View style={styles.noPlansContainer}>
              <Typography size={16} color="#666" style={styles.noPlansText}>
                No membership plans available at the moment.
              </Typography>
            </View>
          )}
        </View>

        <View style={styles.featuresComparison}>
          <Typography
            size={18}
            font={Font.bold}
            color={COLOR.black}
            style={styles.comparisonTitle}>
            All Plans Include:
          </Typography>
          <View style={styles.comparisonFeatures}>
            <View style={styles.comparisonItem}>
              <Typography size={14} color="#555">
                ✓ Profile Visibility Boost
              </Typography>
            </View>
            <View style={styles.comparisonItem}>
              <Typography size={14} color="#555">
                ✓ Exclusive Promotions
              </Typography>
            </View>
            <View style={styles.comparisonItem}>
              <Typography size={14} color="#555">
                ✓ Priority Support
              </Typography>
            </View>
            <View style={styles.comparisonItem}>
              <Typography size={14} color="#555">
                ✓ Advanced Analytics
              </Typography>
            </View>
          </View>
        </View>

        <View style={styles.noteContainer}>
          <Typography size={12} color="#999" style={styles.noteText}>
            * All subscriptions auto-renew unless canceled 24 hours before the
            end of the current period.
          </Typography>
        </View>
      </ScrollView>
    </View>
  );
};

export default Membership;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 22,
  },
  plansContainer: {
    marginBottom: 30,
  },
  planCard: {
    backgroundColor: COLOR.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',
  },
  popularPlan: {
    borderColor: COLOR.primary,
    transform: [{scale: 1.02}],
  },
  selectedPlan: {
    borderColor: COLOR.primary,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    backgroundColor: COLOR.primary,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    zIndex: 1,
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  planDescription: {
    textAlign: 'center',
    marginTop: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  period: {
    marginBottom: 6,
    marginLeft: 4,
  },
  featuresContainer: {
    marginBottom: 25,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLOR.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  featureText: {
    flex: 1,
  },
  subscribeButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLOR.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedButton: {
    backgroundColor: COLOR.primary,
  },
  featuresComparison: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  comparisonTitle: {
    textAlign: 'center',
    marginBottom: 15,
  },
  comparisonFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  comparisonItem: {
    width: '48%',
    marginBottom: 10,
  },
  noteContainer: {
    paddingHorizontal: 10,
  },
  noteText: {
    textAlign: 'center',
    lineHeight: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPlansContainer: {
    alignItems: 'center',
    padding: 40,
  },
  noPlansText: {
    textAlign: 'center',
  },
});
