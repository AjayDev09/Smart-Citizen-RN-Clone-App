
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Alert, Dimensions, Image, Platform, SafeAreaView } from 'react-native'
import { TouchableOpacity, View } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { COLORS } from '../../theme'
import { arrow_back, iconDots, iconSetting, logo, chat } from '../../constants/images'
import { Text } from 'react-native'
import { StyleSheet } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { useDispatch, useSelector } from 'react-redux'
import ContextMenu from 'react-native-context-menu-view';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import { socialPostBlockUser } from '../../redux/actions/socialActions';
import { ShowErrorToast, ShowToast } from '../../utils/common';
import SocialUserReportComponent from '../../components/SocialUserReportComponent';
import { useState } from 'react';


const CustomSocialHeader = ({ useSocialProfile, userID = 0, profiePhoto, title = '',
    customComponent, showMore = false, onBackPress, chatshow = false }) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch()
    const authUser = useSelector(({ auth }) => auth.data)
    const navigation = useNavigation()
    const headerHeight = Platform.OS === 'ios' ? 110 : 55;

    const [modalVisible, setModalVisible] = useState(false)
    console.log('chatshow------', chatshow);

    const onDeleteChoose = () => {
        // if (userID === authUser.user_id) {
        //   return
        // }
        Alert.alert(
            t("common:block_user"),
            t("common:block_user_message"),
            [
                {
                    text: (t("common:yes")), onPress: () => {
                        const params = {
                            block_user_id: userID,
                            is_block: 1,   //1=block,2=unblock
                        }
                        console.log('params', params, authUser.token)
                        dispatch(socialPostBlockUser(params, authUser.token))
                            .then((response) => {
                                console.log('socialPostBlockUser response', response)
                                if (response.status === 200) {
                                    ShowToast(response.message)
                                    navigation.goBack()
                                }
                            }).catch((error) => {
                                // console.log('error', error)
                                ShowErrorToast(error)
                            })
                    }
                },
                {
                    text: (t("common:no")),
                    onPress: () => console.log("Cancel Pressed"),
                },
            ]
        );
    }

    const onCallback = (res) => {
        setModalVisible(false)
        setTimeout(() => {
            ShowToast(res.message)
        }, 1000);
    }

    return (
        <SafeAreaView style={{
            width: Dimensions.get("window").width,
            height: headerHeight,
            backgroundColor: COLORS.primary,
            display: 'flex', flexDirection: "row", alignItems: "flex-end",
            justifyContent: 'space-between',
            // backgroundColor:"#000",
            paddingBottom: 5,
        }}>
            <TouchableOpacity
                style={{
                    marginBottom: 10, alignItems: 'flex-end', marginLeft: wp(3),
                    // backgroundColor:"#000",
                }}
                onPress={() => {
                    if (onBackPress)
                        onBackPress()
                    else
                        navigation.goBack() //navigate('Home')}
                }}
            >
                <Image
                    source={arrow_back}
                    style={[styles.image_small, {
                        width: wp(6),
                        height: wp(6),
                        // 
                        marginRight: wp(4),
                        tintColor: COLORS.white,
                    }]}
                />
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
                {customComponent ? <View style={{ width: "70%" }}>
                    {customComponent && customComponent}
                </View> : <Text style={[styles.cmessage, {
                    textAlign: 'center', color: 'white', marginBottom: 10, marginRight: 10, marginLeft: 10
                }]}>{title}</Text>}
            </View>

            <View style={{ flexDirection: 'row' }}>
                {
                    userID === authUser.user_id ?
                        <TouchableOpacity
                            style={{ width: wp(15), alignItems: 'flex-end' }}
                            onPress={() => {
                                navigation.navigate('socialSetting')
                            }
                            }
                        >
                            <Image
                                source={iconSetting}
                                style={[styles.image_small, {
                                    width: wp(6),
                                    height: wp(6),
                                    tintColor: COLORS.white,
                                }]}
                            />
                        </TouchableOpacity> : showMore ? <ContextMenu
                            actions={[{ title: t("common:block") + " " + t("common:user") }, { title: t("common:report") + " " + t("common:user") }]} // { title: "Report" }
                            dropdownMenuMode={true}
                            onPress={(e) => {
                                // setModalVisible(true)
                                if (e.nativeEvent.index === 0)
                                    onDeleteChoose()
                                else {
                                    setModalVisible(true)
                                }

                            }}
                        >
                            <FastImage
                                style={[styles.image_small, {
                                    width: wp(6),
                                    height: wp(6),
                                    marginLeft: wp(1),
                                }]}
                                source={iconDots}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </ContextMenu> : null
                }



                {
                    chatshow ?
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('messages1');
                        }} style={{ paddingRight: wp(2), marginLeft: wp(1), marginBottom: 10 }} >
                            <Image
                                source={chat}
                                style={{ width: wp(6), height: wp(6), marginLeft: 5, tintColor: '#fff' }}
                            />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('coupons');
                        }} style={{ paddingRight: wp(2), marginLeft: wp(1), marginBottom: 10 }} ><Image
                                source={logo}
                                style={{ width: wp(6), height: wp(6), marginLeft: 5 }}
                            />
                        </TouchableOpacity>
                }

            </View>

            {
                modalVisible ? <SocialUserReportComponent
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    onCallback={(res) => {
                        onCallback(res)
                    }} data={useSocialProfile} /> : null
            }
        </SafeAreaView>
    )
}

export default React.memo(CustomSocialHeader)


export const styles = StyleSheet.create({

    cmessage: {
        opacity: 1,
        fontSize: RFValue(18),
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
    },

});