/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Platform, Dimensions, PixelRatio, Text, AppState } from 'react-native';
import MediaControls, { PLAYER_STATES } from 'react-native-media-controls';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import convertToProxyURL from 'react-native-video-cache';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;


const VideoPlayer = ({ item }) => {
    const [isFullScreen, setIsFullScreen] = useState(Platform.OS === 'ios' ? false : true);
    //const video = require('../assets/video.mp4');
    // const video = { uri: 'http://15.207.152.121/smartapp/public/uploads/public_feed/42/1667882730_631495.mp4' };
    //console.log('item.image', item.image)
    //const video = { uri: item.image };
    const video = Platform.OS === 'ios'? { uri: item.image } : { uri: convertToProxyURL(item.image) };
    // We will use this hook to get video current time and change it throw the player bar.
    const videoPlayer = useRef(null);
    /**
     * The following useState hooks are created to control the vide duration, if the video
     * is paused or not, the current time video, if the player is PLAYING/PAUSED/ENDED and if the video
     * is loading.
     */
    const [duration, setDuration] = useState(0);
    const [paused, setPaused] = useState(false);

    const [currentTime, setCurrentTime] = useState(0);
    const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);
    const [isLoading, setIsLoading] = useState(true);
    const [IsMute, setIsMute] = useState(true);
    const [combineStyles, setCombineStyles] = useState({});

    const [isViewed, setViewed] = useState(false);
  

    const SocialPostsRef = useRef();
    useEffect(() => {
      const subscription = AppState.addEventListener('change', nextAppState => {
      
        if (nextAppState === 'active') {
            SocialPostsRef.current = true;
            console.log('SocialPostsRef--3--',SocialPostsRef);
          }
          else if (nextAppState === 'inactive') {
            console.log('the app is inactive closed for post screen');
            SocialPostsRef.current = false;
            console.log('SocialPostsRef---mute false----',SocialPostsRef);
          }
      else if (nextAppState === 'background') {
          console.log('the app is closed for post screen');
          SocialPostsRef.current = false;
          console.log('SocialPostsRef---mute false----',SocialPostsRef);
        }
 
       
        console.log('AppState', nextAppState);
      });
  
      return () => {
        subscription.remove();
      };
    }, []);
    // This function is triggered when the user released the player slider.
    const onSeek = (seek) => {
        videoPlayer?.current.seek(seek);
    };

    // This function is triggered when the user interact with the player slider.
    const onSeeking = (currentVideoTime) => setCurrentTime(currentVideoTime);

    // This function is triggered when the play/pause button is pressed.
    const onPaused = (newState) => {
        setPaused(!paused);
        setPlayerState(newState);
    };

    useEffect(() => {
        // Orientation.addOrientationListener(orientationChange)
        // return () => {
        //     Orientation.removeOrientationListener(orientationChange)
        // }
        if (Platform.OS === 'android') {
            Orientation.lockToPortrait();
        }
        return () => {
            Orientation.lockToPortrait()
        }
    }, [])

    const orientationChange = (orientation) => {
        console.log('orientationChange', orientation)
        if (orientation == 'LANDSCAPE-RIGHT' || orientation == 'LANDSCAPE-LEFT') {

        } else if (orientation == 'PORTRAIT') {

        }
    }

    /**
     * This function is triggered when the replay button is pressed.
     * There is a minmial bug on Android devices that does not allow the player to replay the video if changing the state to PLAYING, so we have to use the 'Platform' to fix that.
     */
    const onReplay = () => {
        videoPlayer?.current.seek(0);
        setCurrentTime(0);
        if (Platform.OS === 'android') {
            setPlayerState(PLAYER_STATES.PAUSED);
            setPaused(true);
        } else {
            setPlayerState(PLAYER_STATES.PLAYING);
            setPaused(false);
        }
    };

    const onError = error => {
        console.log('error', error);
      };

    // This function is triggered while the video is playing.
    const onProgress = (data) => {
        if (!isLoading) {
            setCurrentTime(data.currentTime);
        }
        if(data.currentTime > 3 && !isViewed){
            setViewed(true)
            console.log('data.currentTime', data.currentTime)
        }
    };

    /**
     * This function and the next one allow us doing something while the video is loading.
     * For example we could set a preview image while this is happening.
     */
    const onLoad = (data) => {
        setDuration(Math.round(data.duration));
        setIsLoading(false);
        console.log('data>>>>>>>>>>',
            PixelRatio.getPixelSizeForLayoutSize(screenHeight) / data.naturalSize.height,
            PixelRatio.getPixelSizeForLayoutSize(screenWidth) / data.naturalSize.width
        )
        const combineStyles = StyleSheet.flatten([
            styles.backgroundVideo,
            {
                transform: [
                    {
                        scaleY:
                            PixelRatio.getPixelSizeForLayoutSize(screenHeight) / data.naturalSize.height
                    },
                    {
                        scaleX:
                            PixelRatio.getPixelSizeForLayoutSize(screenWidth) / data.naturalSize.width
                    }
                ],
            }
        ]);
        setCombineStyles(combineStyles)
    };

    const onLoadStart = () => setIsLoading(true);

    // This function is triggered when the player reaches the end of the media.
    const onEnd = () => {
        setPlayerState(PLAYER_STATES.ENDED);
        setCurrentTime(duration);
    };

    // useState hook to check if the video player is on fullscreen mode



    // useEffect(() => {
    //   return () => {

    //   }
    // }, [isFullScreen])


    // This function is triggered when the user press on the fullscreen button or to come back from the fullscreen mode.
    const onFullScreen = () => {
        Orientation.unlockAllOrientations();

        const Callback = (orientation) => {
            console.log('Callbackorientation12', orientation)
            if (orientation == 'LANDSCAPE') {
                Orientation.lockToPortrait();
            } else {
                Orientation.lockToLandscape();
            }
        }


        if (!isFullScreen) {
            console.log('onFullScreen lockToLandscape',)
            Orientation.lockToLandscape();
            Orientation.getOrientation(Callback)
        } else {
            if (Platform.OS === 'ios') {
                console.log('onFullScreen lockToPortrait',)
                // const Callback = (orientation)=> {
                //     console.log('Callbackorientation', orientation)
                //     if (orientation == 'LANDSCAPE') {
                //         Orientation.lockToPortrait();
                //     }
                // }
                // Orientation.getOrientation(Callback)

            }
            Orientation.lockToPortrait();
        }
        setIsFullScreen(!isFullScreen);
    };

    return (

        <View style={styles.container}   >
            <View style={{ marginHorizontal: isFullScreen ? 0 : 0, alignItems: 'center' }}>
                <Video
                    fullscreen={isFullScreen}
                    onEnd={onEnd}
                    onLoad={onLoad}
                    onError={onError}
                    onLoadStart={onLoadStart}
                    posterResizeMode={'cover'}
                    onProgress={onProgress}
                    paused={paused}
                    repeat
                    ref={(ref) => (videoPlayer.current = ref)}
                    resizeMode={Platform.OS === 'ios'? 'cover' : 'cover'}
                    source={video}
                    style={Platform.OS === 'ios'? styles.backgroundVideo: isFullScreen ? styles.backgroundVideoHr : styles.backgroundVideo}
                    //style={styles.backgroundVideo}
                    fullscreenAutorotate={false}
                    fullscreenOrientation={'portrait'}
                    pictureInPicture={true}
                    playInBackground={true}
                //controls={true}
                />
                <MediaControls
                    isFullScreen={isFullScreen}
                    duration={duration}
                    isLoading={isLoading}
                    progress={currentTime}
                    onFullScreen={onFullScreen}
                    onPaused={onPaused || SocialPostsRef?.current}
                    onReplay={onReplay}
                    onSeek={onSeek}
                    onSeeking={onSeeking}
                    mainColor={'red'}
                    playerState={playerState}
                    style={!isFullScreen ? styles.backgroundVideo : styles.backgroundVideoFullScreen}
                    //  style={styles.backgroundVideo}
                    sliderStyle={!isFullScreen ? { containerStyle: styles.mediaControls, thumbStyle: {}, trackStyle: {} } : { containerStyle: styles.mediaControls, thumbStyle: {}, trackStyle: {} }}
                />


            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        elevation: 1,
    },
    backgroundVideo: {
       // height: '98%',
        //    height: '90%',
         width: '100%',
        aspectRatio: 1,
        //aspectRatio: width/height,
        // aspectRatio: 16 / 9,
    },
    backgroundVideoHr: {
        height: '98%',
        // width: '100%',
        //  aspectRatio: 1,
        /// aspectRatio: width/height,
        width: "100%"
    },
    mediaControls: {
        width: '98%',
        height: '100%',
        // aspectRatio: 16 / 9,
        // aspectRatio: width/height,
        direction:'ltr',
        flex: 1,
        alignSelf: Platform.OS === 'android' ? screenHeight < 800 ? 'center' : 'flex-start' : 'center',
    },
    backgroundVideoFullScreen: {
        height: screenHeight - 300,
        width: screenWidth - 300,
    },
    // backgroundVideoFullScreen:{
    //     backgroundColor: 'black',
    //     ...StyleSheet.backgroundVideo,
    //     elevation: 1,

    // },

});

export default VideoPlayer;