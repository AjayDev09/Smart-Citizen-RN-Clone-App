import { Button, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { COLORS, SPACING } from '../theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { eyeIcon, eyeoffIcon } from '../constants/images';

const CustomButton = ({ onCallback, title, customButtonStyle = { paddingVertical: hp(2), },
 textStyle = {}, isDisabled = false, isSignWith = false,
 isSmall= false,
 rightIcon }) => {
  return (
    <TouchableOpacity
      activeOpacity={.5}
      onPress={() => onCallback()}
      disabled={isDisabled}
      style={[styles.buttonContainer, customButtonStyle, {
         opacity: isDisabled ? .4 : 1, display:'flex',
         minWidth: isSmall ? 110 : 120,
        // paddingVertical: hp(2),
          }]}>
      <Text
        style={[styles.buttonText, textStyle,{ fontSize: RFValue(isSmall ? 14 : 16), }]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  buttonContainer: {
    //flex:1,
   
    backgroundColor: COLORS.primary,
    //opacity: isDisabled ? .5: 1 ,
    borderRadius: 45,
    paddingVertical: hp(2),
  },
  buttonText: {
 //   fontSize: RFValue(isSmall ? 15 : 16),
    color: COLORS.text,
    // paddingVertical: hp(1),
    textAlign: 'center',
    backgroundColor: "transparent",
    // fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold"
  },
});
