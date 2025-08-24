import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Account from '../Screens/Private/Account/Account';
import {COLOR} from '../Constants/Colors';
import MainHome from '../Screens/Private/Home/MainHome';
import Appointment from '../Screens/Private/AppointmentSection/Appointment';
import MyAnalytics from '../Screens/Private/Home/Analytics';
import {useNavigation} from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({children, onPress}) => <CustomBarButton />;

const BottomNavigation = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const icons = {
    Dashboard: 'https://cdn-icons-png.flaticon.com/128/1828/1828765.png',
    Appointments: 'https://cdn-icons-png.flaticon.com/128/8302/8302424.png',
    Analytics: 'https://cdn-icons-png.flaticon.com/128/2041/2041637.png',
    Profile: 'https://cdn-icons-png.flaticon.com/128/9308/9308008.png',
  };
  const CustomBarButton = () => {
    return (
    <TouchableOpacity
      activeOpacity={0.99}
      style={{
        top: -20,
        justifyContent: 'center',
        alignItems: 'center',
        ...styles.shadow,
      }}
      onPress={() => {
        navigation.navigate('PayBill');
      }}>
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: COLOR.primary,
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 5,
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: 12,
          }}>
          Pay Bill
        </Text>
      </View>
    </TouchableOpacity>
    );
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
          height: 60,
          position: 'relative',
        },
        tabBarIcon: ({focused}) => {
          const iconUri = icons[route.name];
          if (route.name === 'PayBill') {
            return null; // We'll handle this in the tabBarButton option
          }
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
          if (route.name === 'PayBill') {
            return null;
          }
          let label = route.name;
          return (
            <Text
              style={{
                color,
                fontSize: 11,
                marginTop: 4,
                textAlign: 'center',
                width: '100%',
              }}>
              {label}
            </Text>
          );
        },
      })}>
      <Tab.Screen name={'Dashboard'} component={MainHome} />
      <Tab.Screen name={'Appointments'} component={Appointment} />
      <Tab.Screen
        name={'PayBill'}
        component={View} // Dummy component
        options={{
          tabBarButton: props => <CustomBarButton {...props} />,
        }}
      />
      <Tab.Screen name={'Analytics'} component={MyAnalytics} />
      <Tab.Screen name={'Profile'} component={Account} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

export default BottomNavigation;
