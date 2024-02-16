import React, { Component, useState } from 'react';
import { View, StyleSheet, ScrollView, Modal, Alert, TouchableOpacity, Text, Image, FlatList, Dimensions, ImageBackground, Platform, StatusBar, SafeAreaView, ActivityIndicator, PermissionsAndroid } from 'react-native';
import { COLORS } from '../../theme';
import { useEffect } from 'react';
import { close, iconCamera, iconDownload, video_image } from '../../constants/images';
import VideoPlayer from '../../components/VideoPlayer';
import Orientation from 'react-native-orientation-locker';
import ImageZoom from 'react-native-image-pan-zoom';
import { fileNameFromUrl, getFileExtension, isVideo } from '../../utils/common';
import FastImage from 'react-native-fast-image';
// import ReactNativeBlobUtil from 'react-native-blob-util'
import RNFetchBlob from 'react-native-blob-util';

import RNFS from "react-native-fs";
import FileViewer from 'react-native-file-viewer';
import { useRef } from 'react';

const SCREEN_WIDTH = Dimensions.get('screen').width
const SCREEN_HEIGHT = Dimensions.get('screen').height
const VideoFullScreen = ({ modalVisible, setModalVisible, itemList = [], selectedImage = 0,
    updatePosition, showDownload = false }) => {
    var videoPlayer = React.useRef();
    const [fullScreen, setFullScreen] = useState(true);
    const [isPlaying, setIsPlaying] = React.useState(true);
    const [loading, setLoading] = useState(false);

    const seekActionStarted = { current: 0 }
    const currentTime = 0

    useEffect(() => {
        Orientation.lockToPortrait();
        return () => {
            Orientation.lockToPortrait();
        }
    }, [])

    const RenderImagesItem = ({ item, index }) => {
        //    console.log('item.image', item.image)
        return (
            <>
                <View style={styles.container}   >
                    {
                        item && item.image && isVideo(item.image) ?

                            <View style={{ flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>

                                <VideoPlayer item={item} index={index} />

                                <TouchableOpacity onPress={() => {
                                    //  setIsPlaying(p => !p)
                                }}>
                                    {/* <Image
                                        source={close}
                                        style={[styles.image, {
                                            width: 20,
                                            height: 20,
                                            tintColor: COLORS.textDark,
                                            marginTop: 30
                                        }]}
                                    /> */}
                                    <Text style={styles.itemText}>
                                        {/* {!isPlaying? ' Play': "Pause" } */}
                                    </Text>
                                </TouchableOpacity>

                            </View> :
                            <ImageZoom cropWidth={Dimensions.get('window').width}
                                cropHeight={Dimensions.get('window').height}
                                imageWidth={SCREEN_WIDTH - 10}
                                imageHeight={SCREEN_HEIGHT / 2}
                                //swipeDownThreshold={50}
                                pinchToZoom={true}
                            >
                                {/* <Image
                                    style={{
                                        width: SCREEN_WIDTH - 10, height: SCREEN_HEIGHT / 2,
                                        alignSelf: 'center',
                                        resizeMode: 'contain',
                                    }}
                                    source={item.image ? { uri: item.image } : video_image} /> */}

                                <FastImage style={{ width: SCREEN_WIDTH - 10, height: SCREEN_HEIGHT / 2, }}
                                    source={{
                                        uri: item.image ? item.image : "",
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.contain}
                                />
                            </ImageZoom>

                    }

                </View>
            </>
        )
    }

    // 
    const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });
    const onViewRef = React.useRef((viewableItems) => {
        // if (viewableItems?.changed[0]?.index || viewableItems?.changed[0]?.index == 0) {
        //     updatePosition(viewableItems.changed[0].index);
        // }
    });
    const getItemLayout = (data, index) => ({
        length: window.width,
        offset: window.width * index,
        index,
    });

    const checkPermission = async () => {

        // Function to check the platform
        // If iOS then start downloading
        // If Android then ask for permission

        if (Platform.OS === 'ios') {
            downlandFile();
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission Required',
                        message:
                            'App needs access to your storage to download Photos',
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    // Once user grant the permission start downloading
                    console.log('Storage Permission Granted.');
                    downlandFile();
                } else {
                    // If permission denied then show alert
                    alert('Storage Permission Not Granted');
                }
            } catch (err) {
                // To handle permission related exception
                console.warn(err);
            }
        }
    };
    var task = useRef()
    const downlandFile = async () => {
        let dirs = RNFetchBlob.fs.dirs
        const { PictureDir, DocumentDir, DownloadDir, MainBundleDir, DCIMDir } = dirs;

        let ext = getFileExtension(itemList[selectedImage].image);
        ext = '.' + ext[0];

        const imageName = fileNameFromUrl(itemList[selectedImage].image)
        var SavePath = Platform.OS === 'ios' ? DocumentDir : RNFS.PicturesDirectoryPath;

        try {
            console.log('loading', loading)
            if (!loading) {
                const { config } = RNFetchBlob;
                const isIOS = Platform.OS == 'ios';
                const aPath = Platform.select({ ios: DocumentDir, android: DCIMDir });
                // const fPath = aPath + Date.now() + imageName;

                const fPath = SavePath + '/toshavhaham/' + Date.now() + imageName;


                console.log('SavePath', SavePath)
                console.log('fPath', fPath)
                const configOptions = Platform.select({
                    ios: {
                        fileCache: true,
                        path: fPath,
                        notification: true,
                        IOSDownloadTask: true,
                        transform: true,
                    },
                    android: {
                        fileCache: true,
                        addAndroidDownloads: {
                            useDownloadManager: true,
                            notification: false,
                            path: fPath,
                            description: 'Downloading...',
                        },
                    },
                });
                setLoading(true)
                task.current = config(configOptions).fetch('GET', itemList[selectedImage].image)
                //console.log('config task', task)
                task.current.progress({ count: 5 }, (received, total) => {
                    //  console.log('progress task', task.taskId)
                    console.log('progress', ((received / total) * 100))
                })
                task.current.then(async (res) => {
                    //   console.log('res', res)
                    //  Alert.alert('', 'Downloaded Successfully.');
                    console.log('fPath', fPath)
                    if (isIOS) {
                        console.log("in --- ")
                        setTimeout(() => {
                            setLoading(false)
                            console.log('file ----- ', 'file://' + res.path())
                            //  RNFetchBlob.ios.presentPreview('file://' + res.path());
                            FileViewer.open('file://' + res.path(), { showOpenWithDialog: true })
                        }, 800);
                        // saveIosFile(fPath, res)
                    } else {
                        setLoading(false)
                        setTimeout(() => {
                            setLoading(false)
                            RNFetchBlob.android.actionViewIntent(fPath,
                                isVideo(itemList[selectedImage].image) ? 'video/mp4' : 'image/png')
                        }, 800);
                    }
                })
                task.current.catch(e => {
                    //console.log("e ", e)
                    setLoading(false)
                });
            } else {
                if (task.current) {
                    await task.current.cancel((err, taskId) => {
                        console.log('err, taskId', taskId)
                    });
                    task.current = null
                }

            }

        } catch (e) {
            e
        }


    }

    const saveIosFile = async (fPath, res) => {
        // await RNFetchBlob.fs.appendFile(fPath, res.path(), 'uri');
        await RNFetchBlob.fs.writeFile(fPath, res.path(), 'uri');
        setTimeout(() => {
            setLoading(false)
            console.log('file>>>', 'file://' + fPath)
            RNFetchBlob.ios.presentPreview(fPath);
        }, 800);
    }

    return (
        <Modal
            style={styles.container}
            onRequestClose={() => {
                //  setModalVisible(!modalVisible);
            }}
        >
            <SafeAreaView style={{
                display: 'flex',
                flex: 1, backgroundColor: COLORS.secondary,
                flexDirection: 'column',
            }}>
                <View style={{
                    display: 'flex', flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 10
                }}>
                    <TouchableOpacity
                        style={{ paddingHorizontal: 20, paddingVertical: 15, }}
                        onPress={() => {
                            Orientation.lockToPortrait()
                            setModalVisible(!modalVisible);
                        }}>
                        <Image
                            source={close}
                            style={[styles.image, {
                                width: 15,
                                height: 15,
                                tintColor: COLORS.text
                            }]}
                        />
                    </TouchableOpacity>

                    {
                        showDownload ? <TouchableOpacity
                            //  disabled={loading}
                            style={{
                                paddingHorizontal: 20,
                                paddingVertical: 15,
                                //backgroundColor: '#000'
                            }}
                            onPress={() => {
                                console.log("ReactNativeBlobUtil")
                                checkPermission()
                            }}>
                            <Image
                                source={loading ? close : iconDownload}
                                style={[styles.image, {
                                    width: 15,
                                    height: !loading ? 18 : 15,
                                    resizeMode: 'cover',
                                    tintColor: COLORS.text
                                }]}
                            />
                            {
                                loading ? <View style={[styles.loading]}>
                                    <ActivityIndicator size="large" color={COLORS.primary} />
                                </View> : null
                            }
                        </TouchableOpacity> : null
                    }


                </View>
                <View style={{
                    marginTop: 0,
                    flex: 1, display: 'flex', backgroundColor: COLORS.secondary, justifyContent: 'flex-start',
                    flexDirection: 'row'
                }}>

                    {/* {itemList && itemList.length > 0 ? <VideoPlayer item={itemList[selectedImage]} index={selectedImage} /> : null} */}
                    {itemList && itemList.length > 0 ?
                        itemList[selectedImage] && itemList[selectedImage].image && isVideo(itemList[selectedImage].image) ? //(itemList[selectedImage].image.toString().endsWith("mp4") || itemList[selectedImage].image.toString().endsWith("mov"))
                            <VideoPlayer item={itemList[selectedImage]} index={selectedImage} /> :
                            <RenderImagesItem item={itemList[selectedImage]} index={selectedImage} />
                        : null}

                </View>

            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        flexDirection: 'column',
        backgroundColor: COLORS.secondary,
        paddingBottom: 30,
        paddingHorizontal: 10,
        overflow: 'hidden',
    },
    itemText: {
        fontSize: 18,
        color: COLORS.text,
        textAlign: 'left',
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold"
    },
    backgroundVideo: {
        aspectRatio: 1,
        // width: "100%",
        height: SCREEN_HEIGHT - 200,
        alignSelf: 'center',
        // backgroundColor: '#FFF',
        //backgroundColor: COLORS.secondary,
    },
    rbStyle: {
        backgroundColor: COLORS.secondary,

    },
    image: {
        // width: 20,
        // height: 20,
    },
    loading: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        //marginTop: '50%',
        alignSelf: 'center',
        top: 5,
    }
});

export default VideoFullScreen;
