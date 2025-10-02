import React, {useState} from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Text,
} from 'react-native';
import Input from '../../../Components/Input';
import {COLOR} from '../../../Constants/Colors';
import HomeHeader from '../../../Components/HomeHeader';
import {validators} from '../../../Backend/Validator';
import {isValidForm, ToastMsg} from '../../../Backend/Utility';
import useKeyboard from '../../../Constants/Utility';
import Button from '../../../Components/UI/Button';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  ADD_WALLET,
  CREATE_RAZORPAY_ORDER,
  WALLET_VERIFY,
} from '../../../Constants/ApiRoute'; // Changed to CREATE_RAZORPAY_ORDER
import {POST_FORM_DATA} from '../../../Backend/Api';
import {useSelector} from 'react-redux';
import RazorpayCheckout from 'react-native-razorpay';

const AddAmount = ({navigation, route}) => {
  const [amount, setAmount] = useState('');
  const {isKeyboardVisible} = useKeyboard();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const userdata = useSelector(store => store.userDetails);

  // Razorpay configuration (Remove key_secret from frontend!)
  const razorpayConfig = {
    key_id: 'rzp_test_RL1gmdHRZxYSlx', // Only key_id should be in frontend
    currency: 'INR',
    name: 'QuickMySlot',
    description: 'Add Amount to Wallet',
  };

  const createRazorpayOrder = async amount => {
    try {
      const formData = new FormData();
      formData.append('amount', amount); 
      const orderResponse = await new Promise((resolve, reject) => {
        POST_FORM_DATA(
          ADD_WALLET, 
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

  const verifyPayment = paymentData => {
    const formData = new FormData();
    formData.append('amount', amount);
    formData.append('razorpay_signature', paymentData.razorpay_signature);
    formData.append('razorpay_order_id', paymentData.razorpay_order_id);
    formData.append('razorpay_payment_id', paymentData.razorpay_payment_id);

    POST_FORM_DATA(
      WALLET_VERIFY, // This should be your payment verification endpoint
      formData,
      success => {
        setLoading(false);
        ToastMsg('Amount added to wallet successfully!');
        navigation.goBack();
      },
      error => {
        setError(prev => ({
          ...prev,
          AmountType: error?.data?.message || 'Payment verification failed',
        }));
        setLoading(false);
        ToastMsg('Payment verification failed. Please contact support.');
      },
      fail => {
        setLoading(false);
        ToastMsg('Network error. Please try again.');
      },
    );
  };

  const initiateRazorpayPayment = async () => {
    if (!amount || amount <= 0) {
      ToastMsg('Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create Razorpay order on your backend
      const orderData = await createRazorpayOrder(amount);

      // Check the response structure - it might be nested in data property
      const orderId = orderData?.order_id || orderData?.data?.order_id;

      if (!orderId) {
        console.log('Order data received:', orderData);
        throw new Error(
          'Failed to create payment order - no order ID received',
        );
      }

      // Step 2: Initialize Razorpay checkout
      const options = {
        description: 'Wallet Top-up',
        image: 'https://your-app-logo.png', // Your app logo
        currency: razorpayConfig.currency,
        key: razorpayConfig.key_id,
        amount: amount * 100, // Convert to paise
        name: razorpayConfig.name,
        order_id: orderId, // Use the extracted order ID
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
          verifyPayment({
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_order_id: data.razorpay_order_id,
            razorpay_signature: data.razorpay_signature,
          });
        })
        .catch(error => {
          setLoading(false);
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
      setLoading(false);
      console.log('Razorpay Init Error:', error);
      ToastMsg(
        error.message || 'Failed to initialize payment. Please try again.',
      );
    }
  };

  const handleSubmit = () => {
    // Validate amount
    let validationErrors = {
      amount: validators.checkNumber('amount', amount),
    };

    // Additional validation for minimum amount
    if (amount && parseFloat(amount) < 1) {
      validationErrors.amount = 'Amount must be at least ₹1';
    }

    setError(validationErrors);

    if (isValidForm(validationErrors)) {
      initiateRazorpayPayment();
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: 'white', paddingHorizontal: 15}}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : isKeyboardVisible
          ? 'height'
          : undefined
      }
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 40}>
      <HomeHeader
        title={'Add Amount'}
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.black}
      />

      <KeyboardAwareScrollView
        style={{paddingHorizontal: 5}}
        contentContainerStyle={styles.container}>
        <Input
          label="Amount (₹)"
          placeholder="Enter Amount"
          value={amount}
          onChangeText={text => {
            setAmount(text);
            // Clear error when user starts typing
            if (error.amount) {
              setError(prev => ({...prev, amount: ''}));
            }
          }}
          keyboardType="numeric"
          style={{borderColor: COLOR.primary}}
          error={error.amount}
        />

        {/* Payment information */}
        <Text style={styles.note}>Minimum amount: ₹1</Text>
      </KeyboardAwareScrollView>

      <Button
        loading={loading}
        title={'Proceed to Pay'}
        onPress={handleSubmit}
      />
    </KeyboardAvoidingView>
  );
};

export default AddAmount;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 10,
    backgroundColor: COLOR.bgColor,
  },
  note: {
    fontSize: 12,
    color: COLOR.gray,
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
    color: COLOR.black,
  },
  dropdown: {
    height: 50,
    borderColor: COLOR.primary,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  placeholderStyle: {
    fontSize: 14,
    color: 'gray',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: COLOR.black,
  },
  button: {
    marginTop: 20,
    backgroundColor: COLOR.primary,
    paddingVertical: 14,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: COLOR.white,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});
