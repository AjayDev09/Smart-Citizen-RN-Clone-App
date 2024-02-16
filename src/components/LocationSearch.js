import React, { Component, useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text, Image, Dimensions, Platform, SafeAreaView, FlatList, Keyboard } from 'react-native';
import { useEffect } from 'react';
import { close, search } from '../constants/images';
import { COLORS } from '../theme';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import TermsAndConditions from './TermsAndConditions';
import { useTranslation } from 'react-i18next';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomInput from './customInput';
import { getLabelField } from '../utils/common';

const SCREEN_WIDTH = Dimensions.get('screen').width
const widthP = (SCREEN_WIDTH * 15) / 100
const SCREEN_HEIGHT = Dimensions.get('screen').height
const LocationPopup = ({ name, modalVisible, setModalVisible, locationData, onCallBack, placeholder = "", }) => {
    const { t, i18n } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchData, setSearchData] = useState([]);
    useEffect(() => {
        setSearchData(locationData)
    }, [locationData])

    const searchFunction = (text) => {
        const array = [...locationData]
        const filteredData = array.filter((item) => item[getLabelField(i18n.language)] && item[getLabelField(i18n.language)].toLowerCase().includes(text.toLowerCase()))
        //   console.log('filteredData', filteredData)
        if (text && text !== "") {
            //this.setState({ data: filteredData, searchValue: text });
            setSearchData(filteredData)
        } else {
            setSearchData(locationData)
        }
        setSearchQuery(text);
    };
    const onChangeSearch = (name, value) => {
        searchFunction(value)
        //setSearchQuery(value);
    }

    const renderItem = ({ item }) => {
        return (
            <View style={[styles.dropdown]}>
                <TouchableOpacity onPress={() => {
                    Keyboard.dismiss()
                    console.log('selected item-------------->', item)
                    onCallBack(name, item.value);
                    setModalVisible(!modalVisible)
                }}>
                    <Text style={styles.labelStyle}>{item[getLabelField(i18n.language)]}</Text>
                </TouchableOpacity>
            </View>
        );
    };
    //  console.log('searchData', searchData)
    return (
        <Modal
            style={styles.container}
            //  transparent={true}
            // visible={true}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <SafeAreaView style={{
                width: '100%',
                backgroundColor: COLORS.secondary,
                alignItems: 'center',
                paddingTop: hp(2),
                alignSelf: 'center'
            }}>
                <TouchableOpacity
                    style={{ paddingTop: 10, alignSelf: 'flex-end', marginHorizontal: 10, marginBottom: 10 }}
                    onPress={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <Image
                        source={close}
                        style={[styles.image, {
                            width: 20,
                            height: 20,
                            marginRight: 20,
                            tintColor: COLORS.primary
                        }]}
                    />
                </TouchableOpacity>
                <View style={styles.searchWrapper}>
                    <Image
                        source={search}
                        style={styles.image_small}
                    />
                    <CustomInput
                        value={searchQuery}
                        setValue={onChangeSearch}
                        placeholder={placeholder}
                        keyboardType={'default'}
                        customStyle={{
                            borderBottomWidth: 0,
                            marginLeft: (wp(1)),
                            height: Platform.OS === 'ios' ? 30 : hp(6),
                            paddingVertical: Platform.OS === 'ios' ? 0 : 0,
                            textAlignVertical: 'center'
                        }}
                    />

                </View>

                <View style={{
                    alignItems: 'center',
                    alignSelf: 'center'
                }}>
                    <FlatList
                        data={searchData}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => item.value}
                    />
                </View>

            </SafeAreaView>
        </Modal>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: "center",
        flexDirection: 'column',
        backgroundColor: COLORS.secondary,
        paddingBottom: 30,
        paddingHorizontal: 10,
        overflow: 'hidden',
    },
    dropdown: {
        width: (SCREEN_WIDTH),
        borderColor: "#000",
        borderBottomColor: "#fff",
        borderBottomWidth: 1,
        paddingLeft: Platform.OS == "ios" ? 0 : 0,
        alignSelf: 'baseline',
        paddingBottom: 3,
        textAlign: 'left',

    },
    labelStyle: {
        fontSize: RFValue(18),
        marginTop: 10,
        color: COLORS.white,
        textAlign: 'center',
        marginHorizontal: wp(3),
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
    },
    itemText: {
        fontSize: 18,
        color: COLORS.text,
        textAlign: 'left',
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold"
    },
    item: {
        width: '100%',
        backgroundColor: "#f5f520",
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },

    image: {
        width: wp(12),
        height: wp(12),
        tintColor: COLORS.text,
        left: 0
    },
    image_small: {
        width: wp(5),
        height: wp(5),
        tintColor: COLORS.text,
        left: 0
    },
    searchWrapper: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        marginHorizontal: 15,
        alignItems: 'center',
        borderRadius: 35,
        borderWidth: 3,
        borderColor: COLORS.white
    },
    divider: {
        width: '100%',
        height: 2,
        backgroundColor: COLORS.white,
    },
});

export default LocationPopup;
