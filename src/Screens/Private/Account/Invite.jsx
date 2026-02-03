import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Share,
  Clipboard,
  Alert,
  Linking,
  Image,
  ScrollView,
} from 'react-native';
import HomeHeader from '../../../Components/HomeHeader';
import { COLOR } from '../../../Constants/Colors';
import { windowWidth } from '../../../Constants/Dimensions';
import { Typography } from '../../../Components/UI/Typography';
import { useSelector } from 'react-redux';

const Invite = () => {
  const userdata = useSelector(store => store.userDetails);
  const inviteCode = userdata?.refer_code;
  const referralLink = `https://quickmyslot.com/invite/${inviteCode}`;

  const handleCopy = () => {
    Clipboard.setString(referralLink);
    Alert.alert('Copied!', 'Your invite link has been copied.');
  };

  const handleShare = async () => {
    await Share.share({
      message: `Invite friends to QuickMySlot 🎉\nGet rewards on every booking.\nUse my link: ${referralLink}`,
    });
  };

  const openLink = url => {
    Linking.openURL(url).catch(err =>
      console.error('Failed to open link:', err),
    );
  };

  return (
    <View style={styles.container}>
      <HomeHeader title="Invite Friends" leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.black} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70',
          }}
          style={styles.banner}
        />

        {/* Title */}
        <Typography style={styles.mainTitle}>
          Invite & Earn with QuickMySlot
        </Typography>

        {/* Steps */}
        <View style={styles.stepsWrapper}>
          <View style={styles.stepRow}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/128/3144/3144456.png' }}
              style={styles.stepIcon}
            />
            <View>
              <Typography style={styles.stepTitle}>
                Complete your first payment
              </Typography>
              <Typography style={styles.stepDesc}>
                Unlock your personalized invite code.
              </Typography>
            </View>
          </View>

          <View style={styles.dashedLine} />

          <View style={styles.stepRow}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/128/929/929426.png' }}
              style={styles.stepIcon}
            />
            <View>
              <Typography style={styles.stepTitle}>
                Invite friends & family
              </Typography>
              <Typography style={styles.stepDesc}>
                They get discounts & wallet benefits.
              </Typography>
            </View>
          </View>

          <View style={styles.dashedLine} />

          <View style={styles.stepRow}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/128/3135/3135706.png' }}
              style={styles.stepIcon}
            />
            <View>
              <Typography style={styles.stepTitle}>
                Earn rewards
              </Typography>
              <Typography style={styles.stepDesc}>
                Get ₹50 for every successful booking.
              </Typography>
            </View>
          </View>
        </View>

        {/* Invite Code */}
        <View style={styles.inviteBox}>
          <Typography style={styles.inviteCode}>{inviteCode}</Typography>
          <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
            <Typography style={styles.copyBtnText}>Copy</Typography>
          </TouchableOpacity>
        </View>

        {/* Share */}
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Typography style={styles.shareBtnText}>
            Share Invite Link
          </Typography>
        </TouchableOpacity>

        {/* Social */}
        <View style={styles.card}>
          <Typography style={styles.followHeading}>Follow us on</Typography>
          <View style={styles.socialContainer}>
            <TouchableOpacity onPress={() => openLink('https://www.facebook.com/share/1BAA8a2AjV/?mibextid=wwXIfr')}>
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/128/5968/5968764.png' }}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openLink('https://www.instagram.com/QuickMySlot?igsh=cmd0cWxkOTl2eDRr&utm_source=qr')}>
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/128/2111/2111463.png' }}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openLink('https://www.youtube.com/channel/UCVxlXRdkkk0ZSUn1-7vd_6A')}>
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/128/3670/3670147.png' }}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Invite;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
    paddingHorizontal: 15,
  },
  banner: {
    width: windowWidth - 30,
    height: 180,
    borderRadius: 16,
    marginTop: 15,
    alignSelf: 'center',
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLOR.black,
    textAlign: 'center',
    marginTop: 15,
  },
  stepsWrapper: {
    marginTop: 25,
    paddingHorizontal: 10,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  stepIcon: {
    width: 45,
    height: 45,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLOR.black,
  },
  stepDesc: {
    fontSize: 13,
    color: '#777',
    marginTop: 3,
    width: windowWidth / 1.6,
  },
  dashedLine: {
    height: 25,
    borderLeftWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    marginLeft: 22,
    marginVertical: 8,
  },
  inviteBox: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 25,
  },
  inviteCode: {
    fontSize: 18,
    fontWeight: '700',
    color: COLOR.primary,
    flex: 1,
  },
  copyBtn: {
    backgroundColor: COLOR.primary,
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 6,
  },
  copyBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  shareBtn: {
    backgroundColor: COLOR.primary,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  shareBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 30,
    elevation: 4,
    alignItems: 'center',
  },
  followHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: COLOR.black,
    marginBottom: 12,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 40,
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
