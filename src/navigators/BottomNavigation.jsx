import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, Text} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Account from '../Screens/Private/Account/Account';
import {COLOR} from '../Constants/Colors';
import MainHome from '../Screens/Private/Home/MainHome';
import Notification from '../Screens/Private/Home/Notification';
import Appointment from '../Screens/Private/AppointmentSection/Appointment';
import MyAnalytics from '../Screens/Private/Home/Analytics';

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  const insets = useSafeAreaInsets();

  const icons = {
    Dashboard: 'https://cdn-icons-png.flaticon.com/128/1828/1828765.png',
    Appointments: 'https://cdn-icons-png.flaticon.com/128/8302/8302424.png',
    // Notification: 'https://cdn-icons-png.flaticon.com/128/10502/10502974.png',
    Analytics: 'https://cdn-icons-png.flaticon.com/128/2041/2041637.png',
    Profile: 'https://cdn-icons-png.flaticon.com/128/9308/9308008.png',
  };

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: COLOR.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 4,
        },
        tabBarStyle: {
          paddingVertical: 8,
          height: 60 + insets.bottom, // Add safe area bottom inset for Android/iOS
          paddingBottom: 0 + insets.bottom, // Padding to prevent overlap with nav buttons
        },
        tabBarIcon: ({focused}) => {
          const iconUri = icons[route.name];

          return (
            <Image
              source={{uri: iconUri}}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? COLOR.primary : 'gray',
              }}
              resizeMode="contain"
            />
          );
        },
        tabBarLabel: ({color}) => {
          let label = route.name;
          return (
            <Text
              style={{
                color,
                fontSize: 12,
                marginTop: 4,
                textAlign: 'center',
                // borderWidth: 1,
                width: '100%',
              }}>
              {label}
            </Text>
          );
        },
      })}>
      <Tab.Screen name={'Dashboard'} component={MainHome} />
      <Tab.Screen name={'Appointments'} component={Appointment} />
      <Tab.Screen name={'Analytics'} component={MyAnalytics} />
      <Tab.Screen name={'Profile'} component={Account} />
    </Tab.Navigator>
  );
};

export default BottomNavigation;
