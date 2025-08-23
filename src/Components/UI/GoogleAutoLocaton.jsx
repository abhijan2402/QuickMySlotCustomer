import React, {forwardRef, useEffect, useImperativeHandle, useRef} from 'react';
import {StyleProp, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {useIsFocused} from '@react-navigation/native';
import {Typography} from './Typography';
import {ErrorBox} from './ErrorBox';
import { COLOR } from '../../Constants/Colors';


const GoogleAutoLocaton = forwardRef(
  (
    {
      error,
      placeholder = '',
      onPress = () => {},
      value,
      onChangeText = () => {},
      predefinedPlaces,
      mainStyle = {},
      editable,
      inputStyle = {},
      req = false,
      title,
      labelStyle = {},
    },
    ref,
  ) => {
    const addressRef = useRef<any>(null);
    const isFocused = useIsFocused();

    useImperativeHandle(ref, () => ({
      clearAddress: () => {
        addressRef?.current?.setAddressText('');
      },
      setAddress: (text) => {
        addressRef?.current?.setAddressText(text);
      },
    }));

    useEffect(() => {
      if (isFocused && addressRef?.current) {
        addressRef.current.setAddressText(value);
      }
    }, [isFocused]);

    return (
      <View
        style={[
          {
            width: '100%',
            borderBottomWidth: 1,
            marginTop: 16,
            borderBottomColor: COLOR?.lightBlue,
          },
          mainStyle,
        ]}>
        {title && (
          <View
            style={{
              paddingStart: 18,
            }}>
            <Typography
              size={16}
              color={COLOR.black}
              style={[labelStyle]}>
              {title}
              {req && <Typography color="#D90028">*</Typography>}
            </Typography>
          </View>
        )}

        <View style={[styles.TextInput, inputStyle]}>
          <GooglePlacesAutocomplete
            ref={addressRef}
            debounce={10}
            minLength={1}
            disableScroll={true}
            placeholder={placeholder}
            keyboardShouldPersistTaps="always"
            enablePoweredByContainer={false}
            predefinedPlaces={predefinedPlaces}
            fetchDetails={true}
            onPress={onPress}
            textInputProps={{
              placeholderTextColor: COLOR.black,
              onChangeText: onChangeText,
              editable: editable,
              multiline: false,
            }}
            query={{
              key: '',
              language: 'en',
            }}
            styles={{
              textInputContainer: {
                height: 50,
                width: '100%',
                paddingLeft: 17,
                backgroundColor: COLOR.white,
                borderColor: COLOR.black,
              },
              textInput: {
                height: 50,
                backgroundColor: COLOR.white,
                color: editable ? COLOR.black : COLOR.black,
                fontSize: 19,
                paddingRight: 1,
                paddingLeft: 1,
              },
              row: {
                backgroundColor: 'transparent',
              },
              description: {
                color: COLOR.black,
              },
              listView: {
                borderWidth: 1,
                borderColor: COLOR.black,
                borderRadius: 4,
                marginTop: 14,
              },
              separator: {
                backgroundColor: COLOR.black,
              },
            }}
            onFail={() => {}}
            onNotFound={() => {}}
          />
        </View>
        {error && <ErrorBox error={error} />}
      </View>
    );
  },
);

export default GoogleAutoLocaton;

const styles = StyleSheet.create({
  TextInput: {
    width: '100%',
  },
});
