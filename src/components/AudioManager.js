import {  Platform } from 'react-native'
import AudioRecorderPlayer, {
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
    AudioEncoderAndroidType,
    AudioSourceAndroidType,
    OutputFormatAndroidType,
    Player
} from 'react-native-audio-recorder-player'

//import RNFetchBlob from 'rn-fetch-blob'
import RNFS from 'react-native-fs';



//let audioRecorderPlayer = undefined
let currentPath = undefined
let currentCallback = () => { }
let currentPosition = 0

const AUDIO_STATUS = {
    play: 'play',
    begin: 'begin',
    pause: 'pause',
    resume: 'resume',
    stop: 'stop',
}

const audioRecorderPlayer = new AudioRecorderPlayer();

console.log('audioRecorderPlayer )))))')

const setupPlayer = async () => {
    // if (audioRecorderPlayer == undefined) {
    //     audioRecorderPlayer = new AudioRecorderPlayer();
    //     audioRecorderPlayer.setSubscriptionDuration(0.1);
    // }
}

//const dirs = RNFetchBlob.fs.dirs;
const CachesDirectoryPath = RNFS.DownloadDirectoryPath;
const path = Platform.select({
    // ios: 'hello.m4a',
    // //android: `${dirs.CacheDir}/hello.mp3`,
    // android: `${CachesDirectoryPath}/hello.mp3`,
    ios: undefined,
    android: undefined,
  });

//  const path  = Platform.OS === 'android' ? 'hello.mp3' : 'hello.mp3'
const onStartRecord = async (callback) => {
    console.log('onStartRecord callback')
     audioRecorderPlayer.setSubscriptionDuration(0.09);
    const audioSet = {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS: AVEncodingOption.aac,
       // OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
      };

      console.log('audioSet', audioSet);

      const uri = await audioRecorderPlayer.startRecorder(
        path,
        audioSet,
      );
       audioRecorderPlayer.addRecordBackListener((e) => {
        console.log('e', e)
        callback({
            isRecording: true,
            recordSecs: e.currentPosition,
            recordTime: audioRecorderPlayer.mmssss(
                Math.floor(e.currentPosition),
            ),
        })
        return;
    });


    console.log(uri);
};

const onStopRecord = async (callback) => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    callback({
        isRecording: false,
        recordSecs: 0,
        result: result,
    })
    
    console.log(result);
};

async function startPlayer(path, callback) {
    //console.log({ currentPath, path })

    if (currentPath === undefined) {
        currentPath = path
        currentCallback = callback
    } else if (currentPath !== path) {
        if (audioRecorderPlayer !== undefined) {
            try {
                await stopPlayer()
            } catch (error) {
                console.log('ERROR STOP PLAYER TOP')
            }
        }
        currentPath = path
        currentCallback = callback
    }

    // if (audioRecorderPlayer === undefined) {
    //     audioRecorderPlayer = new AudioRecorderPlayer()
    // }

    try {
        console.log('startPlayer', currentPath)
        const activePath = await audioRecorderPlayer.startPlayer(currentPath);
        console.log({ activePath })
        currentCallback({
            status: (currentPath === path) && (currentPosition > 0) ? AUDIO_STATUS.resume : AUDIO_STATUS.begin
        })
        audioRecorderPlayer.addPlayBackListener(async (e) => {
            if (e.current_position === e.duratiourin) {
                try {
                    await stopPlayer()
                } catch (error) {
                    console.log('ERROR STOP PLAYER IN LISTENER')
                }
            } else {
                currentPosition = e.current_position
                currentCallback({
                    status: AUDIO_STATUS.play,
                    data: e
                })
            }
            return
        });
    } catch (error) {
        console.log({ 'ERROR PLAY PLAYER': error })
    }
}



async function pausePlayer() {
    try {
        await audioRecorderPlayer.pausePlayer();
        currentCallback({ status: AUDIO_STATUS.pause })
    } catch (error) {
        console.log({ 'ERROR PAUSE PLAYER': error })
    }
}

async function stopPlayer() {
    if (audioRecorderPlayer) {
        const isStop = await audioRecorderPlayer.stopPlayer();
        console.log({ isStop })
        //  audioRecorderPlayer.removePlayBackListener()
        currentPosition = 0
        currentCallback({ status: AUDIO_STATUS.stop })
        audioRecorderPlayer = undefined
    }
}

export {
    audioRecorderPlayer,
    AUDIO_STATUS,
    setupPlayer,
    startPlayer,
    stopPlayer,
    pausePlayer,
    onStartRecord,
    onStopRecord
}