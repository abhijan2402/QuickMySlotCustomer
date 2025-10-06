import React, {useContext} from 'react';
import {
  View,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Platform,
  StyleSheet,
} from 'react-native';
import {AuthContext} from '../Backend/AuthContent';
import RootNavigation from './RootNavigation';
import AuthStack from './AuthNavigation';
import {ToastProvider} from '../Constants/ToastContext';
import {useSelector} from 'react-redux';

// Custom hook for status bar height
const useStatusBarHeight = () => {
  if (Platform.OS === 'ios') {
    return 0;
  }

  // For Android 15+ (API 34+)
  return StatusBar.currentHeight || 0;
};

const MainNavigation = () => {
  const auth = useContext(AuthContext);
  const isAuth = useSelector(store => store.isAuth);
  const statusBarHeight = useStatusBarHeight();

  return (
    <View style={[styles.container, {paddingTop: statusBarHeight}]}>
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="dark-content"
      />
      <SafeAreaView style={styles.safeArea}>
        <ToastProvider>
          {isAuth ? <RootNavigation /> : <AuthStack />}
        </ToastProvider>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});

export default MainNavigation;
