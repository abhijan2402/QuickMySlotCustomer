import React, {useRef, useState} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
} from 'react-native';
import Header from '../../Components/FeedHeader';
import {COLOR} from '../../Constants/Colors';
import CustomButton from '../../Components/CustomButton';
import {windowHeight} from '../../Constants/Dimensions';
import HomeHeader from '../../Components/HomeHeader';

const OtpScreen = ({navigation}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    let newOtp = [...otp];
    newOtp[index] = text;

    setOtp(newOtp);

    // Move to next input automatically
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }

    // Close keyboard if last digit entered
    if (index === 5 && text) {
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = ({nativeEvent}, index) => {
    if (nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const verifyOtp = () => {
    const otpCode = otp.join('');
    console.log('Entered OTP:', otpCode);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <Header showBack title={'OTP Verification'} /> */}
      <HomeHeader
        title="OTP Verification"
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.black}
      />
      <Image
        source={{
          uri: 'https://cdn-icons-png.flaticon.com/128/9042/9042592.png',
        }}
        style={styles.image}
      />

      <View style={{padding: 20, alignItems: 'center'}}>
        <Text style={styles.title}>OTP Verification</Text>
        <Text style={styles.subtitle}>
          We have sent a 6-digit verification code to your registered mobile
          number ending in **** 1234. Please enter it below.
        </Text>
      </View>

      {/* OTP Input Fields */}
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={ref => (inputs.current[index] = ref)}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={text => handleChange(text, index)}
            onKeyPress={e => handleKeyPress(e, index)}
          />
        ))}
      </View>

      <CustomButton
        title={'Verify'}
        onPress={() => {
          navigation.navigate('BottomNavigation');
        }}
      />
      <View
        style={{marginTop: 20, flexDirection: 'row', justifyContent: 'center'}}>
        <Text>Didn't receive the code? </Text>
        <Text style={{fontWeight: '600', color: COLOR.primary}}>
          Resend OTP
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  image: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 20,
    color: COLOR.black,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginHorizontal: 15,
    marginVertical: 20,
    marginBottom: windowHeight * 0.06,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: 45,
    height: 50,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    backgroundColor: '#f9f9f9',
  },
});
