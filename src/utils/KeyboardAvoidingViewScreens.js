import React from 'react';
import { useHeaderHeight } from "@react-navigation/elements";
import {
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  KeyboardAvoidingViewProps as RNKeyboardAvoidingViewProps,
  Platform,
  StyleSheet,
} from 'react-native';

const BEHAVIOR = Platform.OS === 'ios' ? 'padding' : undefined;

//const KeyboardAvoidingView = ({ style, ...props }: RNKeyboardAvoidingViewProps) => {
const KeyboardAvoidingView = ({ style, ...props }) => {
  const headerHeight = useHeaderHeight();

  return (
    <RNKeyboardAvoidingView
      style={[styles.container, style]}
      behavior={BEHAVIOR}
      keyboardVerticalOffset={headerHeight}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default KeyboardAvoidingView;