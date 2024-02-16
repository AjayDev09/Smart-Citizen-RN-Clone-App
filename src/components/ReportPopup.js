import React, { Component, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, Dimensions, Platform, SafeAreaView, Button } from 'react-native';
import { useEffect } from 'react';
import { close } from '../constants/images';
import { COLORS } from '../theme';
import CheckBox from '@react-native-community/checkbox';
import CustomButton from './customButton';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import Modal from "react-native-modal";


const ReportPopup = ({ modalVisible, setModalVisible, params, onCallBack, onCallBackComment, }) => {
    const { t, i18n } = useTranslation();
    const [isBlockUser, setBlockUser] = useState(false);
    const containerStyles = { backgroundColor: COLORS.secondary, height: 250, justifyContent: 'flex-start', alignItems: 'center' };

    return (
        <Modal
            isVisible={modalVisible}
            //style={styles.container}
            //  transparent={true}
            // visible={true}
            contentContainerStyle={containerStyles}
            //  transparent={true}
            onDismiss={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <View style={{
                display: 'flex',
                // width: '95%',
                // height: '100%',
                flexDirection: 'column',
                backgroundColor: COLORS.secondary,
                alignItems: 'center',
            }}>
                <View style={{
                    width: 300,
                    height: 300
                }}>

                    {/* <TouchableOpacity
                    style={{ paddingTop: 10 }}
                    onPress={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <Image
                        source={close}
                        style={[styles.image, {
                            width: 20,
                            height: 20,
                            marginLeft: 10,
                            tintColor: COLORS.primary
                        }]}
                    />
                </TouchableOpacity> */}
                    <View style={{
                        marginTop: 20,
                    }}>
                        <Text style={styles.itemText}>Block</Text>
                        <TouchableOpacity onPress={() => setBlockUser(!isBlockUser)} style={styles.checkboxContainer}>
                            <CheckBox
                                disabled={false}
                                value={isBlockUser}
                                tintColors={COLORS.primary}
                                onCheckColor={COLORS.primary}
                                onFillColor={COLORS.primary}
                                onTintColor={COLORS.primary}
                                style={styles.checkbox}
                            />

                            <Text style={styles.itemText}>Block a User</Text>
                        </TouchableOpacity>
                        {/* <CustomButton onCallback={{}} title={'test'}
                            customButtonStyle={{}} textStyle={{ fontSize: RFValue(18) }} /> */}
                        <View style={{ marginTop: 20,  flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end' }}>

                            <TouchableOpacity style={[styles.ButtonStyle,
                            { backgroundColor: COLORS.primary }]}
                                //activeOpacity = { .5 } 
                                onPress={{}} >
                                <Text style={styles.itemText}> {t("common:cancel")} </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.ButtonStyle,
                            { backgroundColor: COLORS.primary }]}
                                //activeOpacity = { .5 } 
                                onPress={{}} >
                                <Text style={styles.itemText}> {t("common:report")} </Text>
                            </TouchableOpacity>
                            {/* <Button title={t("common:cancel")} onPress={{}} />
                        <Button title={t("common:report")} onPress={{}} /> */}
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
export default ReportPopup;

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


