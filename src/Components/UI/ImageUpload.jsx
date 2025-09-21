import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import { COLOR } from '../../Constants/Colors';
import { images } from './images';

const ImageUpload = ({onPress}) => {
  return (
    <TouchableOpacity
      style={styles.uploadBox}
      onPress={onPress}>
      <View style={styles.uploadContent}>
        <Image source={images.upload} style={styles.uploadIcon} />
        <Text style={styles.uploadTitle}>Upload Image</Text>
        <Text style={styles.uploadSubtitle}>JPG / PNG only</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ImageUpload;

const styles = StyleSheet.create({
    uploadBox: {
        borderWidth: 1,
        borderColor: COLOR.primary,
        borderRadius: 12,
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(121, 111, 195, 0.08)',
        borderStyle: 'dashed',
      },
      uploadContent: {
        alignItems: 'center',
      },
      uploadIcon: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
        marginBottom: 8,
        tintColor: COLOR.primary, // optional
      },
      uploadTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLOR.primary,
        marginBottom: 4,
      },
      uploadSubtitle: {
        fontSize: 12,
        color: '#666',
      },
});
