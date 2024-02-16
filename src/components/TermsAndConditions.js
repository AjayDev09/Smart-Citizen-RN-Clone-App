import React, { Component, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Platform } from 'react-native';
import HTMLView from 'react-native-htmlview';
import { ActivityIndicator } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useDispatch, useSelector } from 'react-redux';
import { htmlStylesheet } from '../constants/constant';
import { cmsPagesListApi } from '../redux/actions/settingsActions';
import { COLORS } from '../theme';
import { ShowErrorToast } from '../utils/common';

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
};

const TermsAndConditions = ({ agree, setModalVisible, setAgree }) => {
    const authuser = useSelector(({ auth }) => auth.data);
    const { t, i18n } = useTranslation();

    const dispatch = useDispatch()

    const [termsDetails, setTermsDetails] = useState({})


    useEffect(() => {
        dispatch(cmsPagesListApi(authuser.token))
            .then((res) => {
                if (res.status === 200) {
                    // console.log('content', res.data.term)
                    setTermsDetails(res.data.term)
                }
                // else
                //     Toast.show(response.message, Toast.SHORT);
            }).catch((error) => {
                ShowErrorToast(error)
            })

    }, [])
    // i18n.language 
    const content = i18n.language === 'he' ? termsDetails.content_he : 
    i18n.language === 'ar' ? 
    termsDetails.content_ab :
    termsDetails.content_fr === 'fr' ? 'label_fr' :  termsDetails.content_ru === 'ru' ? 'label_ru' : termsDetails.content


    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('navigate:termsncondition')}</Text>
            <ScrollView
                style={styles.tcContainer}
                onScroll={({ nativeEvent }) => {
                    if (isCloseToBottom(nativeEvent)) {
                        // setModalVisible(false)
                        setAgree(true)
                    }
                }}
            >
                {
                    content ? <HTMLView
                        value={content}
                        stylesheet={htmlStylesheet}
                    /> : <ActivityIndicator size="large" color={COLORS.primary} />
                }
            </ScrollView>

            <TouchableOpacity disabled={!agree} onPress={() => {
                setModalVisible(false)
                setAgree(true)
            }} style={agree ? styles.button : styles.buttonDisabled}><Text style={styles.buttonLabel}>{t("common:accept")}</Text></TouchableOpacity>
        </View>
    );

}

//export default TermsAndConditions

const { width, height } = Dimensions.get('window');

const styles = {
    container: {
        flex: 1,
        margin: 10
    },
    title: {
        fontSize: RFValue(18),
        color: COLORS.text,
        alignSelf: 'center',
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold"
    },
    label: {
        fontSize: RFValue(16),
        color: COLORS.text,
        textAlign: 'left',
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
    },
    tcP: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 12
    },
    tcP: {
        marginTop: 10,
        fontSize: 12
    },
    tcL: {
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 10,
        fontSize: 12
    },
    tcContainer: {
        marginTop: 15,
        marginBottom: 15,
        height: height * .7
    },

    button: {
        backgroundColor: '#136AC7',
        borderRadius: 5,
        padding: 10
    },

    buttonDisabled: {
        backgroundColor: '#999',
        borderRadius: 5,
        padding: 10
    },

    buttonLabel: {
        fontSize: 14,
        color: '#FFF',
        alignSelf: 'center'
    }

}

export default TermsAndConditions;