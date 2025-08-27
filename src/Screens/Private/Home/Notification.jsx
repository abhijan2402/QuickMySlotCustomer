import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import HomeHeader from '../../../Components/HomeHeader';
import {COLOR} from '../../../Constants/Colors';
import { Typography } from '../../../Components/UI/Typography';

const notifications = [
  {
    id: 1,
    icon: 'https://cdn-icons-png.flaticon.com/128/6834/6834351.png',
    title: 'Booking Confirmed',
    message:
      'Your appointment with Dr. Emily Davis on Oct 26th at 2:00 PM is confirmed.',
    time: '2 hours ago',
    status: 'Read',
    statusColor: 'green',
  },
  {
    id: 2,
    icon: 'https://cdn-icons-png.flaticon.com/128/2529/2529521.png',
    title: 'Upcoming Appointment',
    message:
      'Reminder: Your appointment with John Doe is tomorrow at 10:00 AM.',
    time: 'Yesterday',
    status: 'Unread',
    statusColor: 'gray',
  },
  {
    id: 3,
    icon: 'https://cdn-icons-png.flaticon.com/128/2529/2529521.png',
    title: 'New Message Received',
    message: 'You have a new message from Provider Jane Smith.',
    time: '1 day ago',
    status: 'New',
    statusColor: 'blue',
  },
  {
    id: 4,
    icon: 'https://cdn-icons-png.flaticon.com/128/6834/6834351.png',
    title: 'Booking Pending',
    message:
      'Your booking request for service "Haircut" with Stylist Mark is pending confirmation.',
    time: '2 days ago',
    status: 'Pending',
    statusColor: 'orange',
  },
];

const NotificationsScreen = () => {
  return (
    <View style={styles.container}>
      <HomeHeader
        title="Notifications"
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.black}
      />

      {/* Notifications List */}
      <ScrollView contentContainerStyle={{paddingVertical: 10, paddingHorizontal: 10}}>
        {notifications.map(item => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardLeft}>
              <Image source={{uri: item.icon}} style={styles.icon} />
            </View>
            <View style={styles.cardRight}>
              <View style={styles.cardHeader}>
                <Typography size={14} fontWeight="600" color={COLOR.black}>
                  {item.title}
                </Typography>
                <Typography size={12} fontWeight="600" color={item.statusColor}>
                  {item.status}
                </Typography>
              </View>
              <Typography size={12} color="#555" style={{marginVertical: 4}}>
                {item.message}
              </Typography>
              <Typography size={11} color="#888">
                {item.time}
              </Typography>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    paddingHorizontal: 10,
    marginVertical: 6,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardLeft: {
    marginRight: 10,
    backgroundColor: COLOR.iconBg,
    alignSelf: 'flex-start',
    padding: 5,
    borderRadius: 50,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: '#a29bfe',
  },
  cardRight: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
