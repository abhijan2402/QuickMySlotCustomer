import React, {useContext, useRef, useState, useEffect} from 'react';
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
import {Typography} from '../../Components/UI/Typography';
import Button from '../../Components/UI/Button';
import {POST, useApi} from '../../Backend/Api';
import {RESEND_OTP, VERIFY_OTP} from '../../Constants/ApiRoute';
import {isValidForm, ToastMsg} from '../../Backend/Utility';
import {validators} from '../../Backend/Validator';
import {ErrorBox} from '../../Components/UI/ErrorBox';
import {isAuth, Token, userDetails} from '../../Redux/action';
import {useDispatch} from 'react-redux';

const OtpScreen = ({navigation, route}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);
  const user_id = route?.params?.userId;
  const phone = route?.params?.phone;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  // 🔥 Timer state
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (text, index) => {
    let newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
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
    let error = {
      otp: validators.checkRequire('OTP', otpCode?.length == 6),
    };
    console.log(error, 'Error---->>');
    setError(error);
    if (isValidForm(error)) {
      onSubmit();
    }
  };

  const onSubmit = async () => {
    // setLoading(true);
    const otpCode = otp.join('');

    const body = {user_id: user_id, otp: otpCode};
    POST(
      VERIFY_OTP,
      body,
      success => {
        console.log(success, 'successsuccesssuccess-->>>');
        setLoading(false);
        ToastMsg(success?.message);
        dispatch(Token(success?.token));
        dispatch(isAuth(true));
        const d = {...success?.user};
        dispatch(userDetails(d));
      },
      error => {
        console.log(error, 'errorerrorerror>>');
        setLoading(false);
        ToastMsg(error?.message);
      },
      fail => {
        console.log(fail, 'failfailfailfail');
        setLoading(false);
      },
    );
  };

  const resend = async () => {
    const form = {phone_number: phone};
    POST(
      RESEND_OTP,
      form,
      success => {
        console.log(success, 'successsuccesssuccess-->>>');
        ToastMsg(success?.message);
      },
      error => {
        console.log(error, 'errorerrorerror>>');
        ToastMsg(error?.message);
      },
      fail => {
        console.log(fail, 'failfailfailfail');
      },
    );
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
          number ending in **** {phone?.slice(-4)}. Please enter it below.
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
      {error?.otp && (
        <ErrorBox style={{marginTop: 0, marginBottom: 10}} error={error?.otp} />
      )}

      <Button
        title={'Verify'}
        onPress={verifyOtp}
        containerStyle={{
          marginTop: windowHeight * 0.06,
        }}
        loading={loading}
      />

      <View
        style={{marginTop: 20, flexDirection: 'row', justifyContent: 'center'}}>
        <Typography size={14} color={COLOR.black}>
          Didn't receive the code?{' '}
        </Typography>
        {timer > 0 ? (
          <Typography size={14} color={COLOR.gray}>
            Resend in {timer}s
          </Typography>
        ) : (
          <Typography
            size={14}
            color={COLOR.primary}
            fontWeight="600"
            disabled={false}
            onPress={resend}>
            Resend OTP
          </Typography>
        )}
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
