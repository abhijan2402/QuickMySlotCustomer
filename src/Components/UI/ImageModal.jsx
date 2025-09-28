import React from 'react';
import {
  StyleSheet,
  Modal,
  View,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import DocumentPicker, {pick} from '@react-native-documents/picker';
import SimpleToast from 'react-native-simple-toast';
import { Typography } from './Typography';
import { Font } from '../../Constants/Font';
import { images } from './images';
import { COLOR } from '../../Constants/Colors';
import { windowWidth } from '../../Backend/Utility';

const ImageModal = ({
  showModal,
  documents = false,
  document = false,
  close = () => {},
  selected = () => {},
  TimeVal,
  deleteImage = false,
  showCropCircle = false,
  onPressRemove = () => {},
}) => {

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to your camera.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        return false;
      }
    }
    return true;
  };

  const requestGalleryPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            {
              title: 'Gallery Permission',
              message: 'App needs access to your gallery to select images.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'Gallery Permission',
              message: 'App needs access to your gallery to select images.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      } catch (err) {
        console.error('Gallery permission error:', err);
        return false;
      }
    }
    return true;
  };

  const captureImage = async (type, cropImage = 'Profile', callback = () => {}) => {
    try {
      const options = {
        mediaType: 'photo',
        ...(!documents && {
          width: 500,
          height: 500,
        }),
        quality: 1,
        cropping: true,
        includeBase64: true,
        showCropFrame: true,
        cropperCircleOverlay: showCropCircle,
      };

      if (type === 'camera') {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) {
          close();
          SimpleToast.show(
            'Camera permission denied. Please provide camera permission to use this feature.',
            SimpleToast.SHORT,
          );
          return;
        }
      } else {
        const hasPermission = await requestGalleryPermission();
        if (!hasPermission) {
          close();
          SimpleToast.show(
            'Gallery permission denied. Please provide gallery permission to use this feature.',
            SimpleToast.SHORT,
          );
          return;
        }
      }

      const pickerFn = type === 'camera'
        ? ImageCropPicker.openCamera
        : ImageCropPicker.openPicker;
      const res = await pickerFn(options);

      const imageData = {
        name: res.filename || res.path.split('/').pop(),
        type: res.mime,
        uri: res.path,
      };

      callback(imageData, type);
      close();
    } catch (err) {
      if (err.code !== 'E_PICKER_CANCELLED') {
        console.error('Image picker error:', err?.message);
        SimpleToast.show(err?.message, SimpleToast.SHORT);
      }
    }
  };

  const OpenCamera = () => {
    captureImage('camera', 'Profile', selected);
  };

  const OpenGallery = () => {
    captureImage('gallery', 'Profile', selected);
  };

  const OpenDocument = async () => {
    try {
      const [file] = await pick({
        type: ['application/pdf'],
        allowMultiSelection: false,
      });
      selected(file, 'document');
      close();
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error('Document picker error:', err);
        SimpleToast.show('Error picking document', SimpleToast.SHORT);
      }
    }
  };

  return (
    <Modal
      statusBarTranslucent
      onRequestClose={close}
      transparent
      animationType="slide"
      visible={showModal}>
      <View style={styles.modalContainer}>
        <View
          style={[
            styles.modalContent,
            {height: documents ? windowWidth / 1.6 : windowWidth / 2},
          ]}>
          <View style={styles.modalHeader}>
            <Typography size={20} font={Font.semibold}>
              {documents ? 'Upload Document' : 'Upload Profile Image'}
            </Typography>
            <TouchableOpacity onPress={close}>
              <Image
                source={images.close}
                style={{height: 20, width: 20, }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.modalView,
              {
                height: documents || document ? 280 : deleteImage ? 220 : 200,
              },
            ]}>
            <TouchableOpacity style={styles.checkView} onPress={OpenCamera}>
              <View style={styles.iconContainer}>
                <Image
                  style={styles.icon}
                  source={images.camera}
                />
              </View>
              <Typography size={15} style={{marginLeft: 15}}>
                Capture Photo
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity style={styles.checkView} onPress={OpenGallery}>
              <View style={styles.iconContainer}>
                <Image
                  style={styles.icon}
                  source={images.gallery}
                />
              </View>
              <Typography size={15} style={{marginLeft: 15}}>
                Gallery Photo
              </Typography>
            </TouchableOpacity>

            {/* {!documents && (
              <TouchableOpacity style={styles.checkView} onPress={onPressRemove}>
                <View style={styles.iconContainer}>
                  <Image style={[styles.icon]} source={images.Document} />
                </View>
                <Typography size={20} style={{marginLeft: 15}}>
                  Remove Photo
                </Typography>
              </TouchableOpacity>
            )} */}

            {(documents || document) && (
              <TouchableOpacity style={styles.checkView} onPress={OpenDocument}>
                <View style={styles.iconContainer}>
                  <Image
                    style={styles.icon}
                    source={images.documentation}
                  />
                </View>
                <Typography size={15} style={{marginLeft: 15}}>
                  Choose Document
                </Typography>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ImageModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: COLOR.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  modalHeader: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLOR.primary,
    paddingHorizontal: 10,
  },
  checkView: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  modalView: {
    borderRadius: 10,
    marginTop: 20,
  },
  iconContainer: {
    borderRadius: 50,
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    height: 25,
    width: 25,
  },
});
