import React, { useEffect, useState } from 'react'
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { useRef } from 'react';

import TrackPlayer, { Event, State, useProgress, useTrackPlayerEvents } from 'react-native-track-player';
import { COLORS } from '../theme';
//import { Icon } from 'react-native-vector-icons/icon';


const AudioPlayer = ({url}) => {
    const progress = useProgress();
    useEffect(() => {
        return () => {
            reset()
        }
    }, [])

    const reset = async () => {
        await TrackPlayer.reset();
    }

    const [trackTitle, setTrackTitle] = useState();

    useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
        if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
            const track = await TrackPlayer.getTrack(event.nextTrack);
            const { title } = track || {};
            setTrackTitle(title);
        }
    });

    var track1 = {
        url: 'http://example.com/avaritia.mp3', // Load media from the network
        title: 'Avaritia',
        artist: 'deadmau5',
        album: 'while(1<2)',
        genre: 'Progressive House, Electro House',
        date: '2014-05-20T07:00:00+00:00', // RFC 3339
        artwork: 'http://example.com/cover.png', // Load artwork from the network
        duration: 402 // Duration in seconds
    };

    const [isPlayerReady, setIsPlayerReady] = useState(false);

    async function setup() {
        let isSetup = await TrackPlayer.setupPlayer();

        const queue = await TrackPlayer.getQueue();
        if (isSetup && queue.length <= 0) {
            await TrackPlayer.add([
                // {
                //   id: '1',
                //   url: require('./assets/fluidity-100-ig-edit-4558.mp3'),
                //   title: 'Fluidity',
                //   artist: 'tobylane',
                //   duration: 60,
                // },
                // {
                //   id: '2',
                //   url: require('./assets/penguinmusic-modern-chillout-future-calm-12641.mp3'),
                //   title: 'Modern Chillout',
                //   artist: 'penguinmusic',
                //   duration: 66,
                // },
                // {
                //   id: '3',
                //   url: require('./assets/powerful-beat-121791.mp3'),
                //   title: 'Powerful Beat',
                //   artist: 'penguinmusic',
                //   duration: 73,
                // }
              ]);
        }

       // setIsPlayerReady(isSetup);
    }

    const start = async () => {
        // Set up the player
        //let isSetup = await TrackPlayer.setupPlayer();
        // await TrackPlayer.setupPlayer();
        let isSetup = undefined

        console.log('TrackPlayer.isSetup', TrackPlayer.isSetup)
        isSetup = !TrackPlayer.isSetup ? await TrackPlayer.setupPlayer() : false;
    //     // Add a track to the queue
        await TrackPlayer.add({
            url: 'http://example.com/avaritia.mp3', // Load media from the network
            title: 'Avaritia',
            artist: 'deadmau5',
            album: 'while(1<2)',
            genre: 'Progressive House, Electro House',
            date: '2014-05-20T07:00:00+00:00', // RFC 3339
            artwork: 'http://example.com/cover.png', // Load artwork from the network
            duration: 402 // Duration in seconds
        });
    
       console.log('isSetup', isSetup)
       setIsPlayerReady(isSetup);
      //  Start playing it
       await TrackPlayer.play();
    };

    useEffect(() => {
        start();
    }, []);

    if (!isPlayerReady) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#bbb" />
            </SafeAreaView>
        );
    }

    function TrackProgress() {
        const { position, duration } = useProgress(200);

        function format(seconds) {
            let mins = (parseInt(seconds / 60)).toString().padStart(2, '0');
            let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
            return `${mins}:${secs}`;
        }

        return (
            <View>
                <Text style={styles.trackProgress}>
                    {format(position)} / {format(duration)}
                </Text>
            </View>
        );
    }




    async function handleShuffle() {
        let queue = await TrackPlayer.getQueue();
        await TrackPlayer.reset();
        queue.sort(() => Math.random() - 0.5);
        await TrackPlayer.add(queue);
    
      //  loadPlaylist()
      }

    function Controls({ onShuffle }) {
        const playerState = usePlaybackState();

        async function handlePlayPress() {
           // setup();
            if (await TrackPlayer.getState() == State.Playing) {
                TrackPlayer.pause();
            }
            else {
                TrackPlayer.play();
            }
        }

        return (
            <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap', alignItems: 'center'
            }}>
                {/* <Icon.Button
                    name="arrow-left"
                    size={28}
                    backgroundColor="transparent"
                    onPress={() => TrackPlayer.skipToPrevious()} />
                <Icon.Button
                    name={playerState == State.Playing ? 'pause' : 'play'}
                    size={28}
                    backgroundColor="transparent"
                    onPress={handlePlayPress} />
                <Icon.Button
                    name="arrow-right"
                    size={28}
                    backgroundColor="transparent"
                    onPress={() => TrackPlayer.skipToNext()} />
                <Icon.Button
                    name="random"
                    size={28}
                    backgroundColor="transparent"
                    onPress={onShuffle} /> */}
            </View>
        );
    }

    return (
        <View>
            {/* <TrackProgress /> */}
            {/* <Controls onShuffle={handleShuffle} /> */}
        </View>
    )
}

export default AudioPlayer


export const styles = StyleSheet.create({
    loginscreen: {
        flex: 1,
        backgroundColor: "#EEF1FF",
        alignItems: "center",
        justifyContent: "center",
        padding: 12,
        width: "100%",
    },
    loginheading: {
        fontSize: 26,
        marginBottom: 10,
    },
    logininputContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    logininput: {
        borderWidth: 1,
        width: "90%",
        padding: 8,
        borderRadius: 2,
    },
    loginbutton: {
        backgroundColor: "green",
        padding: 12,
        marginVertical: 10,
        width: "60%",
        borderRadius: "50%",
        elevation: 1,
    },
    loginbuttonText: {
        textAlign: "center",
        color: "#fff",
        fontWeight: "600",
    },
    chatscreen: {
        backgroundColor: COLORS.secondary,  // "#F7F7F7",
        flex: 1,
        padding: 0,
        position: "relative",
    },
    chatheading: {
        fontSize: 24,
        fontWeight: "bold",
        color: "green",
    },
    chattopContainer: {
        backgroundColor: "#F7F7F7",
        height: 70,
        width: "100%",
        padding: 20,
        justifyContent: "center",
        marginBottom: 15,
        elevation: 2,
    },
    chatheader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    chatlistContainer: {
        paddingHorizontal: 0,
        paddingVertical: 10
    },
    chatemptyContainer: {
        width: "100%",
        height: "80%",
        alignItems: "center",
        justifyContent: "center",
    },
    chatemptyText: {
        fontWeight: "bold",
        fontSize: 24, paddingBottom: 30
    },
    messagingscreen: {
        flex: 1,
        //flexDirection:"column"
    },
    messaginginputContainer: {
        // minHeight: 100,
        // backgroundColor: "white",
        paddingBottom: 10,
        paddingVertical: 0,
        paddingHorizontal: 10,
        justifyContent: "center",
        flexDirection: "row",
        marginBottom: 15,
    },
    messageWrapper: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 0,
        flex: 1,
        display:'flex',
        flexDirection:'row',
        marginRight: 10,
        borderRadius: 45,
        alignItems:'center',
        justifyContent:'center'
    },
    messaginginput: {
        flex:1,
        marginRight: 5,
        height:40,
        color: COLORS.textDark,
    },
    messagingbuttonContainer: {
        //  width: "10%",
        //  backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
    },
    modalbutton: {
        width: "40%",
        height: 20,
        backgroundColor: COLORS.primary,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
    },
    modalbuttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    modaltext: {
        color: "#fff",
    },
    modalContainer: {
        width: "100%",
        borderTopColor: "#ddd",
        borderTopWidth: 1,
        elevation: 1,
        height: 400,
        backgroundColor: "#fff",
        position: "absolute",
        bottom: 0,
        zIndex: 10,
        paddingVertical: 50,
        paddingHorizontal: 20,
    },
    modalinput: {
        borderWidth: 2,
        padding: 15,
    },
    modalsubheading: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    mmessageWrapper: {
        width: "100%",
        alignItems: "flex-start",
        marginBottom: 10,
    },
    mmessage: {
        maxWidth: "50%",
        backgroundColor: "#f5ccc2",
        padding: 10,
        borderRadius: 10,
        marginBottom: 2,
        color: COLORS.textDark
    },
    mvatar: {
        marginRight: 5,
    },
    cchat: {
        flex: 1,
        display: 'flex',
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: '#9cb2cc',
        // height: 80,
        marginBottom: 10,
        marginHorizontal: Platform. OS === 'ios'? 8: 8
    },
    cavatar: {
        marginRight: 15,
    },
    cusername: {
        fontSize: 18,
        marginBottom: 5,
        fontWeight: "bold",
        alignSelf: 'flex-start',
        alignSelf: 'flex-start',
        color: COLORS.primary,
        //  backgroundColor: "#fff"
    },
    cmessage: {
        fontSize: 14,
        opacity: 1,
    },
    crightContainer: {
        flexDirection: "row",
        flex: 1,
    },
    ctime: {
        opacity: 1,
        color: COLORS.textDark
    },
    image_small: {
        width: 35,
        height: 35,
        //  tintColor: COLORS.text,
        borderRadius: 35 / 2,
        left: 5,
        marginRight: 10,
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