import { Keyboard, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTranslation } from 'react-i18next';
import CustomButton from '../../components/customButton';
import { COLORS } from '../../theme';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { useDispatch, useSelector } from 'react-redux';
import { apiResendOtp, apiVerifyOtp, loginActions } from '../../redux/actions/loginActions';
import Toast from 'react-native-simple-toast';
import { actions } from '../../redux/actions';
import { ShowErrorToast } from '../../utils/common';



const CELL_COUNT = 6;
const RESEND_OTP_TIME_LIMIT = 60;

const OtpView = ({ navigation }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch()
    const auth = useSelector(({ auth }) => auth);
    const authuser = auth.data

    const [OtpValue, setOtpValue] = useState('');
    const [isDisabled, setDisabled] = useState(false);

    const phone_number = authuser.phone_number
    const email = authuser.email
 
    let resendOtpTimerInterval;

    const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(RESEND_OTP_TIME_LIMIT,);

    //to start resent otp option
    const startResendOtpTimer = () => {
        if (resendOtpTimerInterval) {
            clearInterval(resendOtpTimerInterval);
        }
        resendOtpTimerInterval = setInterval(() => {
            if (resendButtonDisabledTime <= 0) {
                clearInterval(resendOtpTimerInterval);
            } else {
                setResendButtonDisabledTime(resendButtonDisabledTime - 1);
            }
        }, 1000);
    };

    //on click of resend button
    const onResendOTP = () => {
        //clear input field
        setOtpValue('')
        setResendButtonDisabledTime(RESEND_OTP_TIME_LIMIT);
        startResendOtpTimer();

        dispatch(apiResendOtp(authuser.token))
            .then((response) => {
                //console.log("apiVerifyOtp res:: ", response)
                if (response.status == 200) {
                    if (authuser.user_status === 1) {
                    } else {
                    }
                } else {
                    console.log("apiVerifyOtp res error:: ", response)
                }
                Toast.show(response.message, Toast.SHORT);
            }).catch((error) => {
                console.log("apiVerifyOtp error:: ", error.data && error.data.message)
            })
    };

    //start timer on screen on launch
    useEffect(() => {
        startResendOtpTimer();
        return () => {
            if (resendOtpTimerInterval) {
                clearInterval(resendOtpTimerInterval);
            }
        };
    }, [resendButtonDisabledTime]);

    useEffect(() => {
        if (OtpValue.trim())
            onVerifyOTP()
    }, [OtpValue]);


    const onVerifyOTP = () => {
        Keyboard.dismiss()
        console.log(OtpValue)
        const request = {
            // phone_number: phone_number,
            email: email,
            otp: OtpValue
        }
        setDisabled(true)
        dispatch(apiVerifyOtp(request, authuser.token))
            .then((response) => {
                setDisabled(false)
                //console.log("apiVerifyOtp res:: ", response)
                if (response.status == 200) {
                    if (authuser.user_status === 1) {
                        navigation.navigate('thankyou');
                    } else {
                        dispatch({
                            type: actions.login.VERIFY_SUCCESS,
                            payload: response.data,
                        });
                    }

                } else {
                    console.log("apiVerifyOtp res error::------- ", response)
                }
                Toast.show(response.message, Toast.SHORT);
            }).catch((error) => {
                setDisabled(false)
                console.log("apiVerifyOtp error:: --+++++----", error.data && error.data.message)
                ShowErrorToast(error)
            })

    }

    const formatTime = () => {
        var minutes = Math.floor((resendButtonDisabledTime % 3600) / 60);
        var sseconds = Math.floor(resendButtonDisabledTime % 60);
        return String(minutes).padStart(2, '0') + " : " + String(sseconds).padStart(2, '0')
    }


    return (
        <SafeAreaView style={{ backgroundColor: COLORS.secondary, paddingTop: hp(5), flex: 1 }}>
            <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} >
                <Text style={styles.headerTitle}>{t('common:VerifyPhoneNumber')}</Text>
                <Text style={[styles.text, { marginHorizontal: wp(8), lineHeight: 25, fontSize: 15 }]}>{t('common:otpMsg') + email}</Text>
                <Text style={[styles.text, styles.textDark]}>{t('common:enterOtp')}</Text>
                {/* <CustomText style={[styles.text, styles.textDark]}>{'Enter One-Time Password (OTP)'}</CustomText> */}

                <View style={{ height: 50, width: "50%", marginHorizontal: wp(10) }}>
                    <OTPInputView
                        style={{ width: '100%', height: 70 }}
                        pinCount={CELL_COUNT}
                        // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                        // onCodeChanged = {code => { this.setState({code})}}
                        autoFocusOnLoad
                        //autoFocusOnLoad={false}
                        codeInputFieldStyle={styles.underlineStyleBase}
                        codeInputHighlightStyle={styles.underlineStyleHighLighted}
                        onCodeFilled={(code => {
                            console.log(`Code is ${code}, you are good to go!`)
                            setOtpValue(code)
                        })}
                    />
                </View>


                {
                    resendButtonDisabledTime > 0 ? <Text style={styles.text}>{formatTime()}</Text> : null
                }


                <View style={{ marginTop: hp(10), marginHorizontal: hp(10), width: '40%' }}>
                    <CustomButton
                        isDisabled={isDisabled}
                        onCallback={onVerifyOTP} title={t('common:verify')} textStyle={{ fontSize: 20 }} />
                </View>

                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <Text style={[styles.text, { fontWeight: 'bold', textAlign: 'left' }]}>
                        {t('common:haventReceivedOTP')}{' '}
                        <Text style={{ color: COLORS.textDark, textDecorationLine: 'underline' }}
                            onPress={() => {
                                // resend
                                Keyboard.dismiss()
                                onResendOTP()
                            }}
                        >
                            {t('common:resend')}{' '}
                        </Text>
                    </Text>
                </View>
            </View>

        </SafeAreaView>
    )
}

export default OtpView

const styles = StyleSheet.create({
    headerTitle: {
        fontSize: 20,
        color: COLORS.textDark,
        // fontWeight: 'bold',
        marginTop: hp(5),
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
    },
    text: {
        fontSize: 16,
        color: COLORS.text,
        marginTop: hp(5),
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
    },
    textDark: {
        color: COLORS.textDark,
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
    },
    borderStyleBase: {
        width: 30,
        height: 45
    },

    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 2,

    },

    underlineStyleHighLighted: {
        borderColor: COLORS.primary,
        color: COLORS.primary,
    },
})