import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const NoInternetAlert = () => {
  const [isConnected, setIsConnected] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  if (isConnected) return null;

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <Text style={styles.text}>⚠️ No Internet Connection</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default NoInternetAlert;
