import React, { useRef, useState } from 'react';
import {
    View, StyleSheet, Modal,
    TouchableOpacity, Text, Image, Dimensions,
    Platform, SafeAreaView, ActivityIndicator, PermissionsAndroid, Alert
} from 'react-native';
import { useEffect } from 'react';
import Orientation from 'react-native-orientation-locker';
import RNFS from "react-native-fs";
import Pdf from 'react-native-pdf';

import { close, iconDownload } from '../constants/images';
import { COLORS } from '../theme';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { fileNameFromUrl, getFileExtension } from '../utils/common';
import FileViewer from 'react-native-file-viewer';

const SCREEN_WIDTH = Dimensions.get('screen').width
const SCREEN_HEIGHT = Dimensions.get('screen').height
const DocumentPopup = ({ modalVisible, setModalVisible, docUrl = "", showDownload = false }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        return () => {
            Orientation.lockToPortrait();
        }
    }, [])


    const checkPermission = async () => {
        if (Platform.OS === 'ios') {
            downlandFile();
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission Required',
                        message: 'App needs access to your storage to download Photos',
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
    const downlandFile = () => {
        let dirs = ReactNativeBlobUtil.fs.dirs

        let ext = getFileExtension(docUrl);
        ext = '.' + ext[0];

        const imageName = fileNameFromUrl(docUrl)
        var SavePath = Platform.OS === 'ios' ? dirs.DocumentDir : RNFS.DownloadDirectoryPath;
        try {
            if (!loading) {
                var date = new Date();
                const { config } = ReactNativeBlobUtil;
                const isIOS = Platform.OS == 'ios';
                // const fPath = aPath + '/' + imageName + Date.now() + ext;
                const fPath = SavePath + '/toshavhaham/' + Date.now() + imageName;

                console.log('SavePath', SavePath)
                console.log('fPath', fPath)
                const configOptions = Platform.select({
                    ios: {
                        fileCache: true,
                        path: fPath,
                        notification: true,
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
                task.current = config(configOptions).fetch('GET', docUrl)
                task.current.progress({ count: 5 }, (received, total) => {
                    //  console.log('progress task', task.taskId)
                    console.log('progress', ((received / total) * 100))
                })
                task.current.then((res) => {
                    // Alert.alert('','Downloaded Successfully.');

                    if (isIOS) {
                        setTimeout(() => {
                            setLoading(false)
                            // ReactNativeBlobUtil.fs.writeFile(fPath, res.path(), 'base64');
                            FileViewer.open('file://' + res.path(), { showOpenWithDialog: true })
                            //  ReactNativeBlobUtil.ios.previewDocument('file://' + fPath);//'file://' +
                        }, 800);
                    }
                    else {
                        setLoading(false)
                        setTimeout(() => {
                            setLoading(false)
                            // ReactNativeBlobUtil.android.actionViewIntent(fPath)
                            ReactNativeBlobUtil.android.actionViewIntent(fPath, 'pdf')
                        }, 800);
                    }
                })
                task.current.catch(e => {
                    setLoading(false)
                    //dispatch(authLoadingAction(false));
                });
            } else {
                task.current && task.current.cancel((err, taskId) => {
                    console.log('err, taskId', taskId)
                });
            }


        } catch (e) {

        }

    }


    const encoded = encodeURI(docUrl);
    // console.log('encoded', encoded)
    const source = { uri: encoded, cache: true };
    return (
        <Modal
            style={styles.container}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
            visible={modalVisible}
        >
            <SafeAreaView style={{
                display: 'flex',
                flex: 1,
                backgroundColor: COLORS.secondary,
                flexDirection: 'column',
                justifyContent: 'center',
            }}>
                <View style={{
                    height: 55,
                    backgroundColor: COLORS.secondary,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    // backgroundColor: "#000",
                    padding: 15
                }}>
                    <TouchableOpacity
                        // style={{  backgroundColor: "#fff", justifyContent: 'center' }}

                        onPress={() => {
                            setModalVisible(!modalVisible);
                        }}>
                        <Image
                            source={close}
                            style={[styles.image, {
                                width: 15,
                                height: 15,
                                marginHorizontal: 20,
                                // marginLeft: 10,
                                tintColor: COLORS.white
                            }]}
                        />
                    </TouchableOpacity>
                    {
                        showDownload ? <TouchableOpacity
                            disabled={loading}
                            style={{
                                paddingHorizontal: 20,
                                paddingVertical: 15,
                                //backgroundColor: '#000'
                            }}
                            onPress={() => {
                                checkPermission()
                            }}>
                            <Image
                                source={loading ? close : iconDownload}
                                style={[styles.image, {
                                    width: 15,
                                    height: !loading ? 18 : 15,
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
                    //marginTop: 10,
                    flex: 1, display: 'flex',
                    alignItems: 'center',
                    backgroundColor: COLORS.secondary, justifyContent: 'center',
                }}>
                    <Pdf
                        source={source}
                        // singlePage={true}
                        trustAllCerts={false}
                        onLoadComplete={(numberOfPages, filePath) => {
                            console.log(`Number of pages: ${numberOfPages}`);
                        }}
                        onPageChanged={(page, numberOfPages) => {
                            console.log(`Current page: ${page}`);
                        }}
                        onError={(error) => {
                            console.log(error);
                        }}
                        onPressLink={(uri) => {
                            console.log(`Link pressed: ${uri}`);
                        }}
                        style={styles.pdf} />
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
    pdf: {
        flex: 1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
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

export default DocumentPopup;
