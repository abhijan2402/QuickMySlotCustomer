import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaView, StatusBar, StyleSheet, Text} from 'react-native';
import MainNavigation from './src/navigators/MainNavigation';
import {AuthProvider} from './src/Backend/AuthContent';
import NoInternetAlert from './src/Components/UI/NoInternetAlert';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import {LanguageProvider} from './src/localization/LanguageContext';

const App = () => {
  return (
    <SafeAreaProvider>
    <AuthProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <NavigationContainer>
          <MainNavigation />
          <NoInternetAlert/>
        </NavigationContainer>
      </SafeAreaView>
    </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
