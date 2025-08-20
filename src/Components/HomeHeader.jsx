import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {COLOR} from '../Constants/Colors'; // adjust path if needed
import {useNavigation} from '@react-navigation/native';

const HomeHeader = ({title, leftIcon, rightIcon, leftTint, rightTint}) => {
  const navigation = useNavigation(); // Assuming you're using react-navigation
  return (
    <View style={styles.header}>
      {/* Left Icon */}
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}>
        <Image
          source={{uri: leftIcon}}
          style={[styles.icon, leftTint && {tintColor: leftTint}]}
        />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Right Icon */}
      <Image
        source={{uri: rightIcon}}
        style={[styles.icon, rightTint && {tintColor: rightTint}]}
      />
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 5 : 0,
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLOR.black,
  },
});
