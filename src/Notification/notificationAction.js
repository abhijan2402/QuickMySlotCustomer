import { useNavigation } from '@react-navigation/native';
import { getToken } from '../constants/AsyncStorage';
import React from 'react';
import { createNavigationContainerRef } from '@react-navigation/native';
export const navigationRef = createNavigationContainerRef();

export const navigate = (name, params) => {
  setTimeout(() => {
    navigationRef.navigate(name, params);
  }, 1000);
};

export const notificationOpen = async notification => {
  console.log(notification?.data?.booking_id, "NODGDUDGU");
  if (notification?.data?.booking_id) {
    console.log("HIIII");

    navigate('AppointmentDetail', { id: notification?.data?.booking_id })
  }
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
