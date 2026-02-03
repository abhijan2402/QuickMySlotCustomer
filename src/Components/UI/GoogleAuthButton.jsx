import React, { useEffect } from 'react';
import {
  Alert,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { COLOR } from '../../Constants/Colors';
import { windowWidth } from '../../Constants/Dimensions';
import { Font } from '../../Constants/Font';

const GoogleAuthButton = ({ onLoginSuccess }) => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '218547319777-5bgbf2erkqnp0rqvq7kjgstejf0t8qiv.apps.googleusercontent.com',
    });
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.signOut(); // ensure clean state

      const userInfo = await GoogleSignin.signIn();

      console.log('Google response:', userInfo?.data);
      onLoginSuccess(userInfo?.data)
      if (!userInfo.data?.idToken) {
        throw new Error('Google idToken missing');
      }

      // const googleCredential =
      //   auth.GoogleAuthProvider.credential(userInfo?.data?.idToken);

      // const result =
      //   await auth().signInWithCredential(googleCredential);

      // console.log('Firebase user:', result.user);

      // onLoginSuccess?.(result.user);
    } catch (error) {
      console.log('Google Sign-In Error:', error);
    }
  };



  return (
    <TouchableOpacity
      onPress={handleGoogleLogin}
      style={styles.googleLoginContainer}>
      <Image
        source={{
          uri: 'https://cdn-icons-png.flaticon.com/128/281/281764.png',
        }}
        style={styles.googleIcon}
      />
      <Text style={styles.googleText}>Login Using Google</Text>
    </TouchableOpacity>
  );
};

export default GoogleAuthButton;

const styles = StyleSheet.create({
  googleLoginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: windowWidth - 40,
    backgroundColor: COLOR.white,
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  googleIcon: {
    width: 25,
    height: 25,
    marginRight: 8,
  },
  googleText: {
    color: COLOR.black,
    fontSize: 16,
    fontFamily: Font.semibold
  },
});
