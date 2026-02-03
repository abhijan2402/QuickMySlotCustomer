import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { localNotificationService } from './LocalNotificationService';
import { notificationOpen } from './notificationAction';

class FCMService {
  register = () => {
    this.checkPermission();
    this.createNotificationListeners();
    localNotificationService.configure();
    if (Platform.OS == 'ios') {
      console.log("HIII");

      this.registerAppWithFCM();
    }
  };
  registerAppWithFCM = async () => {
    if (Platform.OS === 'ios') {
      const apns = await messaging().getAPNSToken();
      console.log(apns, "APCCCCC");

      await messaging().registerDeviceForRemoteMessages();
      await messaging().setAutoInitEnabled(true);
    }
  };
  checkPermission = () => {
    messaging()
      .hasPermission()
      .then(enabled => {
        console.log(enabled, "ENABLEEEE");

        if (enabled) {
          this.getFcmToken();
        } else {
          this.requestPermission();
        }
      })
      .catch(error => { });
  };
  getFcmToken = () => {
    return new Promise(res => {
      messaging()
        .getToken()
        .then(fcmToken => {
          console.log(fcmToken, 'fcmTokenfcmToken====>');
          if (fcmToken) {
            AsyncStorage.setItem('fcm_token', fcmToken);
            res(fcmToken);
          } else {
            console.log(fcmToken, "ROOTOTOT");

          }
        })
        .catch(error => {
          console.log(error, "ROOTOTOT");
        });
    });
  };
  requestPermission = () => {
    messaging()
      .requestPermission()
      .then(() => {
        this.getFcmToken();
      })
      .catch(error => { });
  };

  deleteToken = () => {
    messaging()
      .deleteToken()
      .catch(error => { });
  };

  createNotificationListeners = () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage) {
        notificationOpen(remoteMessage);
      }
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          notificationOpen(remoteMessage);
        }
      });

    this.messageListener = messaging().onMessage(async remoteMessage => {
      if (remoteMessage) {
        localNotificationService.showlocalNotification(remoteMessage);
      }
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      if (remoteMessage) {
        notificationOpen(remoteMessage, false);
      }
    });
    messaging().onTokenRefresh(fcmToken => { });
  };
  unRegister = () => {
    if (this.messageListener) {
      this.messageListener();
    }
  };
}

export const fcmService = new FCMService();
