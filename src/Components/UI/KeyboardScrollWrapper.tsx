import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  ViewStyle,
} from 'react-native';

interface Props {
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  statusBarColor?: string;
  barStyle?: 'light-content' | 'dark-content';
  screensEnabled?: boolean;
}

const KeyboardScrollWrapper: React.FC<Props> = ({
  children,
  containerStyle,
  contentContainerStyle,
  statusBarColor = 'transparent',
  barStyle = 'dark-content',
  screensEnabled = true,
}) => {
  return (
    <KeyboardAvoidingView
      style={[styles.container, containerStyle]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        scrollEnabled={screensEnabled}>
        <StatusBar
          translucent={true}
          backgroundColor={statusBarColor}
          barStyle={barStyle}
          animated={true}
        />
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default KeyboardScrollWrapper;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
