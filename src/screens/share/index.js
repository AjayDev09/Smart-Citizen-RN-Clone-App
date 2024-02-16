import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, } from 'react';
import { Modal, Portal } from 'react-native-paper';
import { close, logo, } from '../../constants/images';
import { Image } from 'react-native';
import { COLORS } from '../../theme';
import { useTranslation } from 'react-i18next';
import { useDispatch, } from 'react-redux';
import Share from "react-native-share";
import { ShareApi } from '../../redux/actions/settingsActions';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { getDeepLinkUrl } from '../../constants/constant';

const ShareComponent = ({ onCloseShare, showShare, shareData, shareMessage, shareKey, shareType, token }) => {

    const { t, i18n } = useTranslation();

    const dispatch = useDispatch()

    const item = shareData;
    const coupon_title = i18n.language === 'he' ? item.coupon_title_he : i18n.language === 'ar' ? item.coupon_title_ar : item.coupon_title
    const lastPath = `coupons/${item.coupon_id}`
    //New Code
    const url = `https://toshavhaham/${lastPath}`

    useEffect(() => {
        // https://play.google.com/store/apps/details?id=nic.goi.aarogyasetu&hl=en
        // console.log('shareData', shareMessage + " ", shareData)
    }, [])
    const hideModel = () => { onCloseShare() };

  //  console.log('shareData[shareKey]', shareData[shareKey])
    const shareAPI = (shareBy) => {
        const params = {
            value: shareData[shareKey],
            type: shareType,
            share_by: shareBy
        }
       // console.log('shareAPI params', params)
        dispatch(ShareApi(params, token))
            .then((response) => {
                hideModel()
                console.log('shareAPI response', response)
                //Toast.show(response.message, Toast.SHORT);
            }).catch((error) => {
            })
    }
    const shareAll = async () => {


        const link = await getDeepLinkUrl(url, lastPath)
        console.log('getDeepLinkUrl link', link)
        const shareOptions = {
            title: coupon_title,
            failOnCancel: false,
            message: coupon_title + " \n" + link,
            // url: url,
            //  message: shareMessage + '\n http://txt.st/WBWEIQ',
            // urls: ['http://txt.st/WBWEIQ',],
        };

        const icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAA1hJREFUOE9tkl9sU3UUx7/nd29X2ss22NZ267Zgx7Zu3YCt44+DZQsJGpeYYIbRgM4hC5pBCFEgmhDhwRcNPpho1ERIBIUIYjZlIJgYJzh1TCjZP9paVvnXrn/GupZ2vb2995reN3Xn4Tyck/PJ+Z7zpVWdJ/9w1CxvnPDOAUQqAQBBBaBCVSUVlNVKpKpQtZTrSXZboeK7O5+m5/f2T66uK3FcufYQLY1mLIgyhm8EczP/C6vZiLa1Vpz/wYfu52owcmtmgV45cMHtbDTZv77ox5u7mpFMSTh23LUo4KlNlTjQ60Rn7wB2bavFuHs2Rjve+N69sbnUfuIbL+qrl2PdKgs+Pze1KMDZUILmehNOnJ/Cvm4Hbk3NztGeI1fc7etL7ceOTyCbVfDx0Q68/s7QooC3djsx8NMdeKZjOLrPiV9GHs5Rz8FBT/uGstovvvVhNiaib3sD7gYTuDR071+Qqop87H+1CfvfvQZ9HsOel+owOhaO0ra9A57WJnPtmUE/0qIMHU/44O02jI6H0P/jHYgZBe3rrOjpqseh939FeDYNxoDurSsxOhYJ02uHL3s3rDHVfHLarX0gFxwjdD1dhc1PVoDXMbgmI/jqOw8SSUnr8xzhYG8jRsejYdp56KJvo9Oy8mS/D3PxzKLa/1sUDBx2v2jH7zdnQrT55bPTW1qtttMX/MjTMZSZDLgXTEIzFABFUcEY5cylWUizEYDtz9ow/OdMkBo6T/3d2mRa4br9CAtpGTu7amEpMUDHM3j98xAMOuj1BOMSHWYiKfzmCiEQSmFTixlXrwcD1PbClw9kBeU8I6QlGUY9r91AlGQQEaSsgqJCPYwGnQbMLbBEz0GSVKiKEqCzg5PzHMcVVJblI/44A1ORAWOeKLZuqcbkXxHMJ0TYKgqRFrOanBxwWb4eN6dCWGFdGqMjH15NLCswLu3bsRofnXIhJ3ftmlJIkoKO9ZV477PrcFQXY2jkPmyVhVBkFc90PIHBn/0IR+KPqO/w5cfEcUJPlwPnLnlRZhbQ1lKOeDIDS7ERn54Z0955YyIEnmOoqypCuUXA7ekY7gdiUXoQiA6rKgnEiPE8MSKQXseTLKuUySpIJTNMEPJYPCGSqdjARElhC+ksFQh5LBZPxf4B/fdgLNIvfAAAAAAASUVORK5CYII='

        const options = Platform.select({
            ios: {
                activityItemSources: [
                    { // For sharing url with custom title.
                        placeholderItem: { type: 'url', content: link },
                        item: {
                          //  default: { type: 'url', content: link },
                        },
                        subject: {
                            default: coupon_title,
                        },
                        //linkMetadata: { originalUrl: link, url, coupon_title, icon: icon },
                    },
                    // { // For sharing text.
                    //     placeholderItem: { type: 'text', content: coupon_title },
                    //     item: {
                    //         default: { type: 'text', content: coupon_title },
                    //         message: null, // Specify no text to share via Messages app.
                    //     },
                    //     linkMetadata: { // For showing app icon on share preview.
                    //         title: coupon_title
                    //     },
                    // },
                    { // For using custom icon instead of default text icon at share preview when sharing with message.
                        placeholderItem: {
                            type: 'url',
                            content: icon
                        },
                        item: {
                            default: {
                                type: 'text',
                                content: `${coupon_title} ${link}`, //${shareData.business_logo}
                                message: null, // Specify no text to share via Messages app.
                            },
                        },
                        linkMetadata: {
                            title: coupon_title,
                            image:  icon,
                        }
                    },
                ],
            },
            default: {
                title: coupon_title,
                subject: coupon_title,
                failOnCancel: false,
                type: 'image/png',
                message: coupon_title + " \n" + link,
            },
        });

        try {
            //    const ShareResponse = await Share.ShareSheet(shareOptions)
            const ShareResponse = await Share.open(options);
            console.log('shareAll ShareResponse', ShareResponse)
            //if (ShareResponse.success) {
            shareAPI(2)
            //}
        } catch (error) {
            console.log('Error =>', error);
        }
    };

    const shareWhatsapp = async () => {
        const link = await getDeepLinkUrl(url, lastPath)
        console.log('getDeepLinkUrl link', link)

        const shareOptions = {
            title: coupon_title,
            // subject: shareMessage,
            social: Share.Social.WHATSAPP,
            failOnCancel: false,
            message: coupon_title + " \n" + link,
            url: "",
        };
        try {
            const ShareResponse = await Share.shareSingle(shareOptions);
            if (ShareResponse.success) {
                console.log('shareWhatsapp ShareResponse', ShareResponse)
                shareAPI(0)
            }


        } catch (error) {
            console.log('Error =>', error);
        }
    };

    const shareEmailapp = async () => {

        const link = await getDeepLinkUrl(url, lastPath)
        console.log('getDeepLinkUrl link', link)
        const shareOptions = {
            // title: coupon_title,
            social: Share.Social.EMAIL,
            failOnCancel: false,
            message: coupon_title,
            url: link,
        };

        try {

            const ShareResponse = await Share.shareSingle(shareOptions);
            if (ShareResponse.success) {
                console.log('shareEmailapp ShareResponse', ShareResponse)
                shareAPI(1)
            }
        } catch (error) {
            console.log('Error =>', error);
        }
    };



   
    const containerStyles = {};
    return (
        <Portal  >
            <Modal
                animated
                visible={showShare}
                animationType="fade"
                transparent
                onDismiss={hideModel}
                contentContainerStyle={{ height: 100, justifyContent: 'flex-end' }}
            >
                <View style={styles.overlay}>
                    <View style={styles.container}>
                        <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={hideModel}                        >
                            <Image
                                source={close}
                                style={[styles.image_small, {
                                    width: 18,
                                    height: 18,
                                    tintColor: COLORS.primary
                                }]}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                //setselectedDiscount("Percentage")
                            }}>
                            <Text style={styles.text} onPress={shareWhatsapp} >{t("common:shareOnWhatsApp")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                //setselectedDiscount("Percentage")
                            }}>
                            <Text style={styles.text} onPress={shareEmailapp} >{t("common:shareOnEmail")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                //setselectedDiscount("Percentage")
                            }}>
                            <Text style={styles.text} onPress={shareAll} >{t("common:share")}  </Text>
                        </TouchableOpacity>


                    </View>
                </View>
            </Modal>
        </Portal >
    );
};

export default ShareComponent;

const styles = StyleSheet.create({
    container: {
        //backgroundColor: 'rgba(0,0,0,0.2)',
        flex: 1,
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: 'white',
        paddingTop: 12,
        paddingBottom: 12,
        paddingHorizontal: 5,
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12,
    },
    button: {
        marginTop: 5,
        borderRadius: 15,
        // backgroundColor:'#000',
        alignItems: 'center'
    },
    text: {
        fontSize: 18,
        color: COLORS.primary,
        textAlign: 'left',
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold"
    },
    image_small: {
        width: 20,
        height: 20,
        tintColor: COLORS.text,
        left: 0
    },
});
