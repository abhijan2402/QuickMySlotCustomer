import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {COLOR} from '../../../Constants/Colors';
import {AuthContext} from '../../../Backend/AuthContent';
import HomeHeader from '../../../Components/HomeHeader';
import Button from '../../../Components/UI/Button';
import ConfirmModal from '../../../Components/UI/ConfirmModel';
import {Typography} from '../../../Components/UI/Typography';

const Account = ({navigation}) => {
  const {setUser} = useContext(AuthContext);
  const [profileImage, setProfileImage] = React.useState({
    uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  });
  const [visible, setVisible] = useState(false);
  const [deleteAccount, setDeleteAccount] = useState(false);

  const arrowIcon = 'https://cdn-icons-png.flaticon.com/512/271/271228.png'; // right arrow icon

  const tabs = [
    {
      id: 1,
      title: 'Edit Profile',
      icon: 'https://cdn-icons-png.flaticon.com/512/2922/2922561.png',
      navigate: 'EditProfile',
    },
    {
      id: 2,
      title: 'My Appointments',
      icon: 'https://cdn-icons-png.flaticon.com/128/9411/9411437.png',
      navigate: 'Appointment',
    },
    {
      id: 7,
      title: 'QuickMySlot Wallet',
      icon: 'https://cdn-icons-png.flaticon.com/128/3258/3258446.png',
      navigate: 'Wallet',
    },
    {
      id: 3,
      title: 'Terms & Conditions',
      icon: 'https://cdn-icons-png.flaticon.com/128/1458/1458279.png',
      navigate: 'Cms',
      params: {
        title: `Terms & Conditions`,
        slug: 'terms-condition',
      },
    },
    {
      id: 4,
      title: 'About Us',
      icon: 'https://cdn-icons-png.flaticon.com/128/16343/16343680.png',
      navigate: 'Cms',
      params: {
        title: `About Us`,
        slug: 'about-us',
      },
    },
    {
      id: 5,
      title: 'Support',
      icon: 'https://cdn-icons-png.flaticon.com/128/8898/8898827.png',
      navigate: 'Support',
    },
    {
      id: 6,
      title: 'Invite family and Friends',
      icon: 'https://cdn-icons-png.flaticon.com/128/10206/10206656.png',
      navigate: 'Invite',
    },
    {
      id: 7,
      title: 'Change Password',
      icon: 'https://cdn-icons-png.flaticon.com/128/11135/11135307.png',
      navigate: 'ForgotPassword',
    },
    {
      id: 8,
      title: 'FAQ',
      icon: 'https://cdn-icons-png.flaticon.com/128/4403/4403603.png',
      navigate: 'Faq',
    },
  ];

  return (
    <View style={styles.container}>
      <HomeHeader
        title="Profile"
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.black}
      />
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View>
          <Image
            source={{uri: profileImage?.uri}}
            style={styles.profileImage}
          />
        </View>
        <Typography size={20} fontWeight="bold" color={COLOR.black}>
          John Doe
        </Typography>
        <Typography size={14} color={COLOR.GRAY} style={{marginTop: 4}}>
          john@example.com
        </Typography>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20}}>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          {tabs.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.tabItem}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(item.navigate, item.params)}>
              <View style={styles.tabLeft}>
                <Image source={{uri: item.icon}} style={styles.leftIcon} />
                <Typography size={16} color={COLOR.black}>
                  {item.title}
                </Typography>
              </View>
              <Image source={{uri: arrowIcon}} style={styles.arrowIcon} />
            </TouchableOpacity>
          ))}
        </View>
        <Button
          title={'Log Out'}
          containerStyle={{marginTop: 15, marginBottom: 0}}
          onPress={() => setVisible(true)}
        />
        <Button
          titleColor={COLOR.red}
          title={'Delete Account'}
          containerStyle={{
            marginTop: 20,
            backgroundColor: COLOR.white,
            borderWidth: 1,
            borderColor: COLOR.red,
            marginBottom: 20,
          }}
          onPress={() => setDeleteAccount(true)}
        />
      </ScrollView>
      <ConfirmModal
        visible={visible}
        close={() => setVisible(false)}
        title="Logout"
        description="Are you sure you want to logout?"
        yesTitle="Yes"
        noTitle="No"
        onPressYes={() => {}}
        onPressNo={() => setVisible(false)}
      />
      <ConfirmModal
        visible={deleteAccount}
        close={() => setDeleteAccount(false)}
        title="Delete Account"
        description="Are you sure you want to Delete Account?"
        yesTitle="Yes"
        noTitle="No"
        onPressYes={() => {}}
        onPressNo={() => setDeleteAccount(false)}
      />
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
    paddingHorizontal: 15,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: COLOR.white || '#f9f9f9',
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  tabContainer: {
    marginTop: 20,
    backgroundColor: COLOR.white,
  },
  tabItem: {
    backgroundColor: COLOR.white,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginVertical: 6,
    borderRadius: 10,
    borderWidth: 0.8,
    borderColor: COLOR.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: COLOR.primary,
  },
  tabLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginRight: 12,
  },
  arrowIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: '#999',
  },
});
