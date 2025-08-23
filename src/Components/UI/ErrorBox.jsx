import React from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';


export const ErrorBox = ({ error, style }) => {
  return (
      <Text
        numberOfLines={2}
        adjustsFontSizeToFit
        style={[
          {
            fontSize: 13,
            color: 'red',
            alignSelf: 'flex-end',
            width: '100%',
            marginTop: 5,
            textAlign: 'right',
          },
          style,
        ]}
      >
        {error}
      </Text>
  );
};
