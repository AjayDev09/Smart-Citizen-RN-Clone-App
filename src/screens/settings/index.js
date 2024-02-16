import { Alert, Keyboard, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS } from '../../theme'
import CustomInput from '../../components/customInput';
import DropdownComponent from '../../components/dropdownComponent';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

import { useTranslation } from 'react-i18next';
import RNRestart from 'react-native-restart';
import { I18nManager } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-simple-toast';
import { changePasswordApi, languageSettingApi } from '../../redux/actions/settingsActions';
import { RFValue } from 'react-native-responsive-fontsize'
import { deleteAccountApi, loginActions, logoutApi } from '../../redux/actions/loginActions';
import { ShowErrorToast } from '../../utils/common';
import { ActivityIndicator } from 'react-native-paper';

export const LANGUAGES = [
    { value: 'en', label: 'English', label_ar: 'English', label_he: 'English', label_fr: 'English', label_ru: 'English' },
    { value: 'ar', label: 'Arabic', label_ar: 'Arabic', label_he: 'Arabic', label_fr: 'Arabic', label_ru: 'Arabic' },
    { value: 'he', label: 'Hebrew', label_ar: 'Hebrew', label_he: 'Hebrew', label_fr: 'Hebrew', label_ru: 'Hebrew' },
    { value: 'ru', label: 'Russian', label_ar: 'Russian', label_he: 'Russian', label_fr: 'Russian', label_ru: 'Russian' },
    { value: 'fr', label: 'French', label_ar: 'French', label_he: 'French', label_fr: 'French', label_ru: 'French' },
];

const Settings = () => {
    const { t, i18n } = useTranslation();
    const selectedLanguageCode = i18n.language;
    const navigation = useNavigation();
    const dispatch = useDispatch()

    const auth = useSelector(({ auth }) => auth);
    const authuser = auth.data

    const Delete_account_name = i18n.language === 'he' ? "הסר חשבון" : i18n.language === 'ar' ? "إزالة الحساب" : "Remove Account"
    const Delete_account_masage = i18n.language === 'he' ? "האם אתה רוצה להסיר את החשבון?" : i18n.language === 'ar' ? "هل تريد حذف الحساب؟" : "Do you want to remove account?"


    const [IsCurrentPasswordValidate, setCurrentPasswordValidate] = useState(false);
    const [IsNewPasswordValidate, setNewPasswordValidate] = useState(false);
    const [IsConfirmPasswordValidate, setConfirmPasswordValidate] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const [SettingState, setSettingState] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        language: "",
    });

    useEffect(() => {
        const focusHandler = navigation.addListener('focus', () => {
            setCurrentPasswordValidate(false);
            setNewPasswordValidate(false);
            setConfirmPasswordValidate(false);
        });
        return focusHandler;
    }, [navigation]);



    useEffect(() => {
        setSettingState({ ...SettingState, language: selectedLanguageCode });
    }, [selectedLanguageCode])


    const onChangeValue = (name, value) => {
        setSettingState({ ...SettingState, [name]: value });
    };

    const onLanguageChange = (name, value) => {
        setSettingState({ ...SettingState, [name]: value });
    };

    const onSavePassword = () => {
        Keyboard.dismiss()
        let request = {
            current_password: SettingState.currentPassword,
            new_password: SettingState.newPassword,
            new_password_confirmation: SettingState.confirmPassword

        };
        setCurrentPasswordValidate(false);
        setNewPasswordValidate(false);
        setConfirmPasswordValidate(false);


        var isError = false;

        if (!SettingState.currentPassword.trim()) {
            isError = true;
            setCurrentPasswordValidate(true);
        }
        if (!SettingState.newPassword.trim()) {
            isError = true;
            setNewPasswordValidate(true);
        }
        if (!SettingState.confirmPassword.trim() || SettingState.newPassword !== SettingState.confirmPassword) {
            isError = true;
            setConfirmPasswordValidate(true);
        }

        if (!isError) {
            dispatch(changePasswordApi(request, authuser.token))
                .then((response) => {
                    if (response.status == 200) {
                        setSettingState({
                            ...SettingState,
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: '',
                        })
                    }
                    Toast.show(response.message, Toast.SHORT);
                }).catch((error) => {
                    console.log("changePasswordApi error:: ", error)
                    ShowErrorToast(error)
                })
        }
    };

    const setLanguage = async (code) => {
        let request = {
            language_code: code,
        };
        setLoading(true)
        dispatch(languageSettingApi(request, authuser.token))
            .then(async (response) => {
                setLoading(false)
                if (response.status == 200) {
                    console.log('languageSettingApi response', response)
                    await i18n.changeLanguage(code).then(() => {
                        I18nManager.forceRTL(i18n.language === 'ar' || i18n.language === 'he');
                        setTimeout(() => { RNRestart.Restart(); }, 150);
                    });
                }
                // Toast.show(response.message, Toast.SHORT);
            }).catch((error) => {
                setLoading(false)
                console.log("languageSettingApi error:: ", error)
                ShowErrorToast(error)
            })


    }

    const onDelete = () => {
        Alert.alert(
            t("common:delete_account_name"),
            t("common:delete_account_message"),
            [
                {
                    text: (t("common:yes")), onPress: () => {
                        setTimeout(() => {
                            dispatch(deleteAccountApi(authuser.token))
                                .then((res) => {
                                    dispatch({
                                        type: loginActions.LOGOUT,
                                    });
                                }, 150);
                        }, 150);
                    }
                },
                {
                    text: (t("common:no")),
                    onPress: () => console.log("Cancel Pressed"),
                },
            ]
        );
    }


    return (
        <ScrollView keyboardShouldPersistTaps={'handled'}
            bounces={false} style={styles.container}>
            <Text style={styles.title}>{t('common:changePassword')}</Text>
            <View style={{ display: 'flex', marginLeft: 5, flexDirection: 'column', marginTop: hp(2) }}>

                <View style={{ height: hp(7) }}>
                    <CustomInput
                        name={'currentPassword'}
                        value={SettingState.currentPassword}
                        setValue={onChangeValue}
                        placeholder={t('common:currentPassword')}
                        keyboardType={'default'}
                        isPasswordField={true}
                        hasError={IsCurrentPasswordValidate}
                        errorMessage={t("error:current_Password")}
                    />
                </View>

                <View style={{ height: hp(7), }}>
                    <CustomInput
                        name={'newPassword'}
                        value={SettingState.newPassword}
                        setValue={onChangeValue}
                        placeholder={t('common:newPassword')}
                        keyboardType={'default'}
                        isPasswordField={true}
                        hasError={IsNewPasswordValidate}
                        errorMessage={t("error:new_Password")}
                    />
                </View>
                <View style={{ height: hp(7), }}>
                    <CustomInput
                        name={'confirmPassword'}
                        value={SettingState.confirmPassword}
                        setValue={onChangeValue}
                        placeholder={t('common:confirmPassword')}
                        keyboardType={'default'}
                        isPasswordField={true}
                        hasError={IsConfirmPasswordValidate}
                        errorMessage={t("error:password_confirmation_new")}
                    />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: "15%" }}>
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        activeOpacity={.5}
                        onPress={onSavePassword}
                    >
                        <Text style={[styles.buttonText]}> {t('common:save')} </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.buttonStyle, { marginLeft: wp(10) }]}
                        activeOpacity={.5}
                        onPress={() => {
                            setSettingState({
                                ...SettingState,
                                currentPassword: '',
                                newPassword: '',
                                confirmPassword: '',
                            })
                        }}
                    >
                        <Text style={[styles.buttonText]}> {t('common:cancel')} </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={[styles.title, { marginTop: hp(7) }]}>{t('common:languageSettings')}</Text>

            <View style={{ marginLeft: 5, }}>
                <DropdownComponent
                    name={'language'}
                    value={SettingState.language}

                    setValue={onLanguageChange}
                    placeholder={t('common:chooseLanguage')}
                    data={LANGUAGES}
                />

                <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'center', marginTop: hp(7)
                }}>
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        activeOpacity={.5}
                        onPress={() => {
                            setLanguage(SettingState.language)
                        }}
                    >
                        <Text style={[styles.buttonText]}> {t('common:save')} </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.buttonStyle, { marginLeft: wp(10) }]}
                        activeOpacity={.5}
                        onPress={() => {
                            setSettingState({
                                ...SettingState,
                                language: selectedLanguageCode,
                            })
                        }}
                    >
                        <Text style={[styles.buttonText]}> {t('common:cancel')} </Text>
                    </TouchableOpacity>
                </View>

            </View>
            <View style={{
                flexDirection: 'row', alignItems: 'center',
                justifyContent: 'center', marginTop: "10%", marginBottom: "5%"
            }}>
                <TouchableOpacity
                    style={[styles.buttonStyle, {
                        //  backgroundColor: COLORS.error,
                        marginLeft: wp(20), marginRight: wp(20),
                    }]}
                    activeOpacity={.5}
                    onPress={onDelete}
                >
                    <Text style={[styles.buttonText]}> {t('common:removeAccount')} </Text>
                </TouchableOpacity>
            </View>
            {
                isLoading ? <View style={[styles.loading]}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View> : null
            }
        </ScrollView>
    )
}

export default Settings

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: COLORS.secondary,
        padding: 20,
    },
    title: {
        fontSize: RFValue(25),
        color: COLORS.textDark,
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
        textAlign: 'left'
    },
    buttonText: {
        fontSize: RFValue(16),
        color: COLORS.text,
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
    },
    buttonStyle: {
        flex: 1,
        paddingTop: 10,
        paddingBottom: 10,
        // width: 150,
        backgroundColor: COLORS.primary,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image_small: {
        width: 20,
        height: 20,
        left: 0
    },
    loading: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '50%',
        marginLeft: "40%"
    }
})