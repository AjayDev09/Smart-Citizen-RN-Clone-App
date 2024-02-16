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
import { ShowErrorToast, getItemByLngAR } from '../../utils/common';
import { useNavigation } from '@react-navigation/native';

const TermsCondition = () => {
    const { t, i18n } = useTranslation();
    const navigation = useNavigation()

    const dispatch = useDispatch()
    const authuser = useSelector(({ auth }) => auth.data);

    const [termsDetails, setTermsDetails] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const focusHandler = navigation.addListener('focus', () => {
            getTerms()
        });
        return focusHandler;
    }, [navigation]);

    useEffect(() => {
        getTerms()

    }, [])

    const getTerms = () => {
        setLoading(true)
        dispatch(cmsPagesListApi(authuser.token))
            .then((res) => {
                setLoading(false)
                if (res.status === 200) {
                    // console.log('content', res.data.term)
                    setTermsDetails(res?.data?.term)
                }
                else
                    Toast.show(response?.message, Toast.SHORT);
            }).catch((error) => {
                setLoading(false)
                ShowErrorToast(error)
            })
    }


    // const content = i18n.language === 'he' ? termsDetails.content_he : i18n.language === 'ar' ? termsDetails.content_ab : termsDetails.content

    const content = getItemByLngAR(i18n.language, termsDetails, "content")
    return (
        <ScrollView style={{ backgroundColor: COLORS.secondary, }}>
            <View style={styles.container}>
                {
                    content && !loading ? <HTMLView
                        value={content !== "undefined" ? content : termsDetails?.content}
                        stylesheet={htmlStylesheet}
                    /> : null
                }
                {
                    loading ? <ActivityIndicator size="large" color={COLORS.primary} /> : null
                }
            </View>
        </ScrollView>
    );
};



const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp("3%"),
        paddingVertical: hp("3%"),
    },
    itemText: {
        fontSize: 16,
        color: COLORS.text,
        //textAlign: 'left',
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
    },
});

export default TermsCondition;
