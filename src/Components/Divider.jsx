import React from 'react';
import { View } from 'react-native';

const Divider = ({ height = 1.5, color = '#E0E0E0', marginVertical = 10 }) => {
    return (
        <View
            style={{
                height: height,
                backgroundColor: color,
                width: '100%',
                marginVertical: marginVertical,
            }}
        />
    );
};

export default Divider;
