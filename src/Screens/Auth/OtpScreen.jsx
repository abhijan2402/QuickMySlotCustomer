import React, {useContext, useRef, useState} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  Keyboard,
} from 'react-native';
import {COLOR} from '../../Constants/Colors';
import CustomButton from '../../Components/CustomButton';
import {windowHeight} from '../../Constants/Dimensions';
import HomeHeader from '../../Components/HomeHeader';
import {AuthContext} from '../../Backend/AuthContent';
import {Typography} from '../../Components/UI/Typography';  // ✅ import Typography
import Button from '../../Components/UI/Button';

const OtpScreen = ({navigation}) => {
  const {setUser, setToken} = useContext(AuthContext);
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
    // setUser('dummyUser');
    // setToken('dummyToken');
    navigation.navigate('CompleteProfile');
  };

  return (
    <SafeAreaView style={styles.container}>
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
        <Typography
          size={18}
          fontWeight="800"
          color={COLOR.black}
          lineHeight={20}>
          OTP Verification
        </Typography>

        <Typography
          size={14}
          color={COLOR.black}
          textAlign="center"
          lineHeight={20}
          style={{marginTop: 10}}>
          We have sent a 6-digit verification code to your registered mobile
          number ending in **** 1234. Please enter it below.
        </Typography>
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

      <Button
        title={'Verify'}
        onPress={() => {
          navigation.navigate('BottomNavigation')
        }}
      />

      <View
        style={{marginTop: 20, flexDirection: 'row', justifyContent: 'center'}}>
        <Typography size={14} color={COLOR.black}>
          Didn't receive the code?{' '}
        </Typography>
        <Typography
          size={14}
          color={COLOR.primary}
          fontWeight="600"
          onPress={() => console.log('Resend OTP pressed')}>
          Resend OTP
        </Typography>
      </View>
    </SafeAreaView>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  image: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 40,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginHorizontal: 5,
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
