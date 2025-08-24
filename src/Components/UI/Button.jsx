import {
  StyleSheet,
  Keyboard,
  ActivityIndicator,
  Image,
  View,
  Platform,
} from 'react-native';
import React from 'react';
import {Typography} from './Typography';
import { COLOR } from '../../Constants/Colors';
import { TouchableOpacity } from 'react-native';

const Button = ({
  onPress = () => {},
  title,
  containerStyle = {},
  disabled = false,
  loading = false,
  titleSize = 15,
  titleColor,
  titleType = 'semiBold',
  activeOpacity = 0.9,
  indicolor = 'white',
  leftImg,
  leftImgStyle,
  titleContainerStyle,
  colorsicon,
  leftIcon='',
  indStyle,
  leftIconValue = false,
}) => {

  const handlebutton = () => {
    if (loading || disabled) {
    } else {
      Keyboard.dismiss();
      onPress();
    }
  };
  const styles = createStyles(COLOR);
  return (
    <TouchableOpacity
      disabled={disabled || loading}
      activeOpacity={activeOpacity}
      onPress={handlebutton}
      style={[styles.buttons, containerStyle]}>
      {loading ? (
        <ActivityIndicator
          size={'small'}
          color={indicolor}
          style={[styles.indicator, indStyle]}
        />
      ) : (
        <View style={[styles.textContainer, titleContainerStyle]}>
          {leftImg && <Image source={leftImg} style={leftImgStyle} />}
          {leftIconValue && (
            <Image
              source={leftIcon}
              style={{width: 20, height: 20, tintColor: colorsicon}}
            />
          )}
          <Typography
            size={titleSize}
            color={titleColor ?? COLOR.white}
            font={titleType}
            style={{
              marginLeft: leftIcon ? 5 : 0,
            }}
            numberOfLines={1}>
            {title}
          </Typography>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;

const createStyles = (theme  ) =>
  StyleSheet.create({
    buttons: {
      backgroundColor: theme?.buttonColor,
      borderRadius: 7,
      height: 55,
      width: '100%',
      alignSelf: 'center',
      justifyContent: 'center',
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0.2,
      shadowRadius: 4,
      elevation: Platform.OS === 'ios' ? 0 : 5,
    },
    indicator: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
    },

    textContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
  });
