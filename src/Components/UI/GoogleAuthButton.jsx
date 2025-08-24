import React, {useEffect} from 'react';
import {
  Alert,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {COLOR} from '../../Constants/Colors';
import {windowWidth} from '../../Constants/Dimensions';

const GoogleAuthButton = ({onLoginSuccess}) => {
  // ✅ Configure Google Sign-In once
  useEffect(() => {
     GoogleSignin.configure({
       webClientId:
         '218547319777-4dbc8eridimnd6c8d3m78oqu66m297vj.apps.googleusercontent.com',
     });
   }, []);

  const handleGoogleLogin = async () => {
    try {
      // ✅ Check if user already signed in
      const currentUser = await GoogleSignin.getCurrentUser();
      if (currentUser) {
        await GoogleSignin.signOut();
        await auth().signOut();
        console.log('Signed out from previous Google session.');
      }

      // ✅ Start Google Sign-In flow
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userSignIn = await auth().signInWithCredential(googleCredential);

      console.log('User signed in:', userSignIn.user);

      if (onLoginSuccess) {
        onLoginSuccess(userSignIn.user);
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      // Alert.alert('Login Failed', error.message);
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
    shadowOffset: {width: 0, height: 2},
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
    fontWeight: '500',
  },
});
