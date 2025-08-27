import React from 'react';
import {TextInput, StyleSheet, View, Text} from 'react-native';
import {COLOR} from '../Constants/Colors';
import {windowWidth} from '../Constants/Dimensions';
import {ErrorBox} from './UI/ErrorBox';

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
  ...rest
}) => {
  return (
    <View style={[styles.inputWrapper, mainStyle]}>
      <View style={{flexDirection: 'row'}}>
        {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
        {showStar && <Text style={{color: COLOR.red, fontSize: 16}}> *</Text>}
      </View>
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
      {error && <ErrorBox error={error} style={{marginTop: 2}} />}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  inputWrapper: {
    width: '100%',
    marginTop: 20,
    // alignItems: 'center',
    // marginVertical: 10,
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontSize: 14,
    fontWeight: '500',
    color: COLOR.black,
  },
  input: {
    backgroundColor: COLOR.white,
    borderWidth: 1,
    borderColor: COLOR.primary,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: COLOR.black,
    width: '100%',
    alignSelf: 'center',
  },
  multilineInput: {
    paddingVertical: 10,
    minHeight: 100, // default height for multiline
  },
});
