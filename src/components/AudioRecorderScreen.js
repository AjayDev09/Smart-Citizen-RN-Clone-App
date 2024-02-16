import React, { useEffect, useState } from 'react';
import { View, Button, Platform, Image, TouchableOpacity, StyleSheet, SafeAreaView, Text, Dimensions, PermissionsAndroid } from 'react-native';
import AudioRecorderPlayer, {
    AVEncoderAudioQualityIOSType, AVEncodingOption, AudioEncoderAndroidType, AudioSourceAndroidType,
    OutputFormatAndroidType
} from "react-native-audio-recorder-player";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


import { close, iconMic, send_message } from '../constants/images';
import { COLORS } from '../theme';
import { RFValue } from "react-native-responsive-fontsize";
import { useTranslation } from 'react-i18next';
import Modal from "react-native-modal";
import { millisToMinutesAndSeconds } from '../utils/common';
import { CachesDirectoryPath, } from 'react-native-fs';


const path = Platform.select({
    ios: `voice_${(new Date().toJSON().slice(0, 10))}.m4a`,
    android: `${CachesDirectoryPath}/voice_${(new Date().toJSON().slice(0, 10))}.mp3`,
    // ios: undefined,
    //android: undefined,
});
const audioRecorder = new AudioRecorderPlayer();

const screenWidth = Dimensions.get('screen').width;

const AudioRecorderScreen = ({ recordCallBack, modalRecordVisible, setModalRecordVisible ,audioRecorderPlayer ,setisRecodeingOn}) => {

    const { t, i18n } = useTranslation();
    const [isRecording, setIsRecording] = useState(false);
    const [audiostate, setAudiostate] = useState({
        isLoggingIn: false,
        recordSecs: 0,
        recordTime: '00:00',
        currentPositionSec: 0,
        currentDurationSec: 0,

    })
        useEffect(()=>{
            modalRecordVisible && setisRecodeingOn(true)
        },[modalRecordVisible])
    const requestMicrophonePermission = async () => {
        try {
            if (Platform.OS === 'ios') {
                return true;
            }
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                {
                    title: t("common:permissions_for_record_audio"),
                    message: t("common:give_permission_to_your_device_to_record_audio"),
                    buttonPositive: t("common:okay"),
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    const startRecording = async () => {
        audioRecorderPlayer.stopPlayer()
        if (Platform.OS === 'android') {
            // try {
            //   const grants = await PermissionsAndroid.requestMultiple([
            //     PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            //     PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            //     PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            //   ]);
            //   console.log('write external stroage', grants);
            //   if (
            //     grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            //       PermissionsAndroid.RESULTS.GRANTED &&
            //     grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            //       PermissionsAndroid.RESULTS.GRANTED &&
            //     grants['android.permission.RECORD_AUDIO'] ===
            //       PermissionsAndroid.RESULTS.GRANTED
            //   ) {
            //     console.log('permissions granted');
            //   } else {
            //     console.log('All required permissions not granted');
            //     return;
            //   }
            // } catch (err) {
            //   console.warn(err);
            //   return;
            // }


            try {
                const storagePermission = await PermissionsAndroid.requestMultiple(
                    [PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE])
                if (storagePermission) {
                    const permission = await requestMicrophonePermission();
                    if (permission) {
                        console.log('permissions granted');
                    } else {
                        console.log('All required permissions not granted');
                        return;
                    }
                }
            }
            catch (err) {
                console.warn(err);
                return;
            }
        }

        // const result = await audioRecorder.startRecorder();
        const audioSet = {
            AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
            AudioSourceAndroid: AudioSourceAndroidType.MIC,
            AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
            AVNumberOfChannelsKeyIOS: 2,
            AVFormatIDKeyIOS: AVEncodingOption.aac,
            OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
        };


        const result = await audioRecorder.startRecorder(
            path,
            audioSet,
        );

        audioRecorder.addRecordBackListener((e) => {
            //console.log('playBackListener', e);
            // setIsRecording(false)
            setAudiostate({
                recordSecs: e.currentPosition,
                recordTime: millisToMinutesAndSeconds(e.currentPosition),
            })
        });
        // console.log('result', result)
        if (result) {
            setIsRecording(true);
            setModalRecordVisible(true);
        }
    };

    const stopRecording = async () => {
        const result = await audioRecorder.stopRecorder();
        audioRecorder.removeRecordBackListener();
        if (result) {
            console.log('stopRecording result ????Cancel/----------------->', result) 
            recordCallBack({
                isRecording: false,
                recordSecs: 0,
                result: result,
                duration:audiostate?.recordTime
            })
            setIsRecording(false);
            setModalRecordVisible(false);
        }
    };
    const onCancel = async () => {
        const result = await audioRecorder.stopRecorder();
        audioRecorder.removeRecordBackListener();
        if (result) {
            // console.log('stopRecording result ????Cancel/', result)
            setIsRecording(false);
            setModalRecordVisible(false);
        }
    };

    const ShowModel = () => {
        return <Modal
            isVisible={modalRecordVisible}
            style={styles.view}
            transparent={true}
            swipeDirection={['up', 'left', 'right', 'down']}

        >
            <SafeAreaView style={{
                width: '100%',
                backgroundColor: COLORS.secondary,
                flexDirection: 'row',
                alignSelf: 'center',
                paddingVertical: 10
            }}>
                <TouchableOpacity
                    style={{ paddingTop: 10 }}
                    onPress={() => {
                        onCancel()
                        setModalRecordVisible(!modalRecordVisible);
                    }}>
                    <Image
                        source={close}
                        style={[styles.image, {
                            width: 20,
                            height: 20,
                            marginLeft: 10,

                            tintColor: COLORS.textDark
                        }]}
                    />
                </TouchableOpacity>

                <View style={styles.textContainer}>
                    <Text style={styles.text}>{audiostate.recordTime}</Text>
                </View>

                <View style={styles.container}>
                    <TouchableOpacity
                        onPress={stopRecording}
                    >
                        <Image
                            source={send_message}
                            style={[{
                                width: wp(8),
                                height: wp(8),

                            }]}
                        />
                    </TouchableOpacity>

                </View>

            </SafeAreaView>
        </Modal>
    }


    return (
        <View>
            <TouchableOpacity
                style={styles.messagingbuttonContainer}
                onPress={() => {
                    startRecording()
                }}
            >
                <Image
                    source={iconMic}
                    style={[{
                        width: wp(7),
                        height: wp(7),
                        tintColor:COLORS.primary
                    }]}
                />
            </TouchableOpacity>
            {
                modalRecordVisible && isRecording ? ShowModel() : null
            }
        </View>
    );
};

export default AudioRecorderScreen;


const styles = StyleSheet.create({
    view: {
        width: '100%',
        justifyContent: 'flex-end',
        margin: 0,
        alignItems: 'center'
    },
    container: {
        flex: 1,
        //  backgroundColor: "lavender",
        justifyContent: "center",
        alignItems: "flex-end",
        paddingRight: 20
    },
    textContainer: {
        marginTop: 10,
        marginLeft: 20,
    },
    text: {
        textAlign: "center",
        fontWeight: "bold",
        color: COLORS.text,
        fontSize: RFValue(15),
        marginBottom: hp(2)
    },

    bathsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    details: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    typeinnerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10
    },
    viewBarWrapper: {
        marginTop: 28,
        marginHorizontal: 28,
        alignSelf: 'stretch',
    },
    viewBar: {
        backgroundColor: '#ccc',
        height: 4,
        alignSelf: 'stretch',
    },
    viewBarPlay: {
        backgroundColor: 'white',
        height: 4,
        width: 0,
    },
});