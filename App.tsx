import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PermissionsAndroid, Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import MainNavigation from './src/navigators/MainNavigation';
import { AuthProvider } from './src/Backend/AuthContent';
import NoInternetAlert from './src/Components/UI/NoInternetAlert';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/Redux/store';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { fcmService } from './src/Notification/FMCService';
import { localNotificationService } from './src/Notification/LocalNotificationService';
import messaging from '@react-native-firebase/messaging';
const App = () => {
  const requestNotificationPermissions = async () => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.requestPermissions();
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      }
    }
  };

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    if (authStatus === messaging.AuthorizationStatus.AUTHORIZED) {
    }
  };

  useEffect(() => {
    setTimeout(() => {

      requestNotificationPermissions();
      requestUserPermission();

      fcmService.register();
      localNotificationService.cancelAllLocalNotifications();
      localNotificationService.clearNotificationBadge();

      return () => {
        localNotificationService.unRegister();
      };
    }, 2000);
  }, []);

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <View style={styles.safeArea}>
          <AuthProvider>
            <StatusBar barStyle="dark-content" backgroundColor={'#fff'} />
            <NavigationContainer>
              <MainNavigation />
              <NoInternetAlert />
            </NavigationContainer>
          </AuthProvider>
        </View>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
