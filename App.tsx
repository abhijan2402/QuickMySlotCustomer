import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import MainNavigation from './src/navigators/MainNavigation';
import {AuthProvider} from './src/Backend/AuthContent';
import NoInternetAlert from './src/Components/UI/NoInternetAlert';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {store} from './src/Redux/store';

const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <View style={styles.safeArea}>
          <AuthProvider>
            <StatusBar barStyle="dark-content" backgroundColor={'#fff'} />
            <NavigationContainer>
              <MainNavigation />
              <NoInternetAlert />
            </NavigationContainer>
          </AuthProvider>
        </View>
      </Provider>
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
