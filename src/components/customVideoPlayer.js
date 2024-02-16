import React, { memo, useCallback, useEffect, useState } from 'react'
import { View, Text, StyleSheet, Platform, TouchableOpacity, Image } from 'react-native'
import VideoFullScreen from '../screens/publicFeed/videoFullscreen';
import { createThumbnail } from "react-native-create-thumbnail";
import FastImage from 'react-native-fast-image';
import { close, dislike, playButton } from '../constants/images';
import { COLORS } from '../theme';
import convertToProxyURL from 'react-native-video-cache';
import Video from 'react-native-video';
import { fileNameFromUrl } from '../utils/common';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';



const CustomVideoPlayer = ({ videoUrl = "", selectedImage, itemList, videoHight = 130,
    videoWidth = 180, onLongPress, showDownload = false,
    showPlayIcon = true, onPress }) => {
    const videoPlayer = React.useRef();
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [isMuted, setIsMuted] = React.useState(false);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [thumbnail, setThumbnail] = React.useState("");
    const [didMount, setDidMount] = React.useState(false);
    // const togglePlaying = () => { };
    // const goFullScreen = () => {
    //     if (videoPlayer.current) {
    //         videoPlayer.current.presentFullscreenPlayer();
    //     }
    // };
    const [loadingSkeleten, setLoadingSkeleten] = useState(true);
    const goFullScreen1 = () => {
        setModalVisible(!modalVisible)
    };

    useEffect(() => {
        setDidMount(true);
        videoPlayer.current = true
        getURL()
        return () => {
            videoPlayer.current = false;
        };
    }, [videoUrl]);

    const getURL = useCallback(() => {
        createThumbnail({
            url: videoUrl,
            timeStamp: 1000,
            cacheName: fileNameFromUrl(videoUrl)
        })
        .then(response => {
            if (videoPlayer.current) {
                setThumbnail(response.path);
                setLoadingSkeleten(false);
            }
        })
        .catch(error => {
            console.error('Error generating thumbnail:', error);
        });
    }, [videoUrl]);


    return (
        <TouchableOpacity style={[styles.container]} onLongPress={onLongPress && onLongPress}
            onPress={onPress ? onPress : goFullScreen1}  >
            <SkeletonContent
                containerStyle={{ flex: 1, width: videoWidth }}
                isLoading={loadingSkeleten}
                animationDirection="horizontalRight"
                boneColor='#e1e9ee'
                highlightColor='#ffffff'
                layout={[
                    { key: 'Id1', width: videoWidth, height: videoHight, marginHorizontal: 0 },
                ]}
            >

                {/* <Video
                //  fullscreenAutorotate
                ref={ref => (videoPlayer.current = ref)}
                //  source={{ uri: videoUrl }}   // Can be a URL or a local file.
                //  source={{ uri: videoUrl }}   // Can be a URL or a local file.
                source={{ uri: convertToProxyURL(videoUrl) }}
                // onError={this.videoError}   
                resizeMode={"cover"}

                paused={false}
                muted={true}
                // audioOnly={false}
                // onReadyForDisplay={()=>{ }}
                // onAudioFocusChanged= {()=>{ }}
                currentTime={2}
                //  playInBackground={false} // Audio continues to play when app entering background.
                //  playWhenInactive={false}
                repeat={false}            // Callback when video cannot be loaded
                style={styles.backgroundVideo}
            /> */}
                <View style={{ width: videoWidth, height: "100%", justifyContent: 'center', alignItems: 'center' }}>
                    <FastImage style={{ width: videoWidth, height: videoHight }}
                        source={{
                            uri: thumbnail ? thumbnail : "",
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                    {
                        showPlayIcon ? <Image
                            source={playButton}
                            style={[styles.image_small, {
                                width: 30,
                                height: 30,
                                // tintColor:  COLORS.white ,
                                position: 'absolute'
                            }]}
                        /> : null
                    }

                </View >
            </SkeletonContent>
            {/* {getURL()} */}
            {
                modalVisible && videoUrl !== "" ? <VideoFullScreen
                    modalVisible={modalVisible} setModalVisible={setModalVisible}
                    selectedImage={selectedImage}
                    itemList={itemList} showDownload={showDownload} /> : null
            }



        </TouchableOpacity>
    )
}

export default memo(CustomVideoPlayer)

// Later on in your styles..
var styles = StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        alignSelf: 'center',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        //width: 10,
        //minWidth: 150,
        // backgroundColor: '#000',
        // aspectRatio: 1,
        // width: "100%"
    },
    container: { flex: 1, justifyContent: "center", },
    buttonContainer: {
        // position: 'absolute',
        // justifyContent: 'center',
        // alignItems: 'center',
        // top: 0,cd
        // bottom: 0,
        // left: 0,
        // right: 0,

    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    // slider: {
    //     height: resizeUI(3),
    //     marginTop: resizeUI(12),
    //     width: '100%',
    // },
    // playButton: {
    //     marginHorizontal: resizeUI(32),
    // },
    directionOptions: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // bottomRow: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     paddingHorizontal: resizeUI(8),
    //     width: '100%',
    // },
});