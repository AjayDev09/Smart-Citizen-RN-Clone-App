import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Dimensions, Pressable, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import convertToProxyURL from 'react-native-video-cache';

// Screen Dimensions
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

function ReelCard({
    item,
    uri,
    _id,
    ViewableItem,
    index,
    // Container Props
    backgroundColor = 'white',

    // Options Props
    optionsComponent,
    pauseOnOptionsShow = true,
    // Player Props
    onFinishPlaying = () => { },
}) {
    // ref for Video Player
    const VideoPlayer = useRef(null);

    // States
    const [VideoDimensions, SetVideoDimensions] = useState({
        width: ScreenWidth,
        height: ScreenWidth,
    });
    const [Progress, SetProgress] = useState(0);
    const [Duration, SetDuration] = useState(0);
    const [Paused, SetPaused] = useState(false);
    const [ShowOptions, SetShowOptions] = useState(false);

    // Play/Pause video according to viisibility
    useEffect(() => {
        if (ViewableItem === _id) SetPaused(false);
        else SetPaused(true);
    }, [ViewableItem]);

    // Pause when use toggle options to True
    useEffect(() => {
        if (pauseOnOptionsShow) {
            if (ShowOptions) SetPaused(true);
            else SetPaused(false);
        }
    }, [ShowOptions, pauseOnOptionsShow]);

    // Callbhack for Seek Update
    const SeekUpdate = useCallback(
        async seekTime => {
            try {
                if (VideoPlayer.current)
                    VideoPlayer.current.seek((seekTime * Duration) / 100 / 1000);
            } catch (error) { }
        },
        [Duration, ShowOptions],
    );

    // Callback for PlayBackStatusUpdate
    const PlayBackStatusUpdate = playbackStatus => {
        try {
            let currentTime = Math.round(playbackStatus.currentTime);
            let duration = Math.round(playbackStatus.seekableDuration);
            if (currentTime)
                if (duration) SetProgress((currentTime / duration) * 100);
        } catch (error) { }
    };

    // function for getting video dimensions on load complete
    const onLoadComplete = event => {
        const { naturalSize } = event;

        try {
            const naturalWidth = naturalSize.width;
            const naturalHeight = naturalSize.height;
            if (naturalWidth > naturalHeight) {
                SetVideoDimensions({
                    width: ScreenWidth,
                    height: ScreenWidth * (naturalHeight / naturalWidth),
                });
            } else {
                SetVideoDimensions({
                    width: ScreenHeight * (naturalWidth / naturalHeight),
                    height: ScreenHeight,
                });
            }
            SetDuration(event.duration * 1000);
        } catch (error) { }
    };

    // function for showing options
    const onMiddlePress = async () => {
        try {
            SetShowOptions(!ShowOptions);
        } catch (error) { }
    };

    // fuction to Go back 10 seconds
    const onFirstHalfPress = async () => {
        try {
            if (VideoPlayer.current) {
                let toSeek = Math.floor((Progress * Duration) / 100) / 1000;
                if (toSeek > 10) VideoPlayer.current.seek(toSeek - 10);
            }
        } catch (error) { }
    };

    // fuction to skip 10 seconds
    const onSecondHalfPress = async () => {
        try {
            if (VideoPlayer.current) {
                let toSeek = Math.floor((Progress * Duration) / 100) / 1000;
                VideoPlayer.current.seek(toSeek + 10);
            }
        } catch (error) { }
    };

    // Manage error here
    const videoError = error => { };


    const videoSrc = Platform.OS === 'ios' ? { uri: item.post } : { uri: convertToProxyURL(item.post) };
    return (
        <Pressable
            style={[styles.container, { backgroundColor: backgroundColor }]}
            onPress={onMiddlePress}>
            <Pressable style={styles.FirstHalf} onPress={onFirstHalfPress} />
            <Pressable style={styles.SecondHalf} onPress={onSecondHalfPress} />
            {/* <Video
                ref={VideoPlayer}
                source={{ uri: item.post }}
                style={VideoDimensions}
                resizeMode="contain"
                onError={videoError}
                playInBackground={false}
                progressUpdateInterval={1000}
                paused={Paused}
                muted={false}
                repeat={true}
                onLoad={onLoadComplete}
                onProgress={PlayBackStatusUpdate}
                onEnd={() => onFinishPlaying(index)}
            /> */}

            {
                item.post_type === 2 ?
                    <View
                        style={{
                            position: 'relative',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            height: ScreenHeight,
                        }}>
                        {/* <Video
                     videoRef={videoRef}
                     onBuffer={onBuffer}
                     onError={onError}
                     repeat={true}
                     resizeMode="cover"
                     paused={currentIndex == index ? false : true}
                     source={{ uri: item.post }}
                     muted={mute}
                     style={{
                       width: '100%',
                       height: '100%',
                     }}
                   /> */}
                   <Video
                     videoRef={VideoPlayer}
                    // onBuffer={onBuffer}
                    // onError={onError}
                     repeat={true}
                     resizeMode="cover"
                     //paused={Paused}
                     source={videoSrc}
                     muted={false}
                     style={{
                       width: '100%',
                       height: '100%',
                     }}
                   />
                        {/* <Video
                            ref={VideoPlayer}
                            source={{ uri: item.post }}
                            style={VideoDimensions}
                            resizeMode="cover"
                            onError={videoError}
                            playInBackground={false}
                            progressUpdateInterval={1000}
                            paused={Paused}
                            muted={false}
                            repeat={true}
                            onLoad={onLoadComplete}
                            onProgress={PlayBackStatusUpdate}
                            onEnd={() => onFinishPlaying(index)}
                            // style={{
                            //     width: '100%',
                            //     height: '100%',
                            //   }}
                        /> */}
                    </View>
                    : <View
                        style={{
                            position: 'relative',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}>
                        <FastImage //style={VideoDimensions}
                            source={{
                                uri: item.post ? item.post : "",
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                             style={{
                                width: '100%',
                                height: '100%',
                              }}
                        />
                    </View>
            }

        </Pressable>
    );
}

// Exports
export default ReelCard;

// Stylesheet
const styles = StyleSheet.create({
    container: {
        width: ScreenWidth ,
        height: ScreenHeight - 60,
        justifyContent: 'center',
    },
    SliderContainer: {
        position: 'absolute',
        width: ScreenWidth,
        height: 55,
        bottom: 0,
        zIndex: 100,
    },
    TimeOne: {
        color: 'grey',
        position: 'absolute',
        left: 15,
        fontSize: 13,
        bottom: 5,
    },
    TimeTwo: {
        color: 'grey',
        position: 'absolute',
        right: 15,
        fontSize: 13,
        bottom: 5,
    },
    OptionsContainer: {
        position: 'absolute',
        right: 10,
        bottom: 70,
        zIndex: 100,
    },
    HeaderContainer: {
        position: 'absolute',
        width: ScreenWidth,
        top: 0,
        height: 50,
        zIndex: 100,
    },
    FirstHalf: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: ScreenWidth * 0.25,
        height: ScreenHeight,
        zIndex: 99,
    },
    SecondHalf: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: ScreenWidth * 0.25,
        height: ScreenHeight,
        zIndex: 99,
    },
});