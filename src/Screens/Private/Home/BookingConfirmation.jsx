import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {COLOR} from '../../../Constants/Colors';
import HomeHeader from '../../../Components/HomeHeader';
import {Typography} from '../../../Components/UI/Typography';

const BookingConfirmation = ({navigation}) => {
  return (
    <View style={styles.container}>
      <>
        <HomeHeader
          title="Booking Confirmation"
          leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
          leftTint={COLOR.black}
        />
        <ScrollView>
          <>
            <View style={styles.noticeContainer}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/128/1827/1827343.png',
                }}
                style={styles.noticeIcon}
              />
              <Typography style={styles.noticeText}>
                The salon is currently closed. They will confirm your
                appointment as soon as they open.
              </Typography>
            </View>

            {/* What To Do Next */}
            <View style={styles.section}>
              <Typography style={styles.sectionTitle}>
                What To Do Next
              </Typography>
              <Typography style={styles.listItem}>
                • Visit the location after receiving a confirmation
              </Typography>
              <Typography style={styles.listItem}>
                • Pay your bill on QuickSlot with any online payment to avail
                the offer
              </Typography>
            </View>

            {/* Things To Remember */}
            <View style={styles.section}>
              <Typography style={styles.sectionTitle}>
                Things To Remember
              </Typography>
              <Typography style={styles.listItem}>
                • You can change or add new services at the location
              </Typography>
              <Typography style={styles.listItem}>
                • Cash payments are not accepted
              </Typography>
            </View>

            {/* Salon Details */}
            <View style={styles.section}>
              <Typography style={styles.sectionTitle}>Salon Details</Typography>
              <Typography style={styles.salonName}>
                Abc Hairdressing, Sector 5 Vidhyadhar nagar, Jaipur
              </Typography>
              <View style={styles.salonRow}>
                <Image
                  source={require('../../../assets/Images/logo.png')}
                  style={styles.salonLogo}
                />
                <Typography style={styles.salonAddress}>
                  Shop No 112, 113 & 105, 1st floor, Good Earth City Center,
                  Sohna Rd, Sector 50, Gurugram, Haryana 122018
                </Typography>
              </View>

              {/* Call & Directions */}
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionBtn}>
                  <Image
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/128/597/597177.png',
                    }}
                    style={styles.actionIcon}
                  />
                  <Typography style={styles.actionText}>Timings</Typography>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Image
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/128/684/684908.png',
                    }}
                    style={styles.actionIcon}
                  />
                  <Typography style={styles.actionText}>
                    Get Directions
                  </Typography>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.callBtn}>
                <Typography style={styles.callText}>
                  ABC Hairdressing
                </Typography>
                <Typography style={styles.callSubText}>
                  For queries or instant confirmation
                </Typography>
              </TouchableOpacity>

              <TouchableOpacity style={styles.payBtn}>
                <Typography style={styles.payText}>Pay Now</Typography>
              </TouchableOpacity>
            </View>

            {/* Appointment Details */}
            <View style={styles.section}>
              <Typography style={styles.sectionTitle}>
                Appointment Details
              </Typography>
              <Typography style={styles.detailText}>
                Appointment Id: 293037
              </Typography>
              <Typography style={styles.detailText}>
                Date: 12th July, 2025
              </Typography>
              <Typography style={styles.detailText}>Time: 12:30 PM</Typography>
            </View>

            {/* Services Booked */}
            <View style={styles.section}>
              <Typography style={styles.sectionTitle}>
                Services Booked
              </Typography>
              <View style={styles.serviceRow}>
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/128/3004/3004613.png',
                  }}
                  style={styles.serviceIcon}
                />
                <View>
                  <Typography style={styles.serviceName}>Haircut</Typography>
                  <Typography style={styles.serviceSubText}>
                    Includes wash and blast dry
                  </Typography>
                </View>
              </View>
            </View>

            {/* Cancel & Reschedule */}
            <View style={styles.footerRow}>
              <TouchableOpacity style={styles.cancelBtn}>
                <Typography style={styles.cancelText}>✖ Cancel</Typography>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rescheduleBtn}>
                <Typography style={styles.rescheduleText}>
                  ⏰ Reschedule
                </Typography>
              </TouchableOpacity>
            </View>
          </>
        </ScrollView>
      </>
    </View>
  );
};

export default BookingConfirmation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  noticeContainer: {
    flexDirection: 'row',
    backgroundColor: '#fef6e4',
    padding: 12,
    marginVertical: 5,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  noticeIcon: {width: 28, height: 28, marginRight: 8},
  noticeText: {flex: 1, color: '#d98c00', fontSize: 14},
  section: {padding: 15, borderBottomWidth: 0.5, borderColor: '#ddd'},
  sectionTitle: {fontSize: 16, fontWeight: 'bold', marginBottom: 8},
  listItem: {fontSize: 14, color: '#444', marginVertical: 2},
  salonName: {fontSize: 15, fontWeight: '600', marginBottom: 10},
  salonRow: {flexDirection: 'row', alignItems: 'center'},
  salonLogo: {
    width: 80,
    height: '100%',
    marginRight: 10,
    resizeMode: 'contain',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  salonAddress: {flex: 1, fontSize: 13, color: '#555'},
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  actionBtn: {alignItems: 'center'},
  actionIcon: {width: 22, height: 22, marginBottom: 4},
  actionText: {fontSize: 13, color: COLOR.primary},
  callBtn: {
    borderWidth: 1,
    borderColor: COLOR.primary,
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  callText: {textAlign: 'center', color: COLOR.primary, fontWeight: '600'},
  callSubText: {textAlign: 'center', fontSize: 12, color: '#888'},
  payBtn: {
    backgroundColor: COLOR.primary,
    padding: 15,
    borderRadius: 8,
    marginTop: 12,
  },
  payText: {textAlign: 'center', color: '#fff', fontWeight: '600'},
  detailText: {fontSize: 14, color: '#444', marginVertical: 2},
  serviceRow: {flexDirection: 'row', alignItems: 'center', marginTop: 10},
  serviceIcon: {width: 40, height: 40, marginRight: 10},
  serviceName: {fontSize: 15, fontWeight: '600'},
  serviceSubText: {fontSize: 13, color: '#888'},
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    marginBottom: 50,
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  cancelText: {color: 'red', fontWeight: '600'},
  rescheduleBtn: {
    backgroundColor: '#c9d8f5',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  rescheduleText: {color: '#333', fontWeight: '600'},
});
