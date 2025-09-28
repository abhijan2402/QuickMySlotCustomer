import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import HomeHeader from '../../../Components/HomeHeader';
import {COLOR} from '../../../Constants/Colors';
import {Typography} from '../../../Components/UI/Typography';
import Button from '../../../Components/UI/Button';
import {useIsFocused} from '@react-navigation/native';
import {GET_WITH_TOKEN, POST_FORM_DATA} from '../../../Backend/Api';
import {SUPPORT} from '../../../Constants/ApiRoute';
import {validators} from '../../../Backend/Validator';
import ImageModal from '../../../Components/UI/ImageModal';
import {images} from '../../../Components/UI/images';
import {ErrorBox} from '../../../Components/UI/ErrorBox';
import Input from '../../../Components/Input';
import {Font} from '../../../Constants/Font';
import ImageUpload from '../../../Components/UI/ImageUpload';
import {isValidForm} from '../../../Backend/Utility';

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [error, setError] = useState('');
  const [image, setImage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const isFocus = useIsFocused();
  console.log(image, 'image-->>>');

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
        setRefreshing(false);
        console.log(success, 'Support data-->>>');
        setTickets(success?.data || []);
      },
      error => {
        console.log(error, 'errorerrorerror>>');
        setLoading(false);
        setRefreshing(false);
      },
      fail => {
        console.log(fail, 'errorerrorerror>>');
        setLoading(false);
        setRefreshing(false);
      },
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    getSupport();
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
          console.log(success, 'Ticket created-->>>');
          setModalVisible(false);
          setNewTitle('');
          setNewDesc('');
          setImage('');
          setError('');
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

  const renderTicket = ({item, index}) => (
    <View
      style={[
        styles.ticketCard,
        index === 0 && styles.firstTicketCard,
        index === tickets?.length - 1 && styles.lastTicketCard,
      ]}>
      <View style={styles.ticketHeader}>
        <Image
          source={{uri: item.image_url}}
          style={styles.ticketImage}
          defaultSource={images.placeholder} // Add a placeholder image
        />
        <View style={styles.ticketContent}>
          <Typography style={styles.ticketTitle} numberOfLines={1}>
            {item.title}
          </Typography>
          <Typography style={styles.ticketDesc} numberOfLines={2}>
            {item.description}
          </Typography>
          {item.created_at && (
            <Typography style={styles.ticketDate}>
              {new Date(item.created_at).toLocaleDateString()}
            </Typography>
          )}
        </View>
      </View>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Typography style={styles.emptyText}>No support tickets found</Typography>
      <Typography style={styles.emptySubText}>
        Raise a ticket to get started
      </Typography>
    </View>
  );

  return (
    <View style={styles.container}>
      <HomeHeader
        title={'Support'}
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.black}
      />

      <View style={styles.content}>
        {loading && !refreshing ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator
              size="large"
              color={COLOR.primary}
              style={styles.loader}
            />
            <Typography style={styles.loadingText}>
              Loading tickets...
            </Typography>
          </View>
        ) : (
          <FlatList
            data={tickets}
            renderItem={renderTicket}
            keyExtractor={item => item.id?.toString()}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={renderEmptyList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLOR.primary]}
                tintColor={COLOR.primary}
              />
            }
          />
        )}

        <Button
          title="Raise Ticket"
          onPress={() => setModalVisible(true)}
          style={styles.raiseButton}
        />
      </View>

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
              documents={true}
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    marginBottom: 10,
  },
  loadingText: {
    color: COLOR.primary,
    fontSize: 16,
  },
  listContainer: {
    flexGrow: 1,
    paddingVertical: 10,
  },
  ticketCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 2,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: COLOR.primary,
  },
  firstTicketCard: {
    marginTop: 8,
  },
  lastTicketCard: {
    marginBottom: 8,
  },
  ticketHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  ticketImage: {
    height: 60,
    width: 60,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  ticketContent: {
    flex: 1,
    marginLeft: 12,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLOR.black,
    marginBottom: 4,
  },
  ticketDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 6,
  },
  ticketDate: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  raiseButton: {
    marginVertical: 16,
    marginHorizontal: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: COLOR.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  label: {
    marginTop: 8,
    marginBottom: 8,
  },
  note: {
    marginBottom: 0,
    marginTop: 4,
  },
  imgWrapper: {
    position: 'relative',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  previewImg: {
    width: '100%',
    height: 180,
    borderRadius: 8,
  },
  deleteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    padding: 6,
  },
  deleteIcon: {
    height: 12,
    width: 12,
  },
  submitButton: {
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLOR.primary,
  },
});
