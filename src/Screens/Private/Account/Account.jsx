import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { COLOR } from '../../../Constants/Colors';
import { AuthContext } from '../../../Backend/AuthContent';
import HomeHeader from '../../../Components/HomeHeader';
import Button from '../../../Components/UI/Button';
import ConfirmModal from '../../../Components/UI/ConfirmModel';
import { Typography } from '../../../Components/UI/Typography';
import { Font } from '../../../Constants/Font';
import { useDispatch, useSelector } from 'react-redux';
import { isAuth, logOut, Token, userDetails } from '../../../Redux/action';
import { DELETE_ACCOUNT } from '../../../Constants/ApiRoute';
import { POST_WITH_TOKEN } from '../../../Backend/Api';
import { cleanImageUrl } from '../../../Backend/Utility';
import { images } from '../../../Components/UI/images';

const Account = ({ navigation }) => {
  const { setUser } = useContext(AuthContext);

  const [visible, setVisible] = useState(false);
  const [deleteAccount, setDeleteAccount] = useState(false);
  const dispatch = useDispatch();
  const userdata = useSelector(store => store.userDetails);
  const [loading, setLoading] = useState(false);
  const token = useSelector(store => store.Token);
  console.log(token);

  const profileImage = userdata?.image
    ? userdata?.image
    : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
  console.log(userdata, 'profileImageprofileImage-->>');

  const arrowIcon = 'https://cdn-icons-png.flaticon.com/512/271/271228.png'; // right arrow icon
  const tabs = [
    {
      id: 1,
      title: 'Edit Profile',
      icon: images.user,
      navigate: 'EditProfile',
    },
    {
      id: 2,
      title: 'Membership',
      icon: images.membership,
      navigate: 'Membership',
    },
    {
      id: 9,
      title: 'Wishlist',
      icon: images.wishlist,
      navigate: 'Wishlist',
    },
    {
      id: 7,
      title: 'QuickMySlot Wallet',
      icon: images.wallet,
      navigate: 'Wallet',
    },
    {
      id: 3,
      title: 'Terms & Conditions',
      icon: images.tc,
      navigate: 'Cms',
      params: { title: 'Terms & Conditions', slug: 'terms-condition' },
    },
    {
      id: 4,
      title: 'About Us',
      icon: images.aboutUs,
      navigate: 'Cms',
      params: { title: 'About Us', slug: 'about-us' },
    },
    {
      id: 5,
      title: 'Support',
      icon: images.supportAccount,
      navigate: 'Support',
    },
    {
      id: 6,
      title: 'Invite family and Friends',
      icon: images.userAccount,
      navigate: 'Invite',
    },
    {
      id: 8,
      title: 'FAQ',
      icon: images.faq,
      navigate: 'Faq',
    },
  ];

  const handleLogout = () => {
    setVisible(false);
    dispatch(isAuth(false));
    dispatch(Token(''));
    dispatch(userDetails({}));
    console.log('User logged out');
  };

  const handleDeleteAccount = () => {
    setLoading(true);
    POST_WITH_TOKEN(
      DELETE_ACCOUNT,
      success => {
        console.log(success, 'successsuccesssuccess-->>>');
        handleLogout();
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
  };
  return (
    <View style={styles.container}>
      <HomeHeader
        title="Profile"
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.black}
      />
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: cleanImageUrl(profileImage) }}
          style={styles.profileImage}
        />
        <Typography font={Font.semibold} variant="h2" color={COLOR.black}>
          {userdata?.name}
        </Typography>
        <Typography font={Font.semibold} variant="body2" color={COLOR.GRAY}>
          {userdata?.email || userdata?.phone_number}
        </Typography>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          {tabs.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.tabItem}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(item.navigate, item.params)}>
              <View style={styles.tabLeft}>
                <Image source={item.icon} style={styles.leftIcon} />
                <Typography font={Font.semibold} size={16} color={COLOR.black}>
                  {item.title}
                </Typography>
              </View>
              <Image source={{ uri: arrowIcon }} style={styles.arrowIcon} />
            </TouchableOpacity>
          ))}
        </View>
        <Button
          title={'Log Out'}
          containerStyle={{ marginTop: 15, marginBottom: 0 }}
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
        onPressYes={() => handleLogout()}
        onPressNo={() => setVisible(false)}
      />
      <ConfirmModal
        visible={deleteAccount}
        close={() => setDeleteAccount(false)}
        title="Delete Account"
        description="Are you sure you want to Delete Account?"
        yesTitle="Yes"
        noTitle="No"
        onPressYes={() => {
          handleDeleteAccount();
        }}
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
