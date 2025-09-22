import React, {useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {windowHeight, windowWidth} from '../../Constants/Dimensions';
import {COLOR} from '../../Constants/Colors';
import {isValidForm, showToast, ToastMsg} from '../../Backend/Utility';
import Button from '../../Components/UI/Button';
import GoogleAuthButton from '../../Components/UI/GoogleAuthButton';
import {ScrollView} from 'react-native';
import Input from '../../Components/Input';
import {Typography} from '../../Components/UI/Typography';
import {validators} from '../../Backend/Validator';
import {SIGN_UP} from '../../Constants/ApiRoute';
import {API, POST, useApi} from '../../Backend/Api';
import useKeyboard from '../../Constants/Utility';
import {images} from '../../Components/UI/images';
import {isAuth, Token, userDetails} from '../../Redux/action';
import {Font} from '../../Constants/Font';
import axios from 'axios';

const Login = ({navigation}) => {
  const [number, setNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {isKeyboardVisible} = useKeyboard();

  const onSubmit = () => {
    let error = {
      mobile: validators.checkNumber('Mobile Number', number),
    };
    setError(error);
    if (isValidForm(error)) {
      handleSignup();
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    const body = {
      phone_number: number,
    };
    POST(
      SIGN_UP,
      body,
      success => {
        console.log('Calling API:', success);

        setLoading(false);
        navigation.navigate('OtpScreen', {
          userId: success?.user_id,
          phone: number,
        });
      },
      error => {
        console.log(error);

        setLoading(false);
      },
      fail => {
        setLoading(false);
      },
    );
  };


  const handleLoginSuccess = user => {};

  return (
    <KeyboardAvoidingView
      style={{flex: 1, paddingHorizontal: 20, backgroundColor: COLOR.white}}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : isKeyboardVisible
          ? 'height'
          : undefined
      }
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 100}>
      <StatusBar backgroundColor={'white'} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[COLOR.white, COLOR.white]}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={styles.container}>
          {/* Logo */}
          <Image source={images.logo} style={styles.logo} />

          {/* Tagline */}
          <Typography
            size={18}
            font={Font.semibold}
            color="#242524"
            textAlign="center"
            lineHeight={28}
            style={{width: windowWidth / 1.2, marginTop: 10, marginBottom: 10}}>
            Get Bookings, Expand Business with QuickSlot
          </Typography>

          {/* Mobile Number Input */}
          <Input
            keyboardType="numeric"
            placeholder="Enter Mobile Number"
            value={number}
            onChangeText={text => setNumber(text)}
            error={error.mobile}
            leftIcon={true}
            text={'+ 91'}
          />

          {/* Continue Button */}
          <Button
            containerStyle={{marginTop: 30, width: '100%'}}
            title={'Continue'}
            onPress={onSubmit}
            loading={loading}
          />

          {/* Divider with text */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Typography size={14} color="#888" style={{paddingHorizontal: 15}}>
              Or
            </Typography>
            <View style={styles.divider} />
          </View>

          {/* Google Login Button */}
          <GoogleAuthButton onLoginSuccess={handleLoginSuccess} />
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 290,
    height: 200,
    marginTop: windowHeight * 0.1,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    justifyContent: 'center',
    marginBottom: 25,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    width: windowWidth * 0.3,
  },
});
