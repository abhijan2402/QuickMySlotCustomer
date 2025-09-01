import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Input from '../../../Components/Input';
import {COLOR} from '../../../Constants/Colors';
import HomeHeader from '../../../Components/HomeHeader';
import ImageModal from '../../../Components/UI/ImageModal';
import useKeyboard from '../../../Constants/Utility';
import {isValidForm} from '../../../Backend/Utility';
import {validators} from '../../../Backend/Validator';
import Button from '../../../Components/UI/Button';
import {Typography} from '../../../Components/UI/Typography';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const EditProfile = ({navigation}) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const {isKeyboardVisible} = useKeyboard();

  const [profileImage, setProfileImage] = useState(
    'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  );

  // Modal state
  const [showModal, setShowModal] = useState(false);

  // Validation errors
  const [error, setError] = useState({});

  const handleUpdate = () => {
    let validationErrors = {
      name: validators.checkRequire('Name', firstName),
      email: validators.checkEmail('Email', email),
      phone: validators.checkNumber('Phone Number', phone),
    };

    setError(validationErrors);

    if (isValidForm(validationErrors)) {
      console.log('✅ Updated Profile:', {
        firstName,
        email,
        phone,
        profileImage,
      });
      setIsEditing(false);
    }
  };

  const handleImageSelected = response => {
    if (response?.path) {
      setProfileImage(response.path);
    }
  };

  return (
    <View
      style={{flex: 1, backgroundColor: COLOR.white, paddingHorizontal: 15}}>
      <HomeHeader
        title="Edit Profile"
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.black}
      />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : isKeyboardVisible
            ? 'height'
            : undefined
        }
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 30}>
        <ScrollView
          style={{flex: 1, paddingHorizontal: 5}}
          contentContainerStyle={styles.container}>
          {/* Profile Image */}
          <View style={styles.profileSection}>
            <Image source={{uri: profileImage}} style={styles.profileImage} />

            {isEditing && (
              <TouchableOpacity
                style={styles.editIconWrapper}
                onPress={() => setShowModal(true)}>
                <Image
                  source={require('../../../assets/Images/edit.png')}
                  style={styles.editIcon}
                />
              </TouchableOpacity>
            )}
          </View>
          {/* Inputs with Error */}
          <Input
            label="Name"
            placeholder="Enter Your name"
            value={firstName}
            onChangeText={setFirstName}
            editable={isEditing}
            error={error.name}
          />

          <Input
            label="Email"
            placeholder="Enter email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={isEditing}
            error={error.email}
          />

          <Input
            label="Phone Number"
            placeholder="Enter phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            editable={isEditing}
            error={error.phone}
            inputContainer={{marginBottom: 20}}
          />
        </ScrollView>
        {/* Edit / Update Button */}
        <Button
          title={isEditing ? 'Update' : 'Edit'}
          onPress={() => {
            if (isEditing) {
              handleUpdate();
            } else {
              setIsEditing(true);
            }
          }}
        />
      </KeyboardAvoidingView>

      {/* Image Modal */}
      <ImageModal
        showModal={showModal}
        close={() => setShowModal(false)}
        selected={handleImageSelected}
        mediaType="photo"
      />
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  profileSection: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 10,
    alignSelf: 'center',
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  editIconWrapper: {
    position: 'absolute',
    bottom: 15,
    right: 0,
    backgroundColor: COLOR.white,
    borderRadius: 20,
    padding: 6,
    elevation: 3,
  },
  editIcon: {
    width: 20,
    height: 20,
    tintColor: COLOR.primary,
  },
  container: {
    paddingVertical: 10,
    backgroundColor: COLOR.bgColor,
  },
  card: {
    padding: 15,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 6,
    elevation: 4,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  promoBox: {
    backgroundColor: '#F2F7FF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  promoTitle: {
    marginBottom: 6,
  },
  promoText: {
    marginBottom: 14,
  },
  boostBtn: {
    backgroundColor: '#2E86DE',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
