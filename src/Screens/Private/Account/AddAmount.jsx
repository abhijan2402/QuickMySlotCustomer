import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Input from '../../../Components/Input';
import {COLOR} from '../../../Constants/Colors';
import HomeHeader from '../../../Components/HomeHeader';
import {Dropdown} from 'react-native-element-dropdown';
import {validators} from '../../../Backend/Validator';
import {isValidForm, ToastMsg} from '../../../Backend/Utility';
import {ErrorBox} from '../../../Components/UI/ErrorBox';
import useKeyboard from '../../../Constants/Utility';
import Button from '../../../Components/UI/Button';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ADD_BANK, ADD_WALLET, UPDATE_BANK} from '../../../Constants/ApiRoute';
import {POST_FORM_DATA, POST_WITH_TOKEN} from '../../../Backend/Api';
import {useIsFocused} from '@react-navigation/native';

const AddAmount = ({navigation, route}) => {
  const [amount, setAmount] = useState('');
  const [AmountType, setAmountType] = useState(null);
  const {isKeyboardVisible} = useKeyboard();
  const [loading, setLoading] = useState(false);
  const data = route?.params?.data;
  console.log(data);
  const isEditing = route?.params?.isEditing;
  const [error, setError] = useState({});
  const AmountTypeOptions = [
    {label: 'Credit', value: 'credit'},
    {label: 'Debit', value: 'debit'},
  ];
  const isFocus = useIsFocused();

  const handleSubmit = () => {
    let validationErrors = {
      amount: validators.checkNumber('amount', amount),
      // AmountType: '',
    };

    setError(validationErrors);

    if (isValidForm(validationErrors)) {
      setLoading(true);
      const formData = new FormData();
      formData.append('amount', amount);
      // formData.append('type', AmountType);
      console.log('FormData ====>', formData);
      POST_FORM_DATA(
        ADD_WALLET,
        formData,
        success => {
          console.log(success, 'successsuccesssuccess-->>>');
          setLoading(false);
          navigation.goBack();
        },
        error => {
          console.log(error, 'errorerrorerror>>');
        //   ToastMsg(error?.data?.message);
          setError(prev => ({
            ...prev,
            AmountType: error?.data?.message,
          }));
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
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: 'white', paddingHorizontal: 15}}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : isKeyboardVisible
          ? 'height'
          : undefined
      }
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 40}>
      <HomeHeader
        title={'Add Amount'}
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.black}
      />

      <KeyboardAwareScrollView
        style={{paddingHorizontal: 5}}
        contentContainerStyle={styles.container}>
        <Input
          label="Amount"
          placeholder="Enter Amount"
          value={amount}
          onChangeText={setAmount}
          style={{borderColor: COLOR.primary}}
          error={error.amount}
        />

        {/* <Text style={[styles.label, {marginTop: 18}]}>Amount Type</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={AmountTypeOptions}
          maxHeight={150}
          labelField="label"
          valueField="value"
          placeholder="Select Amount Type"
          value={AmountType}
          onChange={item => setAmountType(item.value)}
        />
        {error.AmountType && <ErrorBox error={error.AmountType} />} */}
      </KeyboardAwareScrollView>

      <Button loading={loading} title={'Submit'} onPress={handleSubmit} />
    </KeyboardAvoidingView>
  );
};

export default AddAmount;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 10,
    backgroundColor: COLOR.bgColor,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
    color: COLOR.black,
  },
  dropdown: {
    height: 50,
    borderColor: COLOR.primary,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  placeholderStyle: {
    fontSize: 14,
    color: 'gray',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: COLOR.black,
  },
  button: {
    marginTop: 20,
    backgroundColor: COLOR.primary,
    paddingVertical: 14,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: COLOR.white,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});
