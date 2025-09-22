import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import HomeHeader from '../../../Components/HomeHeader';
import {COLOR} from '../../../Constants/Colors';
import CustomButton from '../../../Components/CustomButton';
import {Typography} from '../../../Components/UI/Typography';
import Button from '../../../Components/UI/Button';
import {useIsFocused} from '@react-navigation/native';
import {GET_WITH_TOKEN, POST_FORM_DATA} from '../../../Backend/Api';
import {SUPPORT} from '../../../Constants/ApiRoute';
import {validators} from '../../../Backend/Validator';
import ImageModal from '../../../Components/UI/ImageModal';
import {images} from '../../../Components/UI/images';
import {ErrorBox} from '../../../Components/UI/ErrorBox';
import {windowWidth} from '../../../Constants/Dimensions';
import Input from '../../../Components/Input';
import { Font } from '../../../Constants/Font';
import ImageUpload from '../../../Components/UI/ImageUpload';
import { isValidForm } from '../../../Backend/Utility';

const Support = () => {
  const [tickets, setTickets] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [error, setError] = useState('');
  const [image, setImage] = useState('');
  console.log(image);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const isFocus = useIsFocused();

  useEffect(() => {
    if (isFocus) {
      getSupport();
    }
  }, [isFocus]);

  const getSupport = () => {
    setLoading(true);
    GET_WITH_TOKEN(
      SUPPORT,
      success => {
        setLoading(false);
        console.log(success, 'dsdsdsdeeeeeeeeeeeeweewew-->>>');
        setTickets(success?.data);
      },
      error => {
        console.log(error, 'errorerrorerror>>');
        setLoading(false);
      },
      fail => {
        console.log(fail, 'errorerrorerror>>');

        setLoading(false);
      },
    );
  };

  const handleImageSelected = (response, type) => {
    if (response) {
      setImage(response);
    }
    setShowModal(false);
  };

  const handleUpdate = () => {
    let validationErrors = {
      title: validators.checkRequire('Title', newTitle),
      description: validators.checkRequire('Description', newDesc),
      image: validators.checkRequire('image', image),
    };
    setError(validationErrors);
    if (isValidForm(validationErrors)) {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', newTitle);
      formData.append('description', newDesc);
      if (image) {
        formData.append('image', {
          uri: image.path,
          type: image.mime || 'image/jpeg',
          name: image.filename || `photo_${Date.now()}.jpg`,
        });
      }
      console.log('FormData ====>', formData);
      POST_FORM_DATA(
        SUPPORT,
        formData,
        success => {
          setLoading(false);
          console.log(success, 'dsdsdsdeeeeeeeeeeeeweewew-->>>');
          setModalVisible(false);
          getSupport();
        },
        error => {
          console.log(error, 'errorerrorerror>>');
          setLoading(false);
        },
        fail => {
          console.log(fail, 'errorerrorerror>>');
          setLoading(false);
        },
      );
    }
  };



  const renderTicket = ({item}) => (
    <View style={styles.ticketCard}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <Image
          source={{uri: item.image_url}}
          style={{height: 50, width: 50, borderRadius: 6}}
        />
        <View style={{marginLeft: 12}}>
          <Typography style={styles.ticketTitle}>{item.title}</Typography>
          <Typography style={styles.ticketDesc}>{item.description}</Typography>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <HomeHeader
        title={'Support'}
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.black}
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLOR.primary}
          style={{marginTop: 10}}
        />
      ) :<FlatList
        data={tickets}
        renderItem={renderTicket}
        keyExtractor={item => item.id}
        contentContainerStyle={{paddingVertical: 10, paddingHorizontal: 10}}
      />}

      <Button title="Raise Ticket" onPress={() => setModalVisible(true)} />

      {/* Raise Ticket Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Typography style={styles.modalTitle}>
                Raise a Support Ticket
              </Typography>

              <Input
                label="Title"
                placeholder=""
                value={newTitle}
                style={{borderColor: COLOR.primary}}
                onChangeText={setNewTitle}
                error={error.title}
              />

              <Input
                label="Description"
                placeholder=""
                value={newDesc}
                style={{borderColor: COLOR.primary}}
                onChangeText={setNewDesc}
                error={error.description}
                multiline={true}
              />
              <Typography
                size={14}
                font={Font.semibold}
                color="#333"
                style={[styles.label, {marginTop: 20, marginBottom: 5}]}>
                Image
              </Typography>
              {image ? (
                <View style={styles.imgWrapper}>
                  <Image
                    source={{uri: image?.path ? image?.path : image?.uri}}
                    style={styles.previewImg}
                  />
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => setImage(null)}>
                    <Image
                      // source={images.cross}
                      style={{height: 12, width: 12}}
                      tintColor={'white'}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <ImageUpload onPress={() => setShowModal(true)} />
              )}
              <Typography
                size={12}
                color="#777"
                font={Font.semibold}
                style={[styles.note, {marginBottom: 0, marginTop: 5}]}>
                Max file size: 2MB. JPG, PNG allowed.
              </Typography>
              {/* show error below image */}
              {error.image && <ErrorBox error={error.image} />}
              <Button
                loading={loading}
                title="Submit Ticket"
                onPress={handleUpdate}
                containerStyle={{marginTop: 10}}
              />
              <Button
                title="Cancel"
                onPress={() => setModalVisible(false)}
                titleColor={COLOR.primary}
                containerStyle={{
                  marginTop: 10,
                  backgroundColor: 'white',
                  borderWidth: 1,
                  borderColor: COLOR.primary,
                }}
              />
            </ScrollView>
            <ImageModal
              showModal={showModal}
              close={() => setShowModal(false)}
              selected={handleImageSelected}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Support;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  ticketCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLOR.black,
  },
  ticketDesc: {
    fontSize: 14,
    color: '#555',
    marginVertical: 4,
  },
  ticketDate: {
    fontSize: 12,
    color: '#888',
  },
  status: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    fontSize: 12,
    overflow: 'hidden',
  },
  statusOpen: {
    backgroundColor: '#ffebcc',
    color: '#b36b00',
  },
  statusResolved: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  raiseButton: {
    backgroundColor: COLOR.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  raiseButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  cancelBtn: {
    alignItems: 'center',
    marginTop: 10,
  },
  imgWrapper: {
    position: 'relative',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  previewImg: {
    width: windowWidth * 0.83,
    height: 180,
    borderRadius: 8,
  },
  deleteBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 6,
  },
});
