import React from 'react';
import {TextInput, StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import {COLOR} from '../Constants/Colors';
import {ErrorBox} from './UI/ErrorBox';
import { Typography } from './UI/Typography';

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  style,
  labelStyle,
  mainStyle,
  showStar = false,
  multiline = false,
  height,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  onLeftIconPress,
  text,
  inputContainer,
  leftTintColor,
  rightIconStyle,
  ...rest
}) => {
  return (
    <View style={[styles.inputWrapper, mainStyle]}>
      {/* Label */}
      <View style={{flexDirection: 'row'}}>
        {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
        {showStar && <Text style={{color: COLOR.red, fontSize: 16}}> *</Text>}
      </View>

      {/* Input with icons */}
      <View style={[styles.inputContainer,inputContainer]}>
        {leftIcon && (
          <TouchableOpacity onPress={onLeftIconPress} activeOpacity={0.9}>
            { text ? <Typography size={16} fontWeight={'500'} style={styles.text}>{text}</Typography> : <Image source={leftIcon} style={styles.icon} tintColor={leftTintColor} />}
          </TouchableOpacity>
        )}

        <TextInput
          placeholder={placeholder}
          placeholderTextColor={COLOR.grey}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          style={[
            styles.input,
            multiline && styles.multilineInput,
            height && {height},
            style,
          ]}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...rest}
        />

        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress}>
            <Image source={rightIcon} style={[styles.icon,rightIconStyle]} />
          </TouchableOpacity>
        )}
      </View>

      {/* Error message */}
      {error && <ErrorBox error={error} style={{marginTop: 2}} />}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  inputWrapper: {
    width: '100%',
    marginTop: 20,
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontSize: 14,
    fontWeight: '500',
    color: COLOR.black,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLOR.primary,
    borderRadius: 10,
    backgroundColor: COLOR.white,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    color: COLOR.black,
    height: 52
  },
  multilineInput: {
    paddingVertical: 10,
    minHeight: 100,
  },
  icon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginHorizontal: 5,
  },
  text:{
    borderRightWidth:1,
    // borderRightColor: COLOR.lightGrey,
    paddingRight:5,
    marginRight:5
  }
});
