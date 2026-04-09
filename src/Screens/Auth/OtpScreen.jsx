import React, { useContext, useRef, useState, useEffect } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  Keyboard,
  Touchable,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';
import { COLOR } from '../../Constants/Colors';
import CustomButton from '../../Components/CustomButton';
import { windowHeight } from '../../Constants/Dimensions';
import HomeHeader from '../../Components/HomeHeader';
import { AuthContext } from '../../Backend/AuthContent';
import { Typography } from '../../Components/UI/Typography';
import Button from '../../Components/UI/Button';
import { POST, useApi } from '../../Backend/Api';
import { RESEND_OTP, VERIFY_OTP } from '../../Constants/ApiRoute';
import { isValidForm, ToastMsg } from '../../Backend/Utility';
import { validators } from '../../Backend/Validator';
import { ErrorBox } from '../../Components/UI/ErrorBox';
import { isAuth, Token, userDetails } from '../../Redux/action';
import { useDispatch } from 'react-redux';
import { Font } from '../../Constants/Font';
import Header from '../../Components/FeedHeader';
import { images } from '../../Components/UI/images';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';

const OtpScreen = ({ navigation, route }) => {
  const [otp, setOtp] = useState(null);
  const inputs = useRef([]);
  const user_id = route?.params?.userId;
  const [value, setValue] = useState('');
  const CELL_COUNT = 6;

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] =
    useClearByFocusCell({
      value,
      setValue,
    });
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

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const verifyOtp = () => {
    // const otpCode = otp.join('');
    console.log(otp, "OOOPPPP", typeof (otp));

    let error = {
      otp: validators.checkRequire('OTP', otp?.length == 6),
    };
    console.log(error, 'Error---->>');
    setError(error);
    if (isValidForm(error)) {
      onSubmit();
    }
  };

  const onSubmit = async () => {
    // dispatch(Token('ABC'));
    // dispatch(isAuth(true));
    // return;
    // setLoading(true);
    // const otpCode = otp.join('');

    const body = { user_id: user_id, otp: otp };
    console.log(body, "NODIDI");

    POST(
      VERIFY_OTP,
      body,
      success => {
        console.log(success, 'successsuccesssuccess-->>>');
        setLoading(false);
        ToastMsg(success?.message);
        dispatch(Token(success?.token));
        dispatch(isAuth(true));
        const d = { ...success?.user };
        dispatch(userDetails(d));
      },
      error => {
        console.log(error, 'errorerrorerror>>');
        setLoading(false);
        setError({ otp: error?.error });
        // ToastMsg(error?.message);
      },
      fail => {
        console.log(fail, 'failfailfailfail');
        setLoading(false);
      },
    );
  };

  const resend = async () => {
    const form = { phone_number: phone };
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
  useEffect(() => {
    if (otp?.length === 6) {
      verifyOtp();
    }
  }, [otp]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container} >
        <Header
          title="OTP Verification"
          showBack="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
          leftTint={COLOR.black}
          onBackPress={() => navigation.goBack()}
        />

        <Image source={images.logo} style={styles.logo} />

        <View style={{ padding: 20, alignItems: 'center' }}>
          <Typography
            size={18}
            font={Font.semibold}
            color={COLOR.black}
            lineHeight={20}>
            OTP Verification
          </Typography>

          <Typography
            font={Font.medium}
            size={14}
            color={COLOR.black}
            textAlign="center"
            lineHeight={20}
            style={{ marginTop: 10 }}>
            We have sent a 6-digit verification code to your registered mobile
            number ending in **** {phone?.slice(-4)}. Please enter it below.
          </Typography>
        </View>

        <View style={{}}>
          <CodeField
            ref={ref}
            {...props}
            value={otp}
            onChangeText={setOtp}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode" // iOS auto-read
            autoComplete="sms-otp"        // Android auto-read
            // autoComplete='one-time-code'
            autoFocus={true}
            onSubmitEditing={() => {
              verifyOtp()
            }}
            dataDetectorTypes={'all'}
            renderCell={({ index, symbol, isFocused }) => (
              <Text
                key={index}
                style={[
                  styles.cell,
                  isFocused && styles.focusCell,
                ]}
                onLayout={getCellOnLayoutHandler(index)}
              >
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />

        </View>
        {error?.otp && (
          <ErrorBox
            style={{ marginTop: 0, marginBottom: 10, marginHorizontal: 20 }}
            error={error?.otp}
          />
        )}
        <View style={{ padding: 20 }}>
          <Button
            title={'Verify'}
            onPress={verifyOtp}
            containerStyle={{
              marginTop: windowHeight * 0.06,
            }}
            loading={loading}
          />
        </View>

        <View
          style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center' }}>
          <Typography size={14} color={COLOR.black}>
            Didn't receive the code?{' '}
          </Typography>
          {timer > 0 ? (
            <Typography font={Font.medium} size={14} color={COLOR.gray}>
              Resend in {timer}s
            </Typography>
          ) : (
            <Typography
              size={14}
              color={COLOR.primary}
              font={Font.semibold}
              disabled={false}
              onPress={resend}>
              Resend OTP
            </Typography>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // paddingHorizontal: 15,
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
    fontFamily: Font.semibold,
    backgroundColor: '#f9f9f9',
  },
  logo: {
    width: 290,
    height: 200,
    marginTop: windowHeight * 0.05,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 10
  },
  otpContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  codeFieldRoot: {
    marginTop: 0,
    marginHorizontal: 15
  },
  cell: {
    width: 45,
    height: 55,
    lineHeight: 55,
    fontSize: 24,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    marginHorizontal: 5,
    borderRadius: 8,
  },
  focusCell: {
    borderColor: '#000',
  },
});
