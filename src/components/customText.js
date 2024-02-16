import React from 'react';
import { Platform, StyleSheet, Text  } from 'react-native';

export const CustomText = ({ text, style, children}) => <Text style={[styles.text, style]}>{children}</Text>

const styles = StyleSheet.create({
  text: {
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
  }
});