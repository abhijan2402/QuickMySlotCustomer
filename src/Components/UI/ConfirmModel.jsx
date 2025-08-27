import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import {images} from './images';
import {Typography} from './Typography';
import {COLOR} from '../../Constants/Colors';

const ConfirmModal = ({
  visible = false,
  close = () => {},
  title,
  description,
  onPressYes = () => {},
  onPressNo = () => {},
  yesTitle = 'Yes',
  noTitle = 'No',
  loading,
}) => {
  return (
    <Modal
      statusBarTranslucent
      onRequestClose={() => close()}
      animationType="fade"
      transparent={true}
      visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modalView}>
          {/* Cross Icon */}
          <TouchableOpacity style={styles.crossBtn} onPress={close}>
            <Image source={images.cross} style={{height: 18, width: 18}} />
          </TouchableOpacity>

          {/* Title */}
          <Typography size={20} textAlign="center" fontWeight={'500'}>
            {title}
          </Typography>

          {/* Description */}
          {description && (
            <Typography
              style={{marginTop: 15}}
              textAlign="center"
              size={16}
              lineHeight={20}
              color="rgba(0, 0, 0, 0.69)">
              {description}
            </Typography>
          )}

          {/* Buttons Row */}
          <View style={styles.btnRow}>
            {/* No Button */}
            <TouchableOpacity
              style={[styles.btn, styles.noBtn]}
              onPress={onPressNo || close}>
              <Typography size={16} fontWeight={'500'} color={COLOR.primary}>
                {noTitle}
              </Typography>
            </TouchableOpacity>

            {/* Yes Button */}
            <TouchableOpacity
              style={[styles.btn, styles.yesBtn]}
              onPress={onPressYes}
              disabled={loading}>
              <Typography size={16} fontWeight={'500'} color={'#fff'}>
                {loading ? '...' : yesTitle}
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalView: {
    width: '95%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 24,
    paddingTop: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  crossBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 6,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 26,
  },
  btn: {
    flex: 1,
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  noBtn: {
    borderWidth: 1,
    borderColor: COLOR.primary,
    marginRight: 10,
    backgroundColor: 'transparent',
  },
  yesBtn: {
    backgroundColor: COLOR.primary,
  },
});
