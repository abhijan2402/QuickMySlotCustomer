import React, {useContext} from 'react';
import {View, ActivityIndicator, SafeAreaView} from 'react-native';
import {AuthContext} from '../Backend/AuthContent'; // 👈 confirm this path!
import RootNavigation from './RootNavigation';
import AuthStack from './AuthNavigation';
import {ToastProvider} from '../Constants/ToastContext';
import {useSelector} from 'react-redux';

const MainNavigation = () => {
  const isAuth = useSelector(state => state.isAuth);
  console.log(isAuth, 'isAuthisAuth');

  return (
    <SafeAreaView style={{flex: 1}}>
      <ToastProvider>
        {isAuth ? <RootNavigation /> : <AuthStack />}
      </ToastProvider>
    </SafeAreaView>
  );
};

export default MainNavigation;
