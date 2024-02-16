
import { StyleSheet, Text, TouchableOpacity, View, Image, PermissionsAndroid, Platform } from 'react-native'
import React, { useState } from 'react'
import { attach, gallery } from '../constants/images'
import { COLORS } from '../theme'
import BottomSheetModalComponent from './BottomSheetModalComponent';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTranslation } from 'react-i18next';

export default function CustomUpload({
    AddComment,
    postComment
}) {
    const [showChoosePhote, setShowChoosePhote] = useState(false);
    const { t, i18n } = useTranslation();

    const title = i18n.language === 'he' ? "שיתוף מיקום" : i18n.language === 'ar' ? "مشاركة الموقع" : "Location Permission"
    const message = i18n.language === 'he' ? "ע\"י שיתוף מיקומך ניתן למצוא קופונים בסביבתך " : i18n.language === 'ar' ? "من خلال مشاركة موقعك، يمكنك العثور على كوبونات في منطقتك" : 'Toshav Haham needs access to your location so you can find the nearest coupons.'
    const buttonNeutral = i18n.language === 'he' ? "הזכר לי מאוחר יותר" : i18n.language === 'ar' ? "ذكرني لاحقا" : "Remind Me Later"

    const androidPermissions = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: title,
                    message: message,
                    buttonNeutral: buttonNeutral,
                    buttonNegative: t("common:cancel"),
                    buttonPositive: t("common:ok"),
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the STORAGE');
            } else {
                console.log('STORAGE permission denied');
            }
            if (granted === PermissionsAndroid.RESULTS.GRANTED) return true
            else return false
        } catch (err) {
            console.warn(err);
            return false
        }
    }

    const handleChoosePhoto = (mediaType) => {
        //  console.log('launchImageLibrary mediaType 123', mediaType)
        const options = {
            chooseFromLibraryButtonTitle: t("common:chooseLibrary"),
            mediaType: mediaType,
            storageOptions: {
                skipBackup: true,
                waitUntilSaved: true,
            },
        };

        launchImageLibrary(options, async (response) => {
            console.log('launchImageLibrary response', response)
            if (response?.assets) {
                // console.log("launchImageLibrary >> " + JSON.stringify(response.assets[0].uri));
                const image = response?.assets && response.assets[0];
                // console.log("url send >> " + response.assets[0].uri.replace('file://', ''));
                postComment(image)
            }
            setShowChoosePhote(!showChoosePhote)
        });



    };

    const onPhotoCallback = (mediaType) => {
        console.log('showChoosePhote', showChoosePhote)
        //
        handleChoosePhoto(mediaType)
    }

    return (
        <TouchableOpacity style={styles.uploadwrapper} onPress={() => {
            const isvalid = androidPermissions()
            if (isvalid)
                setShowChoosePhote(true)
        }}>
            <Image
                //  source={AddComment ? { uri: AddComment.uri } : attach}
                source={gallery}
                style={styles.image}
            />
            {
                showChoosePhote ? <BottomSheetModalComponent
                    modalVisible={showChoosePhote}
                    setModalVisible={setShowChoosePhote}
                    onCallback={onPhotoCallback} /> : null
            }

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    image: {
        width: 25,
        height: 25,
        tintColor: COLORS.primary,
        left: 0
    },
    uploadwrapper: {
        borderRadius: 5,
        //borderColor: COLORS.border,
        // borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
})