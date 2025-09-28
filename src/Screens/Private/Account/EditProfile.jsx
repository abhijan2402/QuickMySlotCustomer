import React, {useContext, useEffect, useState} from 'react';
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
import {cleanImageUrl, isValidForm, ToastMsg} from '../../../Backend/Utility';
import {validators} from '../../../Backend/Validator';
import Button from '../../../Components/UI/Button';
import {AuthContext} from '../../../Backend/AuthContent';
import {useDispatch, useSelector} from 'react-redux';
import {UPDATE_PROFILE} from '../../../Constants/ApiRoute';
import {POST_FORM_DATA} from '../../../Backend/Api';
import {userDetails} from '../../../Redux/action';
import {useIsFocused} from '@react-navigation/native';

const EditProfile = ({navigation}) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState({});
  const [isEditing, setIsEditing] = useState(true);
  const {isKeyboardVisible} = useKeyboard();
  const isFocus = useIsFocused();
  const {user} = useContext(AuthContext);
  console.log(user, 'user--->>');
  const userdata = useSelector(store => store.userDetails);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (isFocus) {
      setFirstName(userdata?.name || '');
      setEmail(userdata?.email || '');
      setPhone(userdata?.phone_number);
      setProfileImage({path: cleanImageUrl(userdata?.image)});
      // setCity(userdata?.city || '');
      // setAddress(userdata?.exact_location || '');
      // setPinCode(userdata?.zip_code);
    }
  }, [isFocus]);

  // Modal state
  const [showModal, setShowModal] = useState(false);

  // Validation errors
  const [error, setError] = useState({});

  // const handleUpdate = () => {
  //   let validationErrors = {
  //     name: validators.checkRequire('Name', firstName),
  //     email: validators.checkEmail('Email', email),
  //     phone: validators.checkNumber('Phone Number', phone),
  //   };

  //   setError(validationErrors);

  //   if (isValidForm(validationErrors)) {
  //     console.log('✅ Updated Profile:', {
  //       firstName,
  //       email,
  //       phone,
  //       profileImage,
  //     });
  //     setIsEditing(false);
  //   }
  // };

  const handleImageSelected = response => {
    console.log(response, 'das59eqw8669ed74wqa648de97w');
    if (response) {
      setProfileImage(response);
    }
  };

  const handleUpdate = () => {
    let validationErrors = {
      name: validators.checkRequire('Name', firstName),
      email: validators.checkEmail('Email', email),
      phone: validators.checkNumber('Phone Number', phone),
    };
    setError(validationErrors);
    if (isValidForm(validationErrors)) {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', firstName);
      formData.append('email', email);
      formData.append('phone', phone);
      if (profileImage && profileImage?.mime) {
        formData.append('profile_picture', {
          uri: profileImage?.path,
          type: profileImage?.mime || 'image/jpeg',
          name: profileImage?.filename || 'profileImage?.path',
        });
      }
      // formData.append('address', address);
      // formData.append('city', city);
      // formData.append('state', state);
      // formData.append('country', country);
      // formData.append('zip_code', pinCode);
      console.log('FormData ====>', formData);
      POST_FORM_DATA(
        UPDATE_PROFILE,
        formData,
        success => {
          setLoading(false);
          ToastMsg(success?.message);
          console.log(success, 'dsdsdsdeeeeeeeeeeeeweewew-->>>');
          dispatch(userDetails(success?.data));
          navigation.pop();
          setIsEditing(false);
          fetchUserProfile();
        },
        error => {
          console.log(error, 'errorerrorerror>>');
          setError(error?.data?.errors);
          setLoading(false);
        },
        fail => {
          console.log(fail, 'errorerrorerror>>');
          setLoading(false);
        },
      );
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
            <Image
              source={{
                uri: profileImage?.path
                  ? profileImage?.path
                  : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
              }}
              style={styles.profileImage}
            />

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
            error={error?.name}
          />

          <Input
            label="Email"
            placeholder="Enter email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={isEditing}
            error={error?.email}
          />

          <Input
            label="Phone Number"
            placeholder="Enter phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            editable={isEditing}
            error={error?.phone}
            inputContainer={{marginBottom: 20}}
          />
        </ScrollView>
        {/* Edit / Update Button */}
        <Button
          title={isEditing ? 'Update' : 'Edit'}
          loading={loading}
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
