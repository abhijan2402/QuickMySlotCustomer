import React from 'react';
import {Image, StyleSheet, Text, TextInput, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {windowHeight, windowWidth} from '../../Constants/Dimensions';
import {COLOR} from '../../Constants/Colors';
import CustomButton from '../../Components/CustomButton';
import GoogleAuthButton from '../../Components/UI/GoogleAuthButton';

const Login = ({navigation}) => {
  const handleLoginSuccess = user => {
  };
  return (
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
      <Text style={styles.text}>
        Book smarter, Live better Only with QuickSlot
      </Text>

      {/* Mobile Number Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.countryCode}>+91 | </Text>
        <TextInput
          keyboardType="numeric"
          placeholder="Enter Mobile Number"
          placeholderTextColor={COLOR.black}
          style={styles.input}
        />
      </View>

      {/* Continue Button */}
      <CustomButton
        title={'Continue'}
        onPress={() => {
          navigation.navigate('OtpScreen');
        }}
      />

      {/* Divider with text */}
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>Or</Text>
        <View style={styles.divider} />
      </View>
      {/* Google Login Button */}
      <GoogleAuthButton onLoginSuccess={handleLoginSuccess} />
    </LinearGradient>
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
  text: {
    fontSize: 18,
    color: '#242524FF',
    fontWeight: '600',
    width: windowWidth / 1.5,
    textAlign: 'center',
    lineHeight: 28,
  },
  inputContainer: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#2196F3FF',
    backgroundColor: COLOR.white,
    borderRadius: 6,
    width: windowWidth - 40,
    padding: 5,
    paddingHorizontal: 10,
    marginTop: 30,
    marginBottom: 30,
  },
  countryCode: {
    color: COLOR.black,
  },
  input: {
    flex: 1,
    color: COLOR.black,
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
  dividerText: {
    marginHorizontal: 10,
    color: '#888',
    fontSize: 14,
  },
});
