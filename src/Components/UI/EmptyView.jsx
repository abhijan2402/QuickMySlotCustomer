import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {images} from './images';
import {Typography} from './Typography';
import {Font} from '../../Constants/Font';

const EmptyView = ({style = {}, title = 'No record found!'}) => {
  return (
    <View
      style={[
        {
          alignSelf: 'center',
          marginTop: 10,
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        },
        style,
      ]}>
      <Image
        source={images.file}
        style={{
          height: 50,
          width: 50,
          alignSelf: 'center',
          marginBottom: 10,
        }}
      />
      <Typography font={Font.semibold} textAlign="center">
        {title}
      </Typography>
    </View>
  );
};

export default EmptyView;

const styles = StyleSheet.create({});
