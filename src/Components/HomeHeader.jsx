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

const HomeHeader = ({title, leftIcon, rightIcon, leftTint, rightTint,rightIconTwo,onPressRightIconTwo,rightIconTwoStyle}) => {
  const navigation = useNavigation(); // Assuming you're using react-navigation
  return (
    <View style={styles.header}>
      {/* Left Icon */}
      <TouchableOpacity
      style={{
        width:"20%"
      }}
        onPress={() => {
          navigation.goBack();
        }}>
        <Image
          source={{uri: leftIcon}}
          style={[styles.icon, leftTint && {tintColor: leftTint}]}
        />
      </TouchableOpacity>
      {/* Title */}
      <View style={{
        flex:1,
        alignItems:'center'
      }}>
      <Text style={styles.title}>{title}</Text>
      </View>
      {/* Right Icon */}
      <View style={{flexDirection:'row',justifyContent:'flex-end',width:"20%"}}>
        {rightIconTwo && (
          <TouchableOpacity onPress={onPressRightIconTwo}>
          <Image
            source={{uri: rightIconTwo}}
            style={[styles.icon,  {marginRight:5} , rightIconTwoStyle]}
          />
          </TouchableOpacity>
        )}
        <Image
          source={{uri: rightIcon}}
          style={[styles.icon, rightTint , {tintColor: rightTint,marginRight:10}]}
        />
      </View>
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
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 5 : 0,
    paddingTop: Platform.OS === 'android' ?  10 : 0,
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
