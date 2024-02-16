import React, { Component, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, Dimensions, Platform, SafeAreaView, Button, TouchableWithoutFeedback } from 'react-native';
import { useEffect } from 'react';
import { close, iconDefaultUser } from '../constants/images';
import { COLORS } from '../theme';
import CheckBox from '@react-native-community/checkbox';
import CustomButton from './customButton';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import Modal from "react-native-modal";
import ImageZoom from 'react-native-image-pan-zoom';
import FastImage from 'react-native-fast-image';

const SCREEN_WIDTH = Dimensions.get('screen').width - 20
const SCREEN_HEIGHT = Dimensions.get('screen').height
const ImageViewerPopup = ({ modalVisible, setModalVisible, item, }) => {
    const { t, i18n } = useTranslation();
    const containerStyles = { backgroundColor: COLORS.black, justifyContent: 'flex-start', alignItems: 'center' };

    return (
        <TouchableWithoutFeedback style={{
            backgroundColor: COLORS.black,
        }} onPress={() => setModalVisible(!modalVisible)}>

            <Modal
                isVisible={modalVisible}
                //style={styles.container}
                //  transparent={true}
                // visible={true}
                contentContainerStyle={containerStyles}
                //  transparent={true}
                onBackdropPress={() => {
                    setModalVisible(!modalVisible);
                }}
                onDismiss={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View
                    onPress={() => {
                        setModalVisible(!modalVisible);
                    }} style={{
                        //   backgroundColor: COLORS.secondary,
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>

                    <FastImage style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH, borderRadius: SCREEN_WIDTH/2, overflow: 'hidden'  }}
                        source={item && item.image ? {
                            uri: item.image ? item.image : "",
                            priority: FastImage.priority.normal,
                        } : iconDefaultUser}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                    {/* <Image
                        style={{ width: 250, height: 250, borderRadius: 250 / 2, overflow: 'hidden' }}
                        source={item && item.image ? {
                            uri: item.image ? item.image : "",
                            priority: FastImage.priority.normal,
                        } : iconDefaultUser}
                    /> */}

                    <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end' }}>

                        {/* <TouchableOpacity style={[styles.ButtonStyle,
                            { backgroundColor: COLORS.primary }]}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                }} >
                                <Text style={styles.itemText}> {t("common:cancel")} </Text>
                            </TouchableOpacity> */}

                    </View>
                </View>
            </Modal>
        </TouchableWithoutFeedback>
    );
};
export default ImageViewerPopup;

const styles = StyleSheet.create({
    container: {
        height: '50%',
        // width: 250, 
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: COLORS.secondary,
        //justifyContent: 'flex-end', margin: 0
    },
    title: {
        fontSize: 18,
        color: COLORS.text,
        textAlign: 'left',
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold"
    },
    itemText: {
        fontSize: 18,
        color: COLORS.text,
        textAlign: 'left',
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
    },
    ButtonStyle: {
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 20,
        //    width: '70%'
        marginLeft: 20
    },
    checkboxContainer: {
        flexDirection: 'row',
        marginTop: '10%',
        alignItems: 'center'
    },
    checkbox: {
        alignSelf: 'center',
        tintColors: 'green'
    },
});


