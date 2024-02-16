import React, { useEffect, useLayoutEffect, useState } from "react";
import {
	View, TextInput, Text, FlatList, Pressable, Image, Dimensions, Keyboard, ActivityIndicator,
	Platform, SafeAreaView, I18nManager, Alert, StatusBar
} from "react-native";
import { styles } from "./utils/chatStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import MessageComponent from "./components/MessageComponent";
import { useRef } from "react";
import socket from "./utils/socket";
import { Button } from "react-native";
import { TouchableOpacity } from "react-native";
import { arrow_back, attach, close, iconArrow, iconCamera, iconDefaultUser, iconDots, iconMic, iconPlus, send_message } from "../../constants/images";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { chatSingleMessageApi, updateUnreadStatus, uploadMedia } from "../../redux/actions/chatActions";
import moment from "moment";
import { COLORS } from "../../theme";
import { useTranslation } from "react-i18next";
import getMessageHeightOffset from "./utils/getMessageBoxHeightOffset";
import useKeyboardOffsetHeight from "./utils/useKeyboardOffsetHeight";
import { ScrollView } from "react-native";
import KeyboardAvoidingView from "../../utils/KeyboardAvoidingViewModals";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { ShowErrorToast, fileNameFromUrl } from "../../utils/common";
import Toast from 'react-native-simple-toast';
import { createFileUriFromContentUri } from "../../constants/constant";

import ChooseFileComponent from "../../components/ChooseFileComponent";
import RNFS from 'react-native-fs';

import uuid from 'react-native-uuid';


//import * as AudioManager from "../../components/AudioManager"

const windowHeight = Dimensions.get("window").height;


const LIMIT = 20

import ChooseCameraComponent from "../../components/ChooseComponent";
import AudioRecorderScreen from "../../components/AudioRecorderScreen";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import FastImage from "react-native-fast-image";
import ContextMenu from "react-native-context-menu-view";
import { UseChatCount } from "../../context/chatCountProvider";
import { RFValue } from "react-native-responsive-fontsize";
import { tr } from "rn-emoji-keyboard/lib/commonjs";
import CustomChatHeader from "../../components/CustomChatHeader";
import PortalView from "../../components/ReactionView/PortalView";
import SoundPlayer from "react-native-sound-player";

const audioRecorderPlayer = new AudioRecorderPlayer();
const Messaging = ({ route }) => {
	const { t, i18n } = useTranslation();
	const { name, id, image, item } = route.params;
	const dispatch = useDispatch()
	// console.log('route.params', route.params)
	const userProfile = useSelector(({ user }) => user.profile)

	const [offset, seOffset] = useState(0)
	const [isLoading, setLoading] = useState(false);

	const navigation = useNavigation()

	var flatList = useRef()
	const resetData = useRef(false);
	const shouldScrollDown = useRef(false);
	const currentScreen = useRef(false);

	const authuser = useSelector(({ auth }) => auth.data);

	const { chatMessageCount, setChatMessageCount } = UseChatCount()


	const [chatMessages, setChatMessages] = useState([]);
	const [message, setMessage] = useState("");
	const [recordState, setRecordState] = useState({});
	const [modalVisible, setModalVisible] = useState(false);
	const [modalCameraOptionVisible, setModalCameraOptionVisible] = useState(false);
	const [modalRecordVisible, setModalRecordVisible] = useState(false);
	const [MsgValue, setMsgValue] = useState('');
	const [isRecodeingOn, setisRecodeingOn] = useState(false);

	const receiverID = id === authuser.user_id ? id : id //item.senderId
	console.log('chatMessages',chatMessages[0]);
	console.log('authuser.user_id', authuser.user_id)
	const DownloadDirectoryPath = RNFS.DownloadDirectoryPath;
	const path = `${DownloadDirectoryPath}/hello.mp3`;
	const recordCallBack = async (Object) => {
		if (Object.recordSecs === 0) {
			setLoading(false)
			if (Object.result) {
				console.log('recordCallBack Object-------------', Object)
				var img = '' + (path.replace('file:///', '')); // Must do that for RNFS

				messagepostmediaFile(Object?.result,Object?.duration)
			}
		}
		setRecordState(Object)
	}



	useEffect(() => {
		currentScreen.current = true;
		return () => {
			currentScreen.current = false;
			setChatMessages([]);
			const count = item ? authuser.user_id === item.receiverId ? item.receiver_unread_msg_count : item && item.sender_unread_msg_count : 0
			console.log('chatMessageCount - count', chatMessageCount - count)
			if (chatMessageCount > 0)
				setChatMessageCount(chatMessageCount - count)
		}
	}, [])



	useEffect(() => {
		const focusHandler = navigation.addListener('focus', () => {
			resetData.current = true;
			shouldScrollDown.current = true;
			fetchMessages()
			//updateStatus()
			updateStatusOnReceive()
		});
		return focusHandler;
	}, [navigation]);


	const fetchMessages = () => {
		let pageToReq = offset;
		if (resetData.current) {
			pageToReq = 0;
		}
		const param = {
			user_id: receiverID,
			start_from: pageToReq,
			limit: LIMIT
		}
		console.log('param', param)
		setLoading(true)
		dispatch(chatSingleMessageApi(param, authuser.token)).then((res) => {
			const resData = res.data //.reverse()
			if (resetData.current) {
				setChatMessages(resData)
				seOffset(LIMIT)
				resetData.current = false;
			} else {
				if (res.data && res.data.length > 0) {
					const newObj = chatMessages.concat(resData) // resData.concat(chatMessages)
					setChatMessages(newObj)
					seOffset(offset + LIMIT)
				}

			}
			//shouldScrollDown.current = false;
			setLoading(false)
		}).catch((error) => {
			//console.log('chatSingleMessageApi', error)
			setLoading(false)
		})
	}
	const handleNewMessage = (urlPath,duration = '00:00',fileSize = '00') => {
		console.log('duration  handle message ----------------->',duration);
		const uuidv4 = uuid.v4();
		console.log('uuidv4', uuidv4)
		const userName = userProfile ? authuser.user_status === 0 ? userProfile.first_name + " " + userProfile.last_name : userProfile.business_name :
			authuser.user_status === 0 ? authuser.first_name + " " + authuser.last_name : authuser.business_name
		if (authuser && (message !== "" || urlPath)) {
			console.log('handleNewMessage urlPath', chatMessages.length)
			let sample_data_payload = {
				chat_unique_id: uuidv4,
				senderId: authuser.user_id,
				senderName: userName,
				receiverId: receiverID,
				message: message,
				messageType: urlPath ? "image" : "text", //or text
				url: urlPath ? urlPath : "",
				thumbnail: urlPath ? urlPath : "",
				updated_at: moment().format("yyyy-MM-DD HH:mm:ss"),
				//	isFirstMessage: authuser.user_status === 1 ? false : chatMessages && chatMessages.length > 0 ? false : true,
				isFirstMessage: chatMessages && chatMessages.length > 0 ? false : true,
				duration:duration,
				fileSize:fileSize
			}
			console.log('sendMessage ------ >', sample_data_payload)
			socket.emit("sendMessage", sample_data_payload);
			//	setChatMessages(prevState => [...prevState, sample_data_payload]);
			const newObj = [sample_data_payload].concat(chatMessages) // chatMessages.concat([sample_data_payload])  
			setChatMessages(newObj)
			setMessage("")

			shouldScrollDown.current = false;
		} else {
			console.log('sendMessage blank',)
		}
	};

	const blockUserPopup = (index) => {

		const blockMessage = "Blocked user cannot send you messages. This user will not be notified."
		const OKMessage = index === 0 ? t("common:block") : t("common:report")

		console.log('blockUserPopup index', index)
		Alert.alert(
			name,
			blockMessage,
			[
				{
					text: (t("common:cancel")),
					onPress: () => console.log("Cancel Pressed"),
				},
				{
					text: (OKMessage), onPress: () => {
						setTimeout(() => {
							const blockUserObj = {
								senderId: authuser.user_id,
								receiverId: receiverID,
								block_status: 1
							}
							console.log('blockUser', blockUserObj)
							socket.emit("blockUser", blockUserObj);
							//blockMessageListener(blockUserObj)
							navigation.goBack()
						}, 150);
					}
				}
			]
		);
	}

	const MyStatusBar = ({ backgroundColor, ...props }) => (
		<View style={[styles.statusBar, { backgroundColor }]}>
			<SafeAreaView>
				<StatusBar translucent backgroundColor={backgroundColor} {...props} />
			</SafeAreaView>
		</View>
	);
  
	const getDuration = async (item) => {
		SoundPlayer.loadUrl(item)
		const info = await SoundPlayer.getInfo()
		return info?.duration
	}


	useEffect(() => {
		//navigation.setOptions({ title: name, });
		// navigation.setOptions({
		// 	title: "",
		// 	headerLeft: () => (
		// 		<View style={{ display: 'flex', flexDirection: "row", alignItems: "center" }}>
		// 			<TouchableOpacity
		// 				onPress={() => navigation.goBack() //navigate('Home')
		// 				}
		// 			>
		// 				<Image
		// 					source={arrow_back}
		// 					style={[styles.image_small, {
		// 						width: wp(6),
		// 						height: wp(6),
		// 						tintColor: COLORS.white,
		// 					}]}
		// 				/>
		// 			</TouchableOpacity>

		// 			<TouchableOpacity>
		// 				{
		// 					image ? <FastImage
		// 						style={[styles.image_small, {
		// 							width: wp(7),
		// 							height: wp(7),
		// 							borderRadius: wp(9) / 2,
		// 							marginLeft: wp(2),
		// 							tintColor: COLORS.white,
		// 						}]}
		// 						source={{
		// 							uri: image ? image : "",
		// 							priority: FastImage.priority.normal,
		// 						}}
		// 						resizeMode={FastImage.resizeMode.cover}
		// 					/> : <FastImage
		// 						style={[styles.image_small, {
		// 							width: wp(7),
		// 							height: wp(7),
		// 							borderRadius: wp(5) / 2,
		// 							marginLeft: wp(2),
		// 							tintColor: COLORS.white,
		// 						}]}
		// 						source={iconDefaultUser}
		// 						resizeMode={FastImage.resizeMode.cover}
		// 					/>
		// 				}



		// 			</TouchableOpacity>
		// 			<Text style={{ color: 'white' }}>{name}</Text>
		// 		</View>
		// 	),
		// 	// headerRight: () => (
		// 	// 	<TouchableOpacity   >
		// 	// 		<ContextMenu
		// 	// 			actions={[{ title: "Block" },]} // { title: t("common:report") }
		// 	// 			dropdownMenuMode={true}
		// 	// 			onPress={(e) => {
		// 	// 				blockUserPopup(e.nativeEvent.index)
		// 	// 			}}
		// 	// 		>
		// 	// 			<FastImage
		// 	// 				style={[styles.image_small, {
		// 	// 					width: wp(7),
		// 	// 					height: wp(7),
		// 	// 					borderRadius: wp(5) / 2,
		// 	// 					marginLeft: wp(2),
		// 	// 				}]}
		// 	// 				source={iconDots}
		// 	// 				resizeMode={FastImage.resizeMode.cover}
		// 	// 			/>
		// 	// 		</ContextMenu>

		// 	// 	</TouchableOpacity>
		// 	// ),
		// });

	}, []);

	useEffect(() => {
		//console.log('onsocket')
		socket.on("receive_message", messageListener);
		socket.on("delete_message", deleteMessageListener);

		return () => {
			socket.off("receive_message", messageListener);
			socket.off("delete_message", deleteMessageListener);
		};
	}, [socket]);

	const messageListener = (roomChats) => {
		shouldScrollDown.current = true;
		console.log('receive_message roomChats >>>>', roomChats)
		//	setChatMessages([...chatMessages, roomChats])
		// if (roomChats.receiverId === receiverID && roomChats.senderId === authuser.user_id ||
		// 	roomChats.receiverId === authuser.user_id && roomChats.senderId === receiverID) {
		// 	console.log('receiverId senderId', authuser.user_id,
		// 		receiverID,)
		// 	setChatMessages(prevState => [...prevState, roomChats]);
		// }
		if (roomChats.receiverId === authuser.user_id && roomChats.senderId === receiverID) {
			console.log('receiverId senderId', authuser.user_id,
				receiverID,)
			setChatMessages(prevState => [roomChats, ...prevState]);
			if (currentScreen.current)
				updateStatusOnReceive(roomChats)
		}

		//setChatMessages(roomChats)
	};

	const deleteMessageListener = (message) => {
		console.log('delete_message', message)
		const messageIdToDelete = message.chat_unique_id
		setChatMessages((prevMessages) => {
			console.log(' before prevMessages.length', prevMessages.length)
			const newMessages = prevMessages.filter(message => {
				return (message.id !== messageIdToDelete &&
					message.chat_unique_id !== messageIdToDelete)
			})
			console.log('newMessages.length', newMessages.length)
			return newMessages;
		});
	}

	const updateStatus = () => {
		const param = {
			senderId: item ? item.senderId : authuser.user_id,
			receiverId: item ? item.receiverId : receiverID,
		}
		dispatch(updateUnreadStatus(param, authuser.token)).then((res) => {
		}).catch((error) => {
		})
	}

	const updateStatusOnReceive = (roomChats) => {
		const param = {
			// senderId: item ? item.senderId : authuser.user_id,
			// receiverId: roomChats.receiverId,
			senderId: receiverID,
			receiverId: authuser.user_id,
		}
		console.log('updateStatus param', param)

		const count = item ? roomChats && authuser.user_id === roomChats.receiverId ? item && item.receiver_unread_msg_count : item && item.sender_unread_msg_count : 1
		//console.log('setChatMessageCount count >>>', count)
		const didcount = chatMessageCount - count
		//	console.log('chatMessageCount - count', didcount, count)
		setChatMessageCount(didcount !== NaN ? didcount : chatMessageCount)
		dispatch(updateUnreadStatus(param, authuser.token)).then((res) => {
			//console.log('updateUnreadStatus res', res)
		}).catch((error) => {
			//console.log('updateUnreadStatus', error)
		})
	}


	// useEffect(() => {
	// 	//console.log('useEffect', chatMessages.length)
	// }, [chatMessages]);

	// useEffect(() => {
	// 	messagesColumnRef.current.scrollTop =
	// 	  messagesColumnRef.current.scrollHeight;
	//   }, [messagesRecieved]);

	// useEffect(() => {
	// 	flatList.scrollTop =
	// 		flatList.scrollHeight;
	// }, [chatMessages]);


	const [scrollPosition, setScrollPosition] = React.useState(0)
	const handleScroll = (event) => {
		let yOffset = event.nativeEvent.contentOffset.y / 1;
		setScrollPosition(yOffset)
	}

	const isCloseToTop = ({ layoutMeasurement, contentOffset, contentSize }) => {
		const paddingToTop = 20;
		console.log('contentOffset.y', contentOffset.y)
		console.log('contentSize.height - layoutMeasurement.height - paddingToTop', contentSize.height - layoutMeasurement.height - paddingToTop)
		return contentSize.height - layoutMeasurement.height - paddingToTop <= contentOffset.y;
	}

	const onContentOffsetChanged = (distanceFromTop) => {
		if (distanceFromTop >= windowHeight - 200) {
			setScrollPosition(distanceFromTop)
			fetchMessages();
		}
	}
	const keyBoardOffsetHeight = useKeyboardOffsetHeight();

	// useEffect(() => {
	// 	console.log('flatList.height',)
	// 	//onContentOffsetChanged(336)
	//   return () => {
	//   }
	// }, [keyBoardOffsetHeight])

	const messagepostmediaFile = async (image,duration) => {
		const params = {
			receiverId: receiverID,
			image: image
		}
		const fileName = fileNameFromUrl(image)
		console.log(fileName, " >>>> " + "fileName")
		const data = new FormData();
		Object.keys(params).forEach(key => {
			if (key === 'image') {
				if (image) {
					data.append('media', {
						name: fileName,
						type: Platform.OS == 'ios' ? 'audio/m4a' : "audio/aac",
						uri: Platform.OS === 'ios' ? image.replace('file://', '') : image.replace('', ''),
					});
				} else {
					data.append(key, params[key]);
				}
			} else {
				data.append(key, params[key]);
			}
		});
		setLoading(true)
		console.log('data', data)
		dispatch(uploadMedia(data, authuser.token))
			.then(async(res) => {
				console.log('uploadMedia res', res.data)
				
				setLoading(false)
				console.log('duration=00-00-----------',duration);
				if (res.status === 200) {
					const urlPath = res?.data?.url
					const duration = await getDuration(urlPath)
					duration && handleNewMessage(urlPath, duration, 0)
				}
				Toast.show(res && res.message, Toast.SHORT);
			}).catch((error) => {
				console.log('error', error)
				setLoading(false)
				ShowErrorToast(error)
			})
	}



	const onCallback = (urlPath,duration,fileSize) => {
		console.log('duration callback-----',duration);
		handleNewMessage(urlPath,duration,fileSize)
	}

	const renderScrollBottomComponent = () => {
		//const { scrollToBottomComponent } = this.props

		//if (scrollToBottomComponent) {
		// return <MessageComponent
		// 	item={chatMessages[0]}
		// 	index={0}
		// 	user={authuser.user_id}
		// 	receiverID={receiverID}
		// 	deleteMessageListener={deleteMessageListener}
		// 	audioRecorderPlayer={audioRecorderPlayer} />
		//}

		//return <Text>V</Text>
	}

	const renderScrollToBottomWrapper = () => {
		const propsStyle = styles.scrollToBottomStyle || {}

		return (
			<View style={[styles.scrollToBottomStyle, propsStyle]}>
				<TouchableOpacity
					onPress={() => scrollToBottom()}
					hitSlop={{ top: 5, left: 5, right: 5, bottom: 5 }}
				>
					{renderScrollBottomComponent()}
				</TouchableOpacity>
			</View>
		)
	}

	const [ChatParamsState, setChatParamsState] = useState({
		scrollToBottomOffset: 0,
		inverted: false,
		showScrollBottom: false,
		hasScrolled: false,
	})

	const scrollTo = (options) => {
		if (flatList && options) {
			flatList.scrollToOffset(options)
		}
	}

	const scrollToBottom = (animated = true) => {
		const { inverted } = ChatParamsState
		if (inverted) {
			scrollTo({ offset: 0, animated })
		} else if (flatList) {
			flatList.scrollToEnd({ animated })
		}
	}

	const handleOnScroll = (event) => {
		const {
			nativeEvent: {
				contentOffset: { y: contentOffsetY },
				contentSize: { height: contentSizeHeight },
				layoutMeasurement: { height: layoutMeasurementHeight },
			},
		} = event

		const { scrollToBottomOffset, inverted } = ChatParamsState
		if (inverted) {
			if (contentOffsetY > scrollToBottomOffset) {
				//setScrollPosition(distanceFromTop)
				fetchMessages();
				setChatParamsState(...ChatParamsState, { showScrollBottom: true, hasScrolled: true })
			} else {
				setChatParamsState(...ChatParamsState, { showScrollBottom: false, hasScrolled: true })
			}

		} else {
			if (
				contentOffsetY < scrollToBottomOffset &&
				contentSizeHeight - layoutMeasurementHeight > scrollToBottomOffset
			) {
				setChatParamsState(...ChatParamsState, { showScrollBottom: true, hasScrolled: true })
			} else {
				//	setChatParamsState(...ChatParamsState, { showScrollBottom: false, hasScrolled: true })
			}
		}
	}

	const [showIcon, setShowIcon] = React.useState(false)
	const onScrollBottom = (event) => {
		setSelectedMessage(null)
		const {
			nativeEvent: {
				contentOffset: { y: contentOffsetY },
				contentSize: { height: contentSizeHeight },
				layoutMeasurement: { height: layoutMeasurementHeight },
			},
		} = event
		if (contentOffsetY >= 100) {
			setShowIcon(true)
		} else {
			setShowIcon(false)
		}
	}

	const goToSocialProfile = () =>{
		navigation.navigate('social-profile', {
			user_id: receiverID,
			item,
		});
	}
	const [messageCordinates, setMessageCordinates] = useState({x: 0, y: 0});
	const [selectedMessage, setSelectedMessage] = useState(null);
	const [isSender, setSender] = useState(false);
	const onLongPress = (e, message) => {
	  const {pageY, locationY} = e.nativeEvent;
	  let y = pageY - locationY;
  
	  setMessageCordinates({
		x: 0,
		y,
	  });
	  setSelectedMessage(message);
	};
	console.log('showIcon', showIcon)
	let isFirstTime = false
	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 25}
			style={[styles.messagingscreen,]}>
			{/* <MyStatusBar backgroundColor={COLORS.primary} barStyle="light-content" /> */}

			<StatusBar backgroundColor={COLORS.primary} />
			<View style={{ backgroundColor: COLORS.primary, paddingBottom: Platform.OS === 'ios' ? 10 : 0 }}>
				<CustomChatHeader profiePhoto={image} title={name} goToSocialProfile={goToSocialProfile} />
		
			</View>
			{
				isLoading ? <View style={[styles.loading, { bottom: 0, position: 'relative' }]}>
					<ActivityIndicator size="large" color={COLORS.primary} />
				</View> : null
			}

			<Pressable
			onPress={()=>{
				setSelectedMessage(null)
			}}
				style={[
					styles.messagingscreen,
					{ paddingVertical: 5, paddingHorizontal: 10, flex: 1 },
					{
						height:
							windowHeight * 0.8 -
							keyBoardOffsetHeight * 0.95 -
							getMessageHeightOffset(0, windowHeight),
					}
				]}
			>
				
				{chatMessages[0] ? (
					<>
					<FlatList
						//	inverted
						ref={ref => flatList = ref}
						data={[...chatMessages]}
					
						renderItem={({ item, index }) => (
							<MessageComponent
								item={item}
								index={index}
								user={authuser.user_id}
								receiverID={receiverID}
								deleteMessageListener={deleteMessageListener}
								audioRecorderPlayer={audioRecorderPlayer} 
								onLongPress={onLongPress}
								 onPressIn={setSender}
								 setSelectedMessage={setSelectedMessage}
								 MsgValue={MsgValue}
								 isRecodeingOn={isRecodeingOn}
								 setisRecodeingOn={setisRecodeingOn}
								/>
						)}
						// onContentSizeChange={() => {
						// 	if (shouldScrollDown.current || keyBoardOffsetHeight) {
						// 		flatList.scrollToEnd({ animated: true })
						// 		flatList.scrollToIndex({
						// 			index:   0,
						// 			animated: true,
						// 			viewPosition:  0,
						// 		})
						// 		flatList.scrollToOffset({ scrollPosition, animated: false })

						// 		if (isFirstTime) {
						// 			isFirstTime = false
						// 			shouldScrollDown.current = false;
						// 		} else {
						// 			isFirstTime = true
						// 		}
						// 		if (chatMessages.length > LIMIT) {

						// 			shouldScrollDown.current = false;
						// 		}
						// 	}
						// }}
						keyExtractor={(item, index) => index} //
						scrollEventThrottle={50}
						onEndReachedThreshold={0.7}
						//onEndReached={fetchMessages}
						onEndReached={() => {
							if (chatMessages.length >= 20) {
								fetchMessages();    // LOAD MORE DATA
							}
						}
						}
						inverted={true}
						//removeClippedSubviews={false} 
						onScroll={onScrollBottom}
						//onScroll={handleOnScroll}
						// onScroll={
						// 	(event) => {
						// 		// if(isCloseToTop(event.nativeEvent)){
						// 		// 	fetchMessages()
						// 		// }
						// 		onContentOffsetChanged(event.nativeEvent.contentOffset.y)
						// 	}
						// }
						style={{
							//	marginBottom: keyBoardOffsetHeight
						}}
					//contentContainerStyle={{ flexGrow: 1 }}

					/>
							{/* <PortalView
							selectedMessage={selectedMessage}
							messageCordinates={messageCordinates}
							setSelectedMessage={setSelectedMessage}
							isSender={isSender}
						/> */}
					</>
				) : (
					<></>
				)}
			

				{
					showIcon ? <TouchableOpacity onPress={() => {
						flatList.scrollToOffset({ offset: 0, animated: true });
					}}
						style={[styles.messagingbuttonContainer,
						{
							width: wp(9),
							height: wp(9),
							backgroundColor: '#696969',
							borderRadius: 45,
							marginRight: 5,
							bottom: 10,
							right: 10,
							opacity: 0.7,
							position: 'absolute'
						}]} >
						<Image
							source={iconArrow}
							style={[{
								width: wp(6),
								height: wp(6),
								tintColor: COLORS.white
								//backgroundColor:"#000"
							}]}
						/>
					</TouchableOpacity> : null
				}

</Pressable>


			{/* {ChatParamsState.showScrollBottom && ChatParamsState.scrollToBottom
          ? renderScrollToBottomWrapper()
          : null} */}
			<View style={styles.messaginginputContainer}>
				<TouchableOpacity onPress={() => { setModalVisible(true) }}
					style={[styles.messagingbuttonContainer,
					{
						width: wp(10),
						height: wp(10),
						backgroundColor: "#D8D8D8", borderRadius: 45, marginRight: 5
					}]} >
					<Image
						source={iconPlus}
						style={[{
							width: wp(7),
							height: wp(7),
							//backgroundColor:"#000"
						}]}
					/>
				</TouchableOpacity>
				<View style={[styles.messageWrapper, { marginBottom: wp(0) }]}>

					<TextInput
						style={[styles.messaginginput, {
							textAlign: I18nManager.isRTL ? 'right' : 'left',

						}]}
						value={message}
						placeholder={t('common:Typemessage')}
						placeholderTextColor={COLORS.textDark}
						onChangeText={(value) => setMessage(value)}
					/>
				</View>

				{
					message === "" ? <>
						<View style={styles.messagingbuttonContainer} >
							<AudioRecorderScreen recordCallBack={recordCallBack}
								modalRecordVisible={modalRecordVisible}
								setModalRecordVisible={setModalRecordVisible}
								audioRecorderPlayer={audioRecorderPlayer}
								setisRecodeingOn={setisRecodeingOn}
								/>
						</View>
						<TouchableOpacity
							onPress={() => setModalCameraOptionVisible(true)}
							style={[styles.messagingbuttonContainer, { marginLeft: 5 }]}
						>
							<Image
								source={iconCamera}
								style={[styles.image_small, {
									width: wp(7),
									height: wp(7),
									borderRadius: 0,
									tintColor:COLORS.primary
								}]}
							/>
	
						</TouchableOpacity>
					</> : <TouchableOpacity
						style={styles.messagingbuttonContainer}
						onPress={() => handleNewMessage()}
					>

						<Image
							source={send_message}
							style={[styles.image_small, {
								width: wp(9),
								height: wp(9),
							}]}
						/>
					</TouchableOpacity>

				}

				<ChooseFileComponent
					modalVisible={modalVisible}
					setModalVisible={setModalVisible}
					onCallback={onCallback}
					receiverID={receiverID}
					setLoading={setLoading} />

				<ChooseCameraComponent
					modalCameraOptionVisible={modalCameraOptionVisible}
					setModalCameraOptionVisible={setModalCameraOptionVisible}
					onCallback={onCallback}
					receiverID={receiverID}
					setLoading={setLoading} />


			</View>

		</KeyboardAvoidingView>
	);
};

export default Messaging;