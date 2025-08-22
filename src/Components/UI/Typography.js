import { StyleSheet, Text as RNText } from 'react-native';
import React from 'react';
import { COLOR } from '../../Constants/Colors';

export const Typography = ({
  size = 14,
  children,
  font = '',
  color = COLOR?.black,
  textAlign = undefined,
  style = {},
  numberOfLines,
  lineHeight,
  fontWeight,
  disabled=true,
  onPress=()=>{},
  letterSpacing,
  ...props
}) => {
  return (
    <RNText
      numberOfLines={numberOfLines}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.font,
        {
          fontSize: size,
          color: color,
          textAlign,
          fontWeight: fontWeight,
          lineHeight: lineHeight,
          // fontFamily: font,
          letterSpacing: letterSpacing
        },
        style,
      ]}
      {...props}>
      {children}
    </RNText>
  );
};
const styles = StyleSheet.create({
  font: {
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});
