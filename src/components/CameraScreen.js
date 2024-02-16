// import React, { useState, useRef } from 'react';
// import {
//   View,
//   TouchableOpacity,
//   Text,
//   StyleSheet
// } from 'react-native';
// import { Camera, FileSystem, Permissions } from 'react-native-vision-camera';
// import Video from 'react-native-video';

// const CameraScreen = () => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [videoPath, setVideoPath] = useState('');
//   const cameraRef = useRef();

//   const startRecording = async () => {
//     const hasPermission = await requestCameraPermission();
//     if (!hasPermission) return;

//     setIsRecording(true);

//     const videoPath = `${FileSystem.cacheDirectory}/video.mp4`;
//     setVideoPath(videoPath);

//     cameraRef.current.record({
//       quality: '720p',
//       videoBitrate: 2000000,
//       maxDuration: 10, // Set the maximum duration in seconds (optional)
//       maxFileSize: 100 * 1024 * 1024, // Set the maximum file size in bytes (optional)
//       outputPath: videoPath,
//     });
//   };

//   const stopRecording = async () => {
//     setIsRecording(false);
//     await cameraRef.current.stopRecording();
//   };

//   const requestCameraPermission = async () => {
//     const { status } = await Permissions.requestMultiple([
//       Permissions.PERMISSIONS.ANDROID.CAMERA,
//       Permissions.PERMISSIONS.ANDROID.RECORD_AUDIO,
//       Permissions.PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
//     ]);
//     return (
//       status[Permissions.PERMISSIONS.ANDROID.CAMERA] === 'granted' &&
//       status[Permissions.PERMISSIONS.ANDROID.RECORD_AUDIO] === 'granted' &&
//       status[Permissions.PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === 'granted'
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Camera style={styles.camera} ref={cameraRef} />

//       {isRecording ? (
//         <TouchableOpacity style={styles.recordButton} onPress={stopRecording}>
//           <Text style={styles.recordButtonText}>Stop Recording</Text>
//         </TouchableOpacity>
//       ) : (
//         <TouchableOpacity style={styles.recordButton} onPress={startRecording}>
//           <Text style={styles.recordButtonText}>Start Recording</Text>
//         </TouchableOpacity>
//       )}

//       {videoPath !== '' && (
//         <View style={styles.videoPlayer}>
//           <Video source={{ uri: videoPath }} style={styles.videoPlayer} controls />
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   camera: {
//     flex: 1,
//   },
//   recordButton: {
//     position: 'absolute',
//     bottom: 20,
//     left: 20,
//     right: 20,
//     backgroundColor: 'red',
//     padding: 20,
//     alignItems: 'center',
//   },
//   recordButtonText: {
//     fontSize: 18,
//     color: '#fff',
//   },
//   videoPlayer: {
//     flex: 1,
//     marginTop: 20,
//   },
// });

// export default CameraScreen;