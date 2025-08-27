import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {windowHeight, windowWidth} from '../../Constants/Dimensions';
import {COLOR} from '../../Constants/Colors';
import {isValidForm} from '../../Backend/Utility';
import Button from '../../Components/UI/Button';
import GoogleAuthButton from '../../Components/UI/GoogleAuthButton';
import {ScrollView} from 'react-native';
import Input from '../../Components/Input';
import {Typography} from '../../Components/UI/Typography';  
import { validators } from '../../Backend/Validator';

const Login = ({navigation}) => {
  const [error, setError] = React.useState({});
  const [number, setNumber] = React.useState('');

  const onSubmit = () => {
    let error = {
      mobile: validators.checkNumber('Mobile Number', number),
    };
    setError(error);
    if (isValidForm(error)) {
      navigation.navigate('OtpScreen');
    }
  };

  const handleLoginSuccess = user => {};

  return (
    <View
      style={{flex: 1, paddingHorizontal: 20, backgroundColor: COLOR.white}}>
      <LinearGradient
        colors={[COLOR.white, COLOR.white]}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={styles.container}>
        
        {/* Logo */}
        <Image
          source={require('../../assets/Images/logo.png')}
          style={styles.logo}
        />

        {/* Tagline */}
        <Typography
          size={18}
          fontWeight="600"
          color="#242524"
          textAlign="center"
          lineHeight={28}
          style={{width: windowWidth / 1.2, marginTop: 10}}>
          Get Bookings, Expand Business with QuickSlot
        </Typography>

        {/* Mobile Number Input */}
        <Input
          keyboardType="numeric"
          placeholder="Enter Mobile Number"
          value={number}
          onChangeText={text => setNumber(text)}
          error={error.mobile}
        />

        {/* Continue Button */}
        <Button
          containerStyle={{marginTop: 30, width: '100%'}}
          title={'Continue'}
          onPress={onSubmit}
        />

        {/* Divider with text */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Typography size={14} color="#888">Or</Typography>
          <View style={styles.divider} />
        </View>

        {/* Google Login Button */}
        <GoogleAuthButton onLoginSuccess={handleLoginSuccess} />

        {/* Register Section (if needed) */}
        {/* 
        <View style={styles.registerContainer}>
          <Typography size={14} color="#555">Don’t have an account? </Typography>
          <Typography
            size={14}
            color={COLOR.primary}
            fontWeight="600"
            onPress={() => navigation.navigate('SignUp')}>
            Register
          </Typography>
        </View> 
        */}
      </LinearGradient>
    </View>
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
    width: windowWidth - 40,
    marginVertical: 15,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
});
