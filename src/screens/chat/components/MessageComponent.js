import { Alert, View, Text, TouchableOpacity, PermissionsAndroid, Image, Platform, Dimensions, ActivityIndicator } from "react-native";
import React from "react";
import { styles } from "../utils/chatStyles";
import { useTranslation } from "react-i18next";
import moment from "moment/moment";
import FastImage from "react-native-fast-image";
import { useSelector } from "react-redux";
import { COLORS } from "../../../theme";
import VideoFullScreen from "../../publicFeed/videoFullscreen";
//import { Ionicons } from "@expo/vector-icons";
import Orientation from 'react-native-orientation-locker';
import { useEffect } from "react";
import CustomPDFView from "../../../components/customPDFView";
import { DATE_FORMATE_12_SORT, fileNameFromUrl, formatTime, getFileExtension, isAudio, isDocument, isPDF, isVideo, millisToMinutesAndSeconds } from "../../../utils/common";

import { useState } from "react";
import ProgressBar from 'react-native-progress/Bar';
import FileViewer from 'react-native-file-viewer';
//import OpenFile from 'react-native-doc-viewer';
import RNFS from "react-native-fs";
import SoundPlayer from 'react-native-sound-player'

import { iconDocs, iconPause, iconPlay, pdf } from "../../../constants/images";
import CustomVideoPlayer from "../../../components/customVideoPlayer";
import socket from "../utils/socket";
import ChooseMoreOptionComponent from "../../../components/ChooseMoreOption";

var SavePath = Platform.OS === 'ios' ? RNFS.MainBundlePath : RNFS.DocumentDirectoryPath;
const { height, width } = Dimensions.get('window');
const screenWidth = Dimensions.get('screen').width;
//import RNFetchBlob from 'rn-fetch-blob';


export default function MessageComponent({ item, index, user, receiverID,
	deleteMessageListener, audioRecorderPlayer,onLongPress,onPressIn,MsgValue,isRecodeingOn ,setisRecodeingOn},props) {
	const status = item.senderId !== user;
	const { t, i18n } = useTranslation();
	const [isPlay, setPlay] = React.useState(false);
	const [isPlayerStart, setPlayerStart] = React.useState(false);
	const [isDocumentLoad, setDocumentLoad] = React.useState(false);
	const [isPause, setPause] = React.useState(false);
	const [modalVisible, setModalVisible] = React.useState(false);
	const [modalMoreOptionVisible, setModalMoreOptionVisible] = React.useState(false);
	const [selectedImage, setselectedImage] = React.useState(0);
	const [selectedImageList, setselectedList] = React.useState([]);
	const [copiedText, setCopiedText] = useState('');
	const authuser = useSelector(({ auth }) => auth.data);
	const [audioList, setAudioList] = React.useState([]);
	const [ReactIndex, setReactIndex] = React.useState('');

	const [AudioState, setAudioState] = useState({
		isLoggingIn: false,
		recordSecs: 0,
		recordTime: '00:00:00',
		currentPositionSec: 0,
		currentDurationSec: 0,
		playTime: '00:00:00',
		duration: '00:00:00',
	})
	useEffect(()=>{
		console.log('isRecodeingOn----------',isRecodeingOn);
		isRecodeingOn && onStopPlay()
	},[isRecodeingOn])
	useEffect(() => {
		// if (audioRecorderPlayer == undefined) {
		// 	audioRecorderPlayer = new AudioRecorderPlayer();
		// }
		audioRecorderPlayer.setSubscriptionDuration(0.1); // optional. Default is 0.5
		// AudioManager.setupPlayer()
		Orientation.lockToPortrait();
		return () => {
			onStopPlay()
			// AudioManager.stopPlayer()
			Orientation.lockToPortrait();
		}
	}, [])


	// const downloadFile = async(fileUrl) => {

	// 	// Get today's date to add the time suffix in filename
	// 	let date = new Date();
	// 	// File URL which we want to download
	// 	let FILE_URL = fileUrl;    
	// 	// Function to get extention of the file url
	// 	let file_ext = getFileExtension(FILE_URL);

	// 	file_ext = '.' + file_ext[0];

	// 	// config: To get response by passing the downloading related options
	// 	// fs: Root directory path to download
	// 	const { config, fs } = RNFetchBlob;
	// 	let RootDir = fs.dirs.PictureDir;
	// 	let options = {
	// 	  fileCache: true,
	// 	  addAndroidDownloads: {
	// 		path:
	// 		  RootDir+
	// 		  '/file_' + 
	// 		  Math.floor(date.getTime() + date.getSeconds() / 2) +
	// 		  file_ext,
	// 		description: 'downloading file...',
	// 		notification: true,
	// 		// useDownloadManager works with Android only
	// 		useDownloadManager: true,   
	// 	  },
	// 	};
	//  	config(options)
	// 	  .fetch('GET', FILE_URL)
	// 	  .then(res => {
	// 		// Alert after successful downloading
	// 		console.log('GET res -> ', JSON.stringify(res));
	// 		//return res
	// 		//alert('File Downloaded Successfully.');
	// 		const file = res.data
	// 		console.log('file', file)
	// 		onStartPlay(file)
	// 	  });
	//   };

	const onStartPlay = async (filePath) => {
		console.log('onStartPlay', filePath);
		setPlay(true)
		setPlayerStart(true)
		setisRecodeingOn(false)
		try {

			//	const filePath00 = await downloadFile(filePath)
			//console.log('filePath00', filePath00)
			const msg = await audioRecorderPlayer.startPlayer(filePath);
			//? Default path
			// const msg = await this.audioRecorderPlayer.startPlayer();
			const volume = await audioRecorderPlayer.setVolume(1.0);
			//	console.log(`path: ${msg}`, `volume: ${volume}`);
			audioRecorderPlayer.addPlayBackListener((e) => {
				//console.log('playBackListener', e);
				setPlayerStart(false)
				setAudioState({
					currentPositionSec: e.currentPosition,
					currentDurationSec: e.duration,
					// playTime: audioRecorderPlayer.mmssss(
					// 	Math.floor(e.currentPosition),
					// ),
					playTime: millisToMinutesAndSeconds(e.currentPosition),
					duration: millisToMinutesAndSeconds(e.duration),
				})
				let percent = Math.round(
					(Math.floor(e.currentPosition) / Math.floor(e.duration)) * 100,
				);
				console.log('percent', percent)
				//Math.round(e.currentPosition) === Math.round(e.duration) && 
				if (percent === 100) {
					console.log('e.currentPosition === e.duration', e.currentPosition === e.duration)
					onStopPlay()
				}

			});
		} catch (err) {
			console.log('startPlayer error', err);
		}
	};


	const onStopPlay = async () => {
		//console.log('onStopPlay');
		setPlay(false)
		audioRecorderPlayer.stopPlayer();
		audioRecorderPlayer.removePlayBackListener();
		setAudioState({
			isLoggingIn: false,
			recordSecs: 0,
			recordTime: '00:00:00',
			currentPositionSec: 0,
			currentDurationSec: 0,
			playTime: '00:00:00',
			duration: '00:00:00',
		})
	};

	const [layoutHeight, setLayoutHeight] = useState(0);

	const onLayout = e => {
	  const {height} = e.nativeEvent.layout;
	  setLayoutHeight(height);
	};
	const AudioView = ({ item }) => {
		const fileName = fileNameFromUrl(item.url);
		const fileExt = getFileExtension(item.url);
		// console.log('fileExt', fileExt)

		let playWidth =
			Math.floor((AudioState.currentPositionSec / AudioState.currentDurationSec) * 100);

		if (!playWidth) {
			playWidth = 0;
		}


		//console.log(' progreesssss  ',playWidth,  (AudioState.currentPositionSec / AudioState.currentDurationSec))

		return (
			<TouchableOpacity
				style={
					status
						? [styles.mmessage, { padding: 15, }]
						: [styles.mmessage, { backgroundColor: COLORS.primary, padding: 15, }]
				}
				onLongPress={onDeleteChoose}
				disabled={isPlayerStart}
				onPress={(e) => {
					isPlay ? onStopPlay() : onStartPlay(item.url)
					}}>
				<View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
					<Image
						source={AudioState.currentPositionSec > 0 &&
							AudioState.currentPositionSec !== AudioState.currentDurationSec
							? iconPause : iconPlay} style={[{
								width: 30,
								height: 30,
								//tintColor:COLORS.secondary,
								tintColor: status ? COLORS.primary : COLORS.secondary,
								opacity: isPlayerStart ? .5 : 1
							}]} />
					{
						AudioState.currentPositionSec > 0 && AudioState.currentPositionSec !== AudioState.currentDurationSec ? <Text style={{
							fontSize: 14, color: COLORS.white
						}}>{AudioState.playTime + "/" + AudioState.duration}</Text> : null
					}
				</View>
				<View style={{ height: 5 }} />
				{
					AudioState.currentPositionSec > 0 && AudioState.currentPositionSec !== AudioState.currentDurationSec ? <>
						<ProgressBar style={{bottom:5}}
							progress={(AudioState.currentPositionSec / AudioState.currentDurationSec)}
							// progress={
							// 	millisToMinutesAndSeconds(AudioState.currentPositionSec / AudioState.currentDurationSec)/ 100}
							width={160}
							height={8} />
					</>
						:
						<View style={{ width: 160 }} >
							<Text style={{
								fontSize: 14, color: COLORS.white
							}}>{""}</Text>
							{/* {fileName} */}
						</View>
				}
{
					isPlayerStart ? <View style={[styles.loading, { bottom: 0, }]}>
						<ActivityIndicator size="small" color={COLORS.primary} />
					</View>
						: null
				}
			</TouchableOpacity>)
	}

	const ImageVideoView = ({ item }) => {
		const itemWidth = (width - 60) / 2;
		return (<TouchableOpacity
			onLongPress={onDeleteChoose}
			onPress={() => {
				console.log('item.url', item.url)
				//console.log('feeds[parentIndex].images', feeds[parentIndex].images)
				setModalVisible(true)
				setselectedImage(0)
				setselectedList([{ image: item.url }])
			}}
			style={
				status
					? styles.mmessage
					: [styles.mmessage, { backgroundColor: COLORS.primary }]
			}
		>
			{
				item.messageType && item.messageType === 'image' &&
					isVideo(item.url) ?
					<TouchableOpacity style={{ height: 130 }}>
						<CustomVideoPlayer videoUrl={item.url} selectedImage={0}
							itemList={[{ image: item.url }]} videoWidth={itemWidth}
							onLongPress={onDeleteChoose} showDownload={true} />
					</TouchableOpacity>
					:
					<FastImage
						style={{ width: itemWidth, height: 130, }}
						source={{
							uri: item.url ? item.url : "",
							priority: FastImage.priority.normal,
						}}
						resizeMode={FastImage.resizeMode.cover}
					/>

			}
		</TouchableOpacity>)
	}

	const PdfView = ({ item }) => {
		return (<TouchableOpacity
			style={
				status
					? styles.mmessage
					: [styles.mmessage, { backgroundColor: COLORS.primary }]
			}
		>
			<CustomPDFView docUrl={item.url} docHight={150} onLongPress={onDeleteChoose} showDownload={true} />
		</TouchableOpacity>)
	}

	const DocumentView = ({ item }) => {
		// create a local file path from url
		const localFile = `${SavePath}/${fileNameFromUrl(item.url)}`;
		return (<TouchableOpacity
			onLongPress={onDeleteChoose}
			onPress={() => {
				downloadDoc(item.url)
			}}
			style={
				status
					? styles.mmessage
					: [styles.mmessage, { backgroundColor: COLORS.white, alignItems: 'center' ,padding:18}]
			}
		>
			<Image source={iconDocs} style={[{
				width: 100,
				height: 100,
				alignSelf: 'center', backgroundColor: 'transparent'
			}]} />
			<Text style={{
				fontSize: 12, color: status ? COLORS.white : COLORS.textDark,
				marginTop: 10,
				
			}}>
				{fileNameFromUrl(item.url)}
			</Text>
		</TouchableOpacity>)
	}
	const downloadDoc = async (url) => {
		// create a local file path from url
		const localFile = `${SavePath}/${fileNameFromUrl(url)}`;
		const options = {
			fromUrl: url,
			toFile: localFile,
		};

		console.log('localFile', localFile)
		// last step it will download open it with fileviewer.
		setDocumentLoad(true)
		RNFS.downloadFile(options)
			.promise.then(() => {
				console.log('localFile', localFile)
				setDocumentLoad(false)
				FileViewer.open(localFile, { showOpenWithDialog: true })
			})
			.then(() => {
				setDocumentLoad(false)
				// success
				// Here you can perform any of your completion tasks
			})
			.catch((error) => {
				console.log('catch error', error)
				// error
			});

	};


	const onDeleteChoose = () => {
		setModalMoreOptionVisible(false)
		console.log('onDeleteChoose 123 onLongPress ', item.messageType)
		if (item.messageType === 'image') {
			Alert.alert(
				t("common:delete_chat"),
				t("common:delete_chat_message"),
				[
					{
						text: (t("common:yes")), onPress: () => {
							setTimeout(() => {
								const deleteMessageObj = {
									chat_unique_id: item.chat_unique_id ? item.chat_unique_id : item.id,
									receiverId: receiverID
								}
								console.log('deleteMessage', deleteMessageObj)
								socket.emit("deleteMessage", deleteMessageObj);
								deleteMessageListener(deleteMessageObj)
							}, 150);
						}
					},
					{
						text: (t("common:no")),
						onPress: () => console.log("Cancel Pressed"),
					},
				]
			);
		} else if (item.messageType === 'text') {
			setCopiedText(item.message)
			setModalMoreOptionVisible(true)
		}

	}

	const onDeleteText = () => {
		setModalMoreOptionVisible(false)
		Alert.alert(
			t("common:delete_chat"),
			t("common:delete_chat_message"),
			[
				{
					text: (t("common:yes")), onPress: () => {
						setTimeout(() => {
							const deleteMessageObj = {
								chat_unique_id: item.chat_unique_id ? item.chat_unique_id : item.id,
								receiverId: receiverID
							}
							console.log('deleteMessage', deleteMessageObj)
							socket.emit("deleteMessage", deleteMessageObj);
							deleteMessageListener(deleteMessageObj)
						}, 150);
					}
				},
				{
					text: (t("common:no")),
					onPress: () => console.log("Cancel Pressed"),
				},
			]
		);

	}

	return (
		<TouchableOpacity 
		onLongPress={onDeleteChoose}
				onPress={e=>{
					// onLongPress(e, {...props, layoutHeight})
					//  onPressIn(true)
					//setSelectedMessage(null)
				}}
				onLayout={onLayout}
			key={index}
			>
			<View
				// style={
				// 	status
				// 		? styles.mmessageWrapper
				// 		: [styles.mmessageWrapper, { alignItems: "flex-end" }]
				// }
				style={
					status
						? [styles.mmessageWrapper, { alignItems: i18n.language === 'ar' || i18n.language === 'he' ? "flex-end" : "flex-start" }]
						: [styles.mmessageWrapper, { alignItems: i18n.language === 'ar' || i18n.language === 'he' ? "flex-start" : "flex-end" }]
				}
			>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					{
						item.messageType && item.messageType === 'image' ?
							isAudio(item.url) ?
								AudioView({ item }) :
								isPDF(item.url) ?
									PdfView({ item }) :
									isDocument(item.url) ? DocumentView({ item }) :
										ImageVideoView({ item }) :
							<TouchableOpacity
								onLongPress={() => {
									setCopiedText(item.message)
									setModalMoreOptionVisible(true)
									//onDeleteChoose()
								}
								}
								onPress={() => {
								}}
								style={
									status
										? [styles.mmessage, {
											padding: 10,
											borderRadius: 10,
										}]
										: [styles.mmessage, {
											backgroundColor: COLORS.primary,
											padding: 10,
											borderRadius: 10,
										}]
								}
							>
								<Text selectable={false} style={{
									fontSize: 14, color: COLORS.white
								}}>
									{item.message}</Text>
							</TouchableOpacity>
					}
						{
							 (isVideo(item?.url) || isAudio(item?.url)) ?(item?.duration)  && <Text style={{
								position:"absolute",
								right:10,
								bottom:2,
								color:'#fff'
							}}>{String(formatTime(item?.duration))}</Text>:null
						}
						{
							 (isPDF(item?.url) || isDocument(item?.url)) ?(item?.fileSize)  && <Text style={{
								position:"absolute",
								right:10,
								bottom:2,
								color:'#000',
								fontWeight:'400'
							}}>{String(item?.fileSize)} kb</Text>:null
						}
				</View>
				{/* {MsgValue && ReactIndex == index
				?<View style={{
					position:"absolute",
					zIndex:4,
					bottom:5,
					// top:30,
					// backgroundColor:"#fff",
					borderRadius:36,
					// padding:2,
				}}>
					<Text style={{
						color:"#fff",
						fontSize:17,
						textAlign:"center"
					}}>{MsgValue?MsgValue:''}</Text>
				</View>:null} */}
				<Text style={{ marginLeft: 10, fontSize: 12, color: COLORS.textDark }}>
					{/* {moment(item.updated_at).locale(i18n.language).format("hh:mm A")} */}
					{moment(item.updated_at).locale(i18n.language).format(DATE_FORMATE_12_SORT)}
				</Text>
			</View>

			{
				modalVisible ? <VideoFullScreen
					modalVisible={modalVisible}
					setModalVisible={setModalVisible}
					selectedImage={selectedImage}
					itemList={selectedImageList}
					updatePosition={() => setselectedImage(0)}
					showDownload={true} /> : null
			}


			{

				modalMoreOptionVisible ? <ChooseMoreOptionComponent
					modalMoreOptionVisible={modalMoreOptionVisible}
					setModalMoreOptionVisible={setModalMoreOptionVisible}
					onCallback={onDeleteText}
					receiverID={"receiverID"}
					setLoading={false}
					message={copiedText} /> : null

			}
		</TouchableOpacity>
	);
}

