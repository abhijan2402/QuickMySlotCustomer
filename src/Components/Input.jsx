import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { COLOR } from '../Constants/Colors';
import { windowWidth } from '../Constants/Dimensions';

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
  showStar = true,
  ...rest
}) => {
  return (
    <View style={[styles.inputWrapper, mainStyle]}>
      <View style={{ flexDirection: 'row', }}>
        {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
        {
          showStar && <Text style={{ color: COLOR.red, fontSize: 16 }}> *</Text>
        }

      </View>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={COLOR.grey}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        style={[styles.input, style]}
        {...rest}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  inputWrapper: {
    width: '100%',
    marginVertical: 10,
    // alignItems: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: windowWidth * 0.03,
    marginBottom: 5,
    fontSize: 14,
    fontWeight: '500',
    color: COLOR.black,
  },
  input: {
    backgroundColor: COLOR.white,
    borderWidth: 1,
    borderColor: '#2196F3FF',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: COLOR.black,
    width: windowWidth / 1.16,
    alignSelf: 'center',
  },
});
