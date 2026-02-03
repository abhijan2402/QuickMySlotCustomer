import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import HomeHeader from '../../../Components/HomeHeader';
import { COLOR } from '../../../Constants/Colors';
import { Typography } from '../../../Components/UI/Typography';
import { Font } from '../../../Constants/Font';
import { GET_NOTIFICATION, NOTIFICATION_READ } from '../../../Constants/ApiRoute';
import { GET_WITH_TOKEN } from '../../../Backend/Api';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import { windowHeight } from '../../../Backend/Utility';

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotification] = useState([]);
  const isFocus = useIsFocused();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isFocus) {
      setLoading(true);
      GET_WITH_TOKEN(
        GET_NOTIFICATION,
        success => {
          // console.log(success?.data, "HIHI");

          setNotification(success?.data)
          setLoading(false);
        },
        error => {
          console.log(error, 'errorerrorerror>>');
          setLoading(false);
        },
        fail => {
          console.log(fail, 'errorerrorerror>>');

          setLoading(false);
        },
      );
      GET_WITH_TOKEN(
        NOTIFICATION_READ,
        success => {
          console.log(success, 'successsuccesssuccess-->>>');
          setLoading(false);
        },
        error => {
          console.log(error, 'errorerrorerror>>');
          setLoading(false);
        },
        fail => {
          console.log(fail, 'errorerrorerror>>');

          setLoading(false);
        },
      );
    }
  }, [isFocus]);

  return (
    <View style={styles.container}>
      <HomeHeader
        title="Notifications"
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.black}
      />
      <View style={{ height: windowHeight / 1.2 }}>
        {
          loading ?
            <View style={{ height: windowHeight / 1.4, justifyContent: "center" }}>
              <ActivityIndicator color={COLOR.primary} size={"large"} />
            </View> :
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 5 }}>
              {notifications?.length == 0 ?
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", height: windowHeight / 1.3 }}>
                  <Typography size={17} color={COLOR.primary}>No Notification to show!</Typography>

                </View>
                : notifications.map(item => (
                  <TouchableOpacity onPress={() => {
                    navigation.navigate('AppointmentDetail', { id: item?.booking_id })
                  }} key={item.id} style={styles.card}>
                    <View style={styles.cardRight}>
                      <View style={styles.cardHeader}>
                        <Typography size={14} font={Font.semibold} color={COLOR.black}>
                          {item.title}
                        </Typography>
                      </View>
                      <Typography
                        size={12}
                        font={Font.medium}
                        color="#555"
                        style={{ marginVertical: 4 }}>
                        {item.message}
                      </Typography>
                      <Typography size={11} font={Font.regular} color="#888">
                        {moment(item.created_at).format("DD MMM YYYY, hh:MM A")}
                      </Typography>
                    </View>
                  </TouchableOpacity>
                ))}
            </ScrollView>
        }

      </View>
      {/* Notifications List */}
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
    shadowOffset: { width: 0, height: 2 },
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
