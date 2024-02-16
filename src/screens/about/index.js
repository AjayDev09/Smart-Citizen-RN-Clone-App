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
import { RFValue } from 'react-native-responsive-fontsize';
import { htmlStylesheet } from '../../constants/constant';
import { ShowErrorToast, getItemByLngAR } from '../../utils/common';

const AboutSmartCitizen = () => {
    const { t, i18n } = useTranslation();

    const dispatch = useDispatch()
    const authuser = useSelector(({ auth }) => auth.data);

    const [termsDetails, setTermsDetails] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        dispatch(cmsPagesListApi(authuser.token))
            .then((res) => {
                setLoading(false)
                if (res.status === 200) {
                    setTermsDetails(res?.data?.about)
                }
                else
                    Toast.show(response?.message, Toast.SHORT);
            }).catch((error) => {
                setLoading(false)
                ShowErrorToast(error)
            })

    }, [])
    const content = getItemByLngAR(i18n.language, termsDetails, "content")
    return (
        <ScrollView style={{ flex: 1, backgroundColor: COLORS.secondary, }}>
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
        fontSize: RFValue(16),
        color: COLORS.text,
        // textAlign: 'right',
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
    },
});

export default AboutSmartCitizen;
