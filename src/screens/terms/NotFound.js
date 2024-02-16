import React, { Component, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { COLORS } from '../../theme';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { cmsPagesListApi } from '../../redux/actions/settingsActions';
import Toast from 'react-native-simple-toast';
import HTMLView from 'react-native-htmlview';
import { htmlStylesheet } from '../../constants/constant';
import { ShowErrorToast, ShowToast } from '../../utils/common';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';

const NotFoundComponent = () => {
    const { t, i18n } = useTranslation();
    const navigation = useNavigation()

    const dispatch = useDispatch()
    const authUser = useSelector(({ auth }) => auth.data);

    const [termsDetails, setTermsDetails] = useState({})

    useEffect(() => {
        const focusHandler = navigation.addListener('focus', () => {
            getApiData()
        });
        return focusHandler;
    }, [navigation]);

    useEffect(() => {
        getApiData()
    }, [])


    const getApiData = () => {
        dispatch(cmsPagesListApi(authUser.token))
            .then((res) => {
                if (res.status === 200) {
                    // console.log('content', res.data.term)
                    setTermsDetails(res?.data?.term)
                }
                else
                    ShowToast(response?.message)
            }).catch((error) => {
                ShowErrorToast(error)
            })
    }


    return (
        <ScrollView style={{ backgroundColor: COLORS.secondary, }}>
            <View style={styles.container}>
                <Text style={[styles.itemText, styles.textBold, {}]}>{"App is under maintenance "}</Text>
            </View>
        </ScrollView>
    );
};



const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp("3%"),
        paddingVertical: hp("3%"),
    },
    itemText: {
        fontSize: RFValue(25),
        color: COLORS.text,
        //textAlign: 'left',
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
    },
});

export default NotFoundComponent;
