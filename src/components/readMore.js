import { Platform, StyleSheet, } from 'react-native';
import React from 'react';
import { COLORS, } from '../theme';
import ReadMore from '@fawazahmed/react-native-read-more';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';

const ReadMoreComponent = ({ children, customStyle={}, numberOfLines=0}) => {
  const { t, i18n } = useTranslation();

  return (
    <ReadMore numberOfLines={numberOfLines > 0 ? numberOfLines :Platform.OS === 'ios' ? 1 : 2}
      seeMoreText={t("common:readMore")}
      seeLessText={t("common:readLess")}
      seeLessStyle={[styles.itemText, {
        color: COLORS.primary,
        fontSize: RFValue(12),
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
        marginLeft: 2, alignSelf: 'flex-end',
        textAlign: 'left'
      }]}
      seeMoreStyle={[styles.itemText, {
        color: COLORS.primary,
        fontSize: RFValue(12),
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
        marginLeft: 2, alignSelf: 'flex-end',
        textAlign: 'left'
      }]}
      style={[styles.itemText, customStyle, { fontSize: RFValue(14), flexWrap: 'wrap', marginTop: 5, textAlign: 'left' }]}>
      {children}
    </ReadMore>
  );
};

export default ReadMoreComponent;

const styles = StyleSheet.create({
  itemText: {
    fontSize: RFValue(14),
    color: COLORS.text,
    textAlign: 'left',
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
  },
});
