import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import HomeHeader from '../../../Components/HomeHeader';
import { COLOR } from '../../../Constants/Colors';
import { Typography } from '../../../Components/UI/Typography';
import { images } from '../../../Components/UI/images';
import { windowHeight } from '../../../Constants/Dimensions';
import { Font } from '../../../Constants/Font';
import { useIsFocused } from '@react-navigation/native';
import { GET_WITH_TOKEN } from '../../../Backend/Api';
import { GET_BOOKING_LIST } from '../../../Constants/ApiRoute';
import moment from 'moment';
import { cleanImageUrl } from '../../../Backend/Utility';

const Appointment = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]); // State to store API data

  useEffect(() => {
    if (isFocused) {
      getBookingList();
    }
  }, [isFocused]);

  const getBookingList = () => {
    setLoading(true);
    GET_WITH_TOKEN(
      GET_BOOKING_LIST,
      success => {
        console.log(success, 'GET_BOOKING_LIST-->>>');
        setAppointments(success?.data || []); // Set the API data
        setLoading(false);
      },
      error => {
        setLoading(false);
        console.log(error, 'Error in booking list');
      },
      fail => {
        setLoading(false);
        console.log(fail, 'Failed to get booking list');
      },
    );
  };

  const getStatus = item => {
    return item.status || 'Pending';
  };

  const filters = [
    { label: 'All' },
    { label: 'pending' },
    { label: 'accepted' },
    { label: 'rejected' },
  ];

  const getStatusColor = status => {
    switch (status) {
      case 'pending':
        return '#FFD700';
      case 'accepted':
        return '#4CAF50';
      case 'rejected':
        return '#E53935';
      default:
        return '#555';
    }
  };

  const renderAppointment = ({ item }) => {
    const status = getStatus(item);
    const timeKeys = Object.keys(item?.schedule_time);
    const dateKeys = Object?.values(item?.schedule_time || {})[0];
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('AppointmentDetail', { appointment: item })
        }
        style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.leftSection}>
            <Image
              source={{
                uri:
                  cleanImageUrl(item?.vendor?.portfolio_images[0]?.image_url || item?.service?.image) ||
                  'https://via.placeholder.com/55',
              }}
              style={styles.serviceImage}
            />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Typography
                font={Font.medium}
                style={styles.title}
                numberOfLines={1}>
                {item?.vendor?.business_name || 'Service'}
              </Typography>
              <Typography style={styles.salonName}>
                {item?.services[0]?.name || 'Vendor'}
              </Typography>
            </View>
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            <View
              style={{
                height: 5,
                width: 5,
                borderRadius: 3,
                backgroundColor: getStatusColor(status),
              }}></View>
            <Typography
              style={[
                styles.status,
                {
                  color: getStatusColor(status),
                  textTransform: 'capitalize',
                  // backgroundColor: getBackgroundStatusColor(status) + '25',
                },
              ]}>
              {status}
            </Typography>
          </View>
        </View>

        <View style={styles.divider} />
        <View style={styles.bottomRow}>
          <Typography style={styles.salonService}>
            {item.service_description || 'Service description'}
          </Typography>
          <Typography style={styles.amount}>₹{item.final_amount || '0'}</Typography>
        </View>
        <View style={styles.infoRow}>
          <Image source={images.calendar} style={{ height: 16, width: 16 }} />
          <Typography style={styles.dateText}>{moment(dateKeys).format("DD MMM, YYYY")}</Typography>
        </View>
        <View style={styles.infoRow}>
          <Image source={images.clock} style={{ height: 16, width: 16 }} />
          <Typography style={styles.dateText}>
            {timeKeys?.map((v, index) => {
              return (
                moment(v, 'HH:mm').format('hh:mm A') +
                (index == timeKeys?.length - 1 ? '' : ', ')
              );
            })}
          </Typography>
        </View>
        <View style={styles.infoSection}>
          {item.vendor?.exact_location && (
            <View style={styles.infoRow}>
              <Image source={images.mark} style={{ height: 16, width: 16 }} />
              <Typography style={styles.details} numberOfLines={2}>
                {item.vendor?.exact_location || 'Address not available'}
              </Typography>
            </View>
          )}
          {item.vendor?.phone_number && (
            <View style={styles.infoRow}>
              <Image source={images.call} style={{ height: 14, width: 14 }} />
              <Typography style={styles.details}>
                {item.vendor?.phone_number || 'Contact not available'}
              </Typography>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Filter appointments based on selected filter
  const filteredAppointments =
    selectedFilter === 'All'
      ? appointments
      : appointments.filter(item => getStatus(item) === selectedFilter);
  // console.log(appointments, 'appointmentsappointments--->');
  return (
    <View style={styles.container}>
      <HomeHeader
        title="My Appointments"
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.black}
      />

      <View style={styles.filterRow}>
        {filters.map(filter => {
          const isSelected = selectedFilter === filter.label;
          return (
            <TouchableOpacity
              key={filter.label}
              style={[
                styles.filterButton,
                {
                  backgroundColor: isSelected ? COLOR.primary : COLOR.white,
                  borderColor: isSelected ? COLOR.primary : '#ddd',
                },
              ]}
              onPress={() => setSelectedFilter(filter.label)}>
              <Typography
                style={[
                  styles.filterText,
                  {
                    color: isSelected ? COLOR.white : COLOR.black,
                    textTransform: 'capitalize',
                  },
                ]}>
                {filter.label}
              </Typography>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredAppointments}
        keyExtractor={item => item.id.toString()}
        renderItem={renderAppointment}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshing={loading}
        onRefresh={getBookingList}
        ListEmptyComponent={() => {
          if (loading) {
            return (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: windowHeight * 0.3,
                }}>
                <Typography>Loading appointments...</Typography>
              </View>
            );
          }
          return (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: windowHeight * 0.3,
              }}>
              <Image source={images.noData} />
              <Typography size={20} fontWeight={'500'} style={{ marginTop: 10 }}>
                No Appointments found
              </Typography>
            </View>
          );
        }}
      />
    </View>
  );
};

export default Appointment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
    paddingHorizontal: 15,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 13,
    fontFamily: Font.semibold,
  },
  card: {
    backgroundColor: COLOR.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#f2f2f2',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceImage: {
    width: 55,
    height: 55,
    borderRadius: 12,
    backgroundColor: COLOR.lightGrey,
  },
  title: {
    fontSize: 16,
    fontFamily: Font.bold,
    color: COLOR.black,
  },
  salonName: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  status: {
    fontSize: 12,
    fontFamily: Font.semibold,
    // paddingVertical: 3,
    paddingHorizontal: 12,
    borderRadius: 20,
    overflow: 'hidden',
    paddingStart: 5,
  },
  dateText: {
    fontSize: 13,
    fontFamily: Font.semibold,
    color: '#444',
    marginLeft: 10,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginVertical: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  salonService: {
    fontSize: 13,
    color: '#666',
    fontFamily: Font.semibold,
  },
  infoSection: {
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  details: {
    fontSize: 13,
    color: '#555',
    flexShrink: 1,
    marginLeft: 10,
    marginTop: 2,
    fontFamily: Font.medium,
  },
  amount: {
    fontSize: 15,
    fontFamily: Font.semibold,
    color: COLOR.primary,
  },
});
