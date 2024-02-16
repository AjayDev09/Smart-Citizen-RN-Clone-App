

import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { MultiSelect } from 'react-native-element-dropdown'
import { COLORS } from '../theme'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { arrowDown } from '../constants/images';
import { useTranslation } from 'react-i18next';
import { getLabelField } from '../utils/common';

const MultiSelectComponent = ({onChangeValue, data, labelField, selectedValue, isSearch = false }) => {
    const { t, i18n } = useTranslation();
    return (
        <View style={{ flex: 1 }}>
            <MultiSelect
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                itemTextStyle={{  textAlign:'left' }}
                activeColor={COLORS.primary}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                // search
                search={isSearch}
                maxHeight={300}
                data={data}
                labelField={labelField}
                valueField="value"
                placeholder={t("common:selectItem")}
                searchPlaceholder="Search..."
                value={selectedValue}
                onChange={item => {
                    console.log('item', item)
                    onChangeValue(item);
                }}
                renderRightIcon={() => (<>
                    <Image
                        source={arrowDown}
                        style={{ width: 12, height: 12, tintColor: COLORS.primary, left: 0, marginRight: 5 }}
                    />
                    {/* <TouchableOpacity onPress={() => {}}>
                    <View style={ {marginRight: 10}}>
                        <Text style={[styles.txtClearAll, { marginLeft: 5, textAlign: 'left', }]}>{"X"}</Text>
                    </View>
                </TouchableOpacity> */}
                </>
                )}
                selectedStyle={styles.selectedStyle}
                renderSelectedItem={(item, unSelect) => {
                    return (
                        <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                            <View style={styles.selectedStyle}>
                                <Text style={[styles.txtClearAll, { marginLeft: 5, textAlign: 'left', }]}>{item[getLabelField(i18n.language)]}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }}
            />
        </View>
    )
}

export default MultiSelectComponent

const styles = StyleSheet.create({
    dropdown: {
        // height: Platform.OS == "ios" ? 35 : hp(6),
        paddingLeft: wp(2),
        backgroundColor: 'transparent',
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
        textAlign:'left'
      //  color:'#000'
    },
    placeholderStyle: {
        fontSize: 16,
        textAlign:'left'
       // color: "#000"
    },
    selectedTextStyle: {
        fontSize: 14,
      //  color: "#000"
      textAlign:'left'
    },
    selectedStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: 'white',
        shadowColor: '#000',
        marginTop: 8,
        marginRight: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        color: COLORS.black,
        elevation: 2,
        textAlign:'left'
    },
    iconStyle: {
        width: 20,
        height: 20,
        
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        color: COLORS.black,
        textAlign:'left'
    },
    icon: {
        marginRight: 5,
    },
    selectedStyle: {
        borderRadius: 12,
        color: COLORS.white,
        textAlign:'left'
    },
})