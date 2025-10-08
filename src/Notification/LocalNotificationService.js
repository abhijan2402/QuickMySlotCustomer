import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Platform} from 'react-native';
import {notificationOpen} from './notificationAction';

class LocalNotificationService {
  configure = () => {
    this.createChannel();
    this.configureNotification();
  };

  createChannel = () => {
    let config = {
      channelId: 'channel-id',
      channelName: 'My channel',
      channelDescription: 'A channel to categorise your notifications',
      playSound: true,
      allowWhileIdle: true,
      vibrate: true,
    };

    PushNotification.createChannel(config, created => {});
  };

  configureNotification = () => {
    let config = {
      onRegister: function (token) {},
      onNotification: function (notification) {
        if (notification.userInteraction) {
          notificationOpen(notification);
        }
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    };

    PushNotification.configure(config);
  };

  unRegister = () => {
    PushNotification.unregister();
  };

  showlocalNotification = ({notification, data}) => {
    let config = {
      title: notification?.title,
      message: notification?.body,
      userInfo: data,
      playSound: true,
      number: 1,
      badge: 2,
    };

    if (Platform.OS == 'android') {
      config.channelId = 'channel-id';
      config.data = data;
      config.message = notification?.body;
      config.smallIcon = 'ic_notification';
      config.color = '#1c5298';
    }

    PushNotification.localNotification(config);
  };

  cancelAllLocalNotifications = () => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.removeAllDeliveredNotifications();
    } else {
      PushNotification.cancelAllLocalNotifications();
    }
  };

  clearNotificationBadge = () => {
    if (Platform.OS == 'ios') {
      PushNotificationIOS.getApplicationIconBadgeNumber(num => {
        if (num >= 1) {
          PushNotificationIOS.setApplicationIconBadgeNumber(0);
        }
      });
    }
  };

  removeAllDeliveredNotificationByID = notificationId => {
    PushNotification.cancelLocalNotifications({id: `${notificationId}`});
  };
}

export const localNotificationService = new LocalNotificationService();
