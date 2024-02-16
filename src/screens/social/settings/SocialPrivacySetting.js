import React, { useEffect, useState } from 'react'
import { Platform, StyleSheet, Text, View, Switch } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { useDispatch, useSelector } from 'react-redux';

import { COLORS } from '../../../theme';
import { socialPostSetting } from '../../../redux/actions/socialActions';
import { getProfile } from '../../../redux/actions/loginActions';
import { useTranslation } from 'react-i18next';

const SocialPrivacySetting = () => {
    const { t, i18n } = useTranslation();
    const authUser = useSelector(({ auth }) => auth.data)
    const user = useSelector(({ user }) => user.profile)

    const [isEnabled, setIsEnabled] = useState(user.account_privacy === 1);
    const [isShabbat, setShabbatEnabled] = useState(user.observers_shabbat === 1);
    const dispatch = useDispatch()

    useEffect(() => {
        // console.log('isEnabled????', user)
    }, [user])
    const toggleSwitch = (status, isPrivacy) => {
        console.log('isPrivacy', status, isPrivacy)
        if (isPrivacy)
            setIsEnabled(previousState => !previousState)
        else
            setShabbatEnabled(previousState => !previousState)

        const param = {
            account_privacy: isPrivacy? isEnabled == false ? 1 : 0 : isEnabled == false ?  0 : 1,
            observers_shabbat: isPrivacy? isShabbat == false ? 0 : 1 : isShabbat == false ? 1 : 0
        }
        console.log('param', param)
        dispatch(socialPostSetting(param, authUser.token))
            .then((res) => {
                //console.log('res.data', res.message)
                if (res.status === 200) {
                    console.log('res.data', res.message)
                    dispatch(getProfile(authUser.token))
                }
            }).catch((error) => {
                // console.log('res.error', error)
            })
    };

    const toggleShabbat = () => {
        setShabbatEnabled(previousState => !previousState)

        const param = {
            account_privacy: isEnabled == false ? 0 : 1,
            observers_shabbat: isShabbat == false ? 1 : 0
        }
        console.log('param', param)
        dispatch(socialPostSetting(param, authUser.token))
            .then((res) => {
                //console.log('res.data', res.message)
                if (res.status === 200) {
                    console.log('res.data', res.message)
                    dispatch(getProfile(authUser.token))
                }
            }).catch((error) => {
                // console.log('res.error', error)
            })
    };


    return (
        <View style={styles.container}>
            <View style={styles.childContainer}>
                <Text style={styles.itemText}>{t("common:private_account")}</Text>
                <Switch

                    trackColor={{ false: COLORS.textPlaceHolder, true: COLORS.textPlaceHolder }}
                    thumbColor={isEnabled ? COLORS.primary : COLORS.textDark}
                    ios_backgroundColor={COLORS.textPlaceHolder}
                    onValueChange={(value) => toggleSwitch(value, true)}
                    value={isEnabled}
                />
            </View>
            <View style={[styles.childContainer, { marginTop: 15 }]}>
                <Text style={[styles.itemText, { fontSize: RFValue(14), lineHeight: 16, textAlign: 'left' }]}> {
                    `${t("common:privacy_msg1")} "\n\n" ${t("common:privacy_msg2")}`
                }</Text>
            </View>
            <View style={[styles.childContainer, { marginTop: hp(10) }]}>
                <Text style={styles.itemText}>{t("common:shabBatTital")}</Text>
                <Switch
                    trackColor={{ false: COLORS.textPlaceHolder, true: COLORS.textPlaceHolder }}
                    thumbColor={isShabbat ? COLORS.primary : COLORS.textDark}
                    ios_backgroundColor={COLORS.textPlaceHolder}
                    onValueChange={(value) => toggleSwitch(value, false)}
                    value={isShabbat}
                />
            </View>
            <View style={[styles.childContainer, { marginTop: 15 }]}>
                <Text style={[styles.itemText, { fontSize: RFValue(14), lineHeight: 16, textAlign: 'left' }]}> {
                    `${t("common:shabBatDesc")} ` //"\n\n" ${t("common:privacy_msg2")}
                }</Text>
            </View>
        </View>
    )
}

export default SocialPrivacySetting

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: COLORS.secondary,

    },
    childContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp(3),
        paddingHorizontal: wp(3),
        //  backgroundColor:"#000"
    },
    itemText: {
        fontSize: RFValue(16),
        color: COLORS.text,
        //textAlign: 'left',
        marginLeft: wp(2),
        marginRight: wp(1),

        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
    },
})