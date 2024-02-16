import React, { useState } from 'react';
import { Dimensions, Image, Platform, StyleSheet, Text, View } from 'react-native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { images } from '../constants';
import { arrowDown } from '../constants/images';
import { COLORS } from '../theme';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useTranslation } from 'react-i18next';
import { getLabelField } from '../utils/common';

const SCREEN_WIDTH = Dimensions.get('screen').width
const widthP = (SCREEN_WIDTH * 15) / 100
const DropdownComponent = ({ name, value, setValue, placeholder, data, hasError = false, 
  errorMessage = "", style = {}, selectedstyle = {}, placeholderStyle = {},
  disable= false, isSearch = false }) => {
  const { t, i18n } = useTranslation();
  const isRTL=i18n.language == 'he' || i18n.language == 'ar'
  const renderItem = (item) => {
    return (
      <View style={[styles.dropdown ]}>
        <Text style={styles.labelStyle}>{item[getLabelField(i18n.language)]}</Text>
      </View>
    );
  };

  const Arrow = () =>{
    return (
      <Image
        source={arrowDown}
        style={{ width: 12, height: 12, tintColor: COLORS.primary, left: 0, marginRight: 10 }}
      />
    )
  }
  const EmptyArrow = () =>{
    return (
        <View style={{
          width: !isRTL?0:12
        }}></View>
    )
  }
 

  return (
    <View style={[styles.container, { width: (SCREEN_WIDTH - widthP), }]}>
      <Dropdown
        style={[styles.dropdown, style ]}
        placeholderStyle={[styles.placeholderStyle, placeholderStyle]}
        selectedTextStyle={[styles.selectedTextStyle, selectedstyle,{textAlign:'left'}]}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search={isSearch}
        maxHeight={300}
        labelField={getLabelField(i18n.language)}
        valueField="value"
        placeholder={placeholder}
        searchPlaceholder="Search..."
        value={value}
        disable={disable}
        renderItem={renderItem}
        onChange={item => {
          //console.log("item 123", item)
          setValue(name, item.value);
        }}
        renderRightIcon={!isRTL ? Arrow:EmptyArrow}
        renderLeftIcon={isRTL ? Arrow:EmptyArrow}
      />

      {hasError != "" ? (
        <Text style={styles.errorText}>
          {errorMessage}
        </Text>
      ) : (
        false
      )}
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    // flex:1,
    //  width: 350,
    height: Platform.OS == "ios" ? 35 : hp(6),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    marginVertical: Platform.OS === 'ios' ? 0 : 0,
  },
  dropdown: {
    // width: 350,
   // flexDirection:  'row',
    width: (SCREEN_WIDTH - widthP),
    borderColor: "#000",
    borderBottomColor: "#fff",
    borderBottomWidth: 1,
    color: "white",
    paddingLeft: Platform.OS == "ios" ? 0 : 0,
    alignSelf: 'baseline',
    paddingBottom: 3,
    textAlign: 'left',
    
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: RFValue(18),
    marginTop: 10,
    height: Platform.OS === 'ios' ? 24 : hp(4),
    color: COLORS.textPlaceHolder,
    textAlign: 'left',
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
  },
  labelStyle: {
    fontSize: RFValue(18),
    marginTop: 10,
    color: COLORS.textDark,
    textAlign: 'left',
    marginHorizontal: wp(3),
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
  },
  selectedTextStyle: {
    fontSize: RFValue(18),
    height: Platform.OS === 'ios' ? 24 : hp(4),
    marginTop: 20,
    bottom: 0,
    color: COLORS.text,
    textAlign: 'left',
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"

  },
  inputSearchStyle: {
    height: 40,
    fontSize: RFValue(18),
    textAlign: 'left',
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  errorText: {
    fontSize: RFValue(13),
    color: COLORS.error,
    textAlign: 'left',
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular",
  },
});