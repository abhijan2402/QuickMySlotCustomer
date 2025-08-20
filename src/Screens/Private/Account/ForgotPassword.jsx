import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {COLOR} from '../../../Constants/Colors';
import HomeHeader from '../../../Components/HomeHeader';
import Input from '../../../Components/Input';
import CustomButton from '../../../Components/CustomButton';

const ForgotPassword = () => {
  return (
    <View style={styles.container}>
      <HomeHeader
        title="Forgot Password"
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.black}
      />
      <ScrollView contentContainerStyle={{}}>
        <Input
          showLabel={true}
          label="Current Password"
          placeholder="Enter your old password"
        />
        <Input
          showLabel={true}
          label="New Password"
          placeholder="Enter your new password"
        />
        <Input
          showLabel={true}
          label="Confirm New Password"
          placeholder="Enter your confirm new password"
        />
        <View>
          <Text
            style={{
              textAlign: 'right',
              textDecorationLine: 'underline',
              paddingRight: 10, // small space from right edge
              color: COLOR.black, // ensures visibility
            }}>
            Forgot Password?
          </Text>
        </View>
        <CustomButton
          style={{marginTop: 20}}
          title="Change Password"
          onPress={() => {
            // Handle password change logic here
          }}
        />
      </ScrollView>
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
