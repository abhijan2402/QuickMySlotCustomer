import {getToken} from '../constants/AsyncStorage';
import { navigationRef } from '../navigators/MainNavigation';

export const navigate = (stack, name, params) => {
  setTimeout(() => {
    navigationRef?.current?.navigate(stack, name, params);
  }, 1000);
};

export const notificationOpen = async notification => {
  // const token = await getToken();
  // if (!token) {
  //   navigate('HomeStack');
  // } else if (notification?.data?.ad_id) {
  //   navigate('Conversation', {
  //     screen: 'Conversation',
  //     ad_id: notification?.data?.ad_id,
  //     receiver_id: notification?.data?.sender_id,
  //     ad_Type: notification?.data?.ad_type == 0 ? 'room' : 'roommate',
  //   });
  // } else {
  //   navigate('NotificationList', {
  //     screen: 'NotificationList',
  //   });
  // }
};
