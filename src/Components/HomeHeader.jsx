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
import {COLOR} from '../Constants/Colors';
import {useNavigation} from '@react-navigation/native';
import {Font} from '../Constants/Font';

const HomeHeader = ({
  title,
  leftIcon,
  rightIcon,
  leftTint,
  rightTint,
  rightIconTwo,
  onPressRightIconTwo,
  rightIconTwoStyle,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.safeArea}>
      <View style={styles.header}>
        {/* Left Icon */}
        <TouchableOpacity
          style={{width: '20%'}}
          onPress={() => {
            navigation.goBack();
          }}>
          {leftIcon && (
            <Image
              source={{uri: leftIcon}}
              style={[styles.icon, leftTint && {tintColor: leftTint}]}
            />
          )}
        </TouchableOpacity>

        {/* Title */}
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={styles.title}>{title}</Text>
        </View>

        {/* Right Icons */}
        <View style={styles.rightContainer}>
          {rightIconTwo && (
            <TouchableOpacity onPress={onPressRightIconTwo}>
              <Image
                source={{uri: rightIconTwo}}
                style={[styles.icon, {marginRight: 5}, rightIconTwoStyle]}
              />
            </TouchableOpacity>
          )}
          {rightIcon && (
            <Image
              source={{uri: rightIcon}}
              style={[styles.icon, {tintColor: rightTint, marginRight: 10}]}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Fix overlap
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    // paddingHorizontal: 10,
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  rightContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '20%',
  },
  title: {
    fontSize: 18,
    fontFamily: Font.semibold,
    color: COLOR.black,
  },
});
