import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Share,
  Clipboard,
  Alert,
  Linking,
  Image,
} from 'react-native';
import HomeHeader from '../../../Components/HomeHeader';
import {COLOR} from '../../../Constants/Colors';
import {windowWidth} from '../../../Constants/Dimensions';

const Invite = () => {
  const [inviteCode] = useState('QMS12345');
  const referralLink = `https://quickmyslot.com/invite/${inviteCode}`;

  const handleCopy = () => {
    Clipboard.setString(referralLink);
    Alert.alert('Copied!', 'Your invite link has been copied to clipboard.');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join QuickMySlot and get exclusive benefits! Use my link: ${referralLink}`,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const openLink = url => {
    Linking.openURL(url).catch(err =>
      console.error('Failed to open link:', err),
    );
  };

  return (
    <View style={styles.container}>
      <HomeHeader
        title="Invite Friends"
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.black}
      />

      <View style={styles.content}>
        <Text style={styles.subText}>
          Share your referral link with friends and get rewards when they join.
        </Text>

        <View style={styles.inviteBox}>
          <Text style={styles.inviteCode}>{inviteCode}</Text>
          <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
            <Text style={styles.copyBtnText}>Copy</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Text style={styles.shareBtnText}>Share Invite Link</Text>
        </TouchableOpacity>

        {/* Follow Us Section in Card */}
        <View style={styles.card}>
          <Text style={styles.followHeading}>Follow us on</Text>
          <View style={styles.socialContainer}>
            <TouchableOpacity onPress={() => openLink('https://facebook.com/')}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/128/5968/5968764.png',
                }}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openLink('https://instagram.com/')}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/128/2111/2111463.png',
                }}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openLink('https://x.com/')}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/128/5968/5968830.png',
                }}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  content: {
    marginTop: 20,
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: COLOR.black,
  },
  subText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
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
    marginBottom: 20,
  },
  inviteCode: {
    fontSize: 18,
    fontWeight: '600',
    color: COLOR.primary,
    flex: 1,
  },
  copyBtn: {
    backgroundColor: COLOR.primary,
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 5,
  },
  copyBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  shareBtn: {
    backgroundColor: COLOR.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shareBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 3},
    elevation: 4,
    alignItems: 'center',
    width: windowWidth / 1.1222,
  },
  followHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: COLOR.black,
    marginBottom: 12,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
    padding: 5,
  },
});
