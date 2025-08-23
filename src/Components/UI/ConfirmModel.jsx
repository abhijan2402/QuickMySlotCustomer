import {StyleSheet, View, Modal, Platform, Image} from 'react-native';
import React from 'react';
import {Typography} from '../HOC/Typography';
import Button from '../HOC/Button';
import {fonts} from '../../constant/fonts';
import {useAppSelector} from '../../hooks/hooks';
import {ThemeColors} from '../../theme/colors';
import images from '../../constant/images';

interface ConfirmModalProps {
  visible?: boolean;
  close?: () => void;
  title?: string;
  description?: string;
  onPress_Yes?: () => void;
  btnTitle?: string;
  loading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  close = () => {},
  title,
  description,
  onPress_Yes = () => {},
  btnTitle,
  loading,
}) => {
  const theme = useAppSelector(state => state.theme.theme);
  const styles = createStyles(theme);
  return (
    <Modal
      statusBarTranslucent
      onRequestClose={() => close()}
      animationType="fade"
      transparent={true}
      visible={visible}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={[styles.overlay]}>
        <View style={styles.modalView}>
          <Image
            source={images.tick}
            style={{height: 42, width: 42, alignSelf: 'center'}}
          />
          <Typography
            size={24}
            lineHeight={27}
            font={fonts.BOLD}
            textAlign="center"
            style={{marginTop: 20}}>
            {title}
          </Typography>
          {description && (
            <Typography
              style={{marginTop: 10}}
              textAlign="center"
              size={16}
              lineHeight={20}
              color="rgba(0, 0, 0, 0.69)">
              {description}
            </Typography>
          )}

          <Button
            loading={loading}
            title={btnTitle}
            containerStyle={{
              marginTop: 26,
              borderRadius: 5,
            }}
            onPress={onPress_Yes}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;

const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      justifyContent: 'center',
      paddingHorizontal: 22,
    },
    modalView: {
      backgroundColor: theme?.primary,
      borderRadius: 7,
      padding: 24,
      paddingTop: 30,
      shadowColor: 'rgba(0, 0, 0, 0.15)',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0.2,
      shadowRadius: 4,
      elevation: Platform.OS === 'ios' ? 0 : 5,
    },
  });
