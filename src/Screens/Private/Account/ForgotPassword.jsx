import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {COLOR} from '../../../Constants/Colors';
import HomeHeader from '../../../Components/HomeHeader';
import Input from '../../../Components/Input';
import Button from '../../../Components/UI/Button';
import { validators } from '../../../Backend/Validator';

const ForgotPassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let validationErrors = {
      currentPassword: validators.checkRequire('Current Password', currentPassword),
      newPassword: validators.checkPassword('New Password', newPassword),
      confirmPassword: validators.checkMatch(
        'Confirm Password',
        newPassword,
        confirmPassword,
      ),
    };

    setErrors(validationErrors);
    return Object.values(validationErrors).every(error => error === '');
  };

  const handleChangePassword = () => {
    if (validateForm()) {
      console.log('✅ Password changed successfully!');
      // API call here
    }
  };

  return (
    <View style={styles.container}>
      <HomeHeader
        title="Forgot Password"
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.black}
      />

      <ScrollView contentContainerStyle={{paddingHorizontal: 10}}>
        <Input
          showLabel
          label="Current Password"
          placeholder="Enter your old password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          error={errors.currentPassword}
        />

        <Input
          showLabel
          label="New Password"
          placeholder="Enter your new password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          error={errors.newPassword}
        />

        <Input
          showLabel
          label="Confirm New Password"
          placeholder="Enter your confirm new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          error={errors.confirmPassword}
        />

        <View>
          <Text
            style={{
              textAlign: 'right',
              textDecorationLine: 'underline',
              paddingRight: 10,
              color: COLOR.black,
            }}>
            Forgot Password?
          </Text>
        </View>
      </ScrollView>

      <Button title="Change Password" onPress={handleChangePassword} />
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
    paddingHorizontal: 15,
  },
});
