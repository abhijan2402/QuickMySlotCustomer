
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  StatusBar,
  Platform
} from 'react-native';
import { openCamera, openPicker } from 'react-native-image-crop-picker';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';
import { Typography } from './Typography';
import SimpleToast from 'react-native-simple-toast';
import { COLOR } from '../../Constants/Colors';


const ImageModal = ({
  multiple = false,
  showModal,
  close = () => { },
  selected = () => { },
  mediaType = 'photo',
}) => {
  const isIos = Platform.OS === 'ios';
  // const [check, setCheck] = React.useState(1);
  const checkBox = e => {
    setCheck(e);
    var ImagePicker = openPicker;
    if (e == 'camera') {
      ImagePicker = openCamera;
    }
    setTimeout(() => {
      ImagePicker({
        mediaType: mediaType,
        width: 500,
        height: 500,
        cropping: true,
      })
        .then(async response => {
          selected(response, e);
        })
        .catch(err => { });
    }, 200);
  };
  const OpenCamera = () => {
    setTimeout(() => {
      openCamera({
        mediaType: mediaType,
        width: 500,
        height: 500,
        cropping: mediaType != 'video',
      })
        .then(async response => {
          selected(response, 'camera');
          close();
        })
        .catch(err => {
          close();
        });
    }, 200);
  };
  const OpenGallery = () => {
    setTimeout(() => {
      openPicker({
        mediaType: mediaType,
        width: 500,
        height: 500,
        cropping: mediaType != 'video',
        multiple: multiple,
      })
        .then(async response => {
          selected(response, 'gallery');
          close();
        })
        .catch(err => {
          close();
        });
    }, 200);
  };
  const checkCameraPermission = () => {
    check(!isIos ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA)
      .then(result => {
        console.warn("ress",result);
        switch (result) {
          case RESULTS.UNAVAILABLE:
            requestCameraPermission();
            SimpleToast.show(
              `Camera feature is not available (on this device / in this context)`, SimpleToast.SHORT
            );
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            requestCameraPermission();
            break;
          case RESULTS.LIMITED:
            requestCameraPermission();
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            OpenCamera();
            console.log('The permission is granted');
            break;
          case RESULTS.BLOCKED:
            SimpleToast.show(`Please provide camera permission to use this feature.`);
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch(error => {
        console.log("error", error)
        SimpleToast.show(`Please provide camera permission to use this feature.`, SimpleToast.SHORT);
      });
  };

  const requestCameraPermission = () =>
    request(isIos ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA)
      .then(result => {
        if (result === 'granted') OpenCamera();
        else if (result === 'denied') checkCameraPermission();
      })
      .catch(e => console.warn(e));

  const checkPhotoPermission = () => {
    check(
      !isIos
        ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
        : PERMISSIONS.IOS.PHOTO_LIBRARY,
    )
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            SimpleToast.show(
              `This feature is not available (on this device / in this context)`, SimpleToast.SHORT
            );
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            requestPhotosPermission();
            break;
          case RESULTS.LIMITED:
            requestPhotosPermission();
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            OpenGallery();
            console.log('The permission is granted');
            break;
          case RESULTS.BLOCKED:
            SimpleToast.show(`Please provide storage permission to use this feature.`, SimpleToast.SHORT);
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch(error => {
        console.log("hereee", error)
        SimpleToast.show(`Please provide storage permission to use this feature`, SimpleToast.SHORT);
      });
  };

  const requestPhotosPermission = () => {
    request(
      isIos
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : Platform.constants['Release'] > 12
          ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    )
      .then(result => {
        if (result === 'granted' || result === 'limited') OpenGallery();
        else if (result === 'denied') checkPhotoPermission();
      })
      .catch(e => console.warn(e));
  };
  return (
    <>
      <Modal
        statusBarTranslucent
        onRequestClose={() => close()}
        transparent={true}
        style={{ height: '100%', flex: 1 }}
        visible={showModal}
        animationType="fade"
        presentationStyle="overFullScreen"
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={{
              height: '50%',
              width: '100%',
              backgroundColor: 'transparent',
            }}
            onPress={() => close()}
          />
          <View style={styles.bottomModal} >
            <View style={styles.modalShowSection}>
              <TouchableOpacity
                activeOpacity={1}
                style={{ alignSelf: 'flex-end', margin: 10 }}
                onPress={() => close()}>
                {/* <Icon source={icons?.ic_cancel} size={15} /> */}
              </TouchableOpacity>
              <View style={styles.modalView}>
                <View style={{ alignItems: 'center' }}>
                  <TouchableOpacity
                    style={styles.checkView}
                    onPress={checkCameraPermission}>
                    <Image
                      style={{ height: 50, width: 50, }}
                      source={require('../../assets/Images/camera.png')} // Replace with your camera icon
                    />
                    <Typography size={16}
                      color={COLOR.black}>
                      {"Camera"}
                    </Typography>
                  </TouchableOpacity>

                </View>
                <View style={{ alignItems: 'center' }}>
                  <TouchableOpacity
                    style={styles.checkView}
                    onPress={checkPhotoPermission}>
                    <Image
                      style={{ height: 50, width: 50, }}
                      source={require('../../assets/Images/picture.png')} // Replace with your gallery icon
                    />
                    <Typography
                      size={16}
                      color={COLOR.black}
                    >
                      {"Gallery"}
                    </Typography>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: COLOR.black + '80',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bottomModal: {
    width: '100%',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '100%',
    paddingBottom: 30,
    backgroundColor: COLOR?.white,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalShowSection: {
    width: '90%',
    backgroundColor: COLOR?.white,
    flexWrap: 'wrap',
    borderRadius: 8,
    marginBottom: 20,
  },
  checkView: {
    // width: '45%',
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    color: COLOR?.black,
  },
  check: {
    height: 16,
    width: 16,
    borderRadius: 15,
    backgroundColor: COLOR?.backgroundLight,
    borderWidth: 2,
    borderColor: COLOR?.dullWhite,
    marginRight: 15,
  },
});

export default ImageModal