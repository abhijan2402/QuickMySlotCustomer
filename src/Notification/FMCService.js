import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import {localNotificationService} from './LocalNotificationService';
// import {notificationOpen} from './notificationAction';

class FCMService {
  register = () => {
    this.checkPermission();
    this.createNotificationListeners();
    localNotificationService.configure();
    if (Platform.OS === 'ios') {
      this.registerAppWithFCM();
    }
  };
  registerAppWithFCM = async () => {
    if (Platform.OS === 'ios') {
      await messaging().registerDeviceForRemoteMessages();
      await messaging().setAutoInitEnabled(true);
    }
  };
  checkPermission = () => {
    messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          this.getFcmToken();
        } else {
          this.requestPermission();
        }
      })
      .catch(error => {});
  };
  getFcmToken = () => {
    return new Promise(res => {
      messaging()
        .getToken()
        .then(fcmToken => {
          console.log(fcmToken,'fcmTokenfcmToken====>');
          if (fcmToken) {
            AsyncStorage.setItem('fcm_token', fcmToken);
            res(fcmToken);
          } else {
          }
        })
        .catch(error => {});
    });
  };
  requestPermission = () => {
    messaging()
      .requestPermission()
      .then(() => {
        this.getFcmToken();
      })
      .catch(error => {});
  };

  deleteToken = () => {
    messaging()
      .deleteToken()
      .catch(error => {});
  };

  createNotificationListeners = () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage) {
        // notificationOpen(remoteMessage);
      }
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          // notificationOpen(remoteMessage);
        }
      });

    this.messageListener = messaging().onMessage(async remoteMessage => {
      if (remoteMessage) {
        localNotificationService.showlocalNotification(remoteMessage);
      }
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      if (remoteMessage) {
        // notificationOpen(remoteMessage, false);
      }
    });
    messaging().onTokenRefresh(fcmToken => {});
  };
  unRegister = () => {
    if (this.messageListener) {
      this.messageListener();
    }
  };
}

export const fcmService = new FCMService();
