import React, { useState, useEffect } from "react";
import { View, SafeAreaView, FlatList, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { styles } from "./utils/chatStyles";
import ChatComponent from "./components/ChatComponent";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { chatGroupApi, chatGroupPostApi } from "../../redux/actions/chatActions";
import socket from "./utils/socket";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import EmptyListComponent from "../../components/EmptyListComponent";
import moment from "moment";
import { chat, iconBell, iconDots, iconPlus, menu } from "../../constants/images";
import { COLORS } from "../../theme";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { UseChatCount } from "../../context/chatCountProvider";
import ContextMenu from "react-native-context-menu-view";
import FastImage from "react-native-fast-image";
import { useHeaderHeight } from '@react-navigation/elements';
// import { UseNotificationCount } from "../../context/notificationCountProvider";

let shouldSort
const Chat = ({ route, isHomeScreen = false, searchQuery = '', chatMessageCount }) => {
	const { t, i18n } = useTranslation();
	const [visible, setVisible] = useState(false);
	const [rooms, setRooms] = useState([]);
	const [loading, setLoading] = useState(true)

	// const { chatMessageCount, setChatMessageCount } = UseChatCount()
	//const { notificationCount, } = UseNotificationCount()

	const dispatch = useDispatch()
	const resetData = useRef(false);

	const navigation = useNavigation()

	const authuser = useSelector(({ auth }) => auth.data);

	const headerHeight = useHeaderHeight();
	//console.log('headerHeight', headerHeight)

	//console.log('socket', socket)
	// console.log('Chat searchQuery', searchQuery)
	useEffect(() => {
		const focusHandler = navigation.addListener('focus', () => {
			//	console.log('focusHandler', resetData.current)
			resetData.current = true
			setLoading(true)
			fetchGroups()
		});
		return focusHandler;
	}, [navigation]);

	useEffect(() => {
		// fetchGroups()

		setLoading(true)
		let delayDebounceFn = setTimeout(() => {
			if (searchQuery.length >= 0) fetchGroups()
		}, 1000)

		return () => {
			clearTimeout(delayDebounceFn)
		}
	}, [searchQuery, chatMessageCount]);



	// console.log('i18n.language', i18n.language)

	const fetchGroups = () => {

		const params = {
			search: searchQuery
		}

		//console.log('resetData.current', resetData.current)
		//console.log('resetData.current || isHomeScreen', resetData.current || isHomeScreen  )
		if (resetData.current || isHomeScreen) {
			// setLoading(true)
			dispatch(chatGroupPostApi(params, authuser.token)).then((res) => {
				const data = res.data
				//console.log('dispatch chatGroupApi res', data.length)

				/* start count update code */
				let count = 0
				data.forEach(message => {
					if (authuser.user_id === message.receiverId) {
						const msgCount = message.receiverId === authuser.user_id ? message.receiver_unread_msg_count : message.receiver_unread_msg_count
						count += msgCount
						// console.log('authuser.user_id', authuser.user_id)
						// console.log('message.receiverId', message.receiverId)
						// console.log('message.senderId', message.senderId)
						// console.log('message.receiver_unread_msg_count', msgCount)
					}
				});
				//	console.log('count', count)
				//setChatMessageCount(chatMessageCount + count)
				/* end count update code */

				/* start block user */

				// const blockUsers = res.blockedusers
				// console.log('blockUsers', blockUsers)

				// const finalData = data.filter(item =>
				// 	blockUsers.filter(blockItem =>
				// 		(blockItem.block_user_id == item.senderId || blockItem.block_user_id == item.receiverId) &&
				// 		(blockItem.block_by_user_id == item.senderId || blockItem.block_by_user_id == item.receiverId )
				// 	).length == 0
				// );

				// console.log('finalData', finalData.length)
				/* end block user */
				//resetData.current = false;
				let sortedChat = data.sort((a, b) => new Date(...a.updated_at.split('/').reverse()) - new Date(...b.updated_at.split('/').reverse()));
				setLoading(false)
				setRooms(sortedChat.reverse())
			}).catch((error) => {
				setLoading(false)
				//	resetData.current = false;
				console.log('chatGroupPostApi', error)
			})
		} else {
			setLoading(false)
		}
	}

	useEffect(() => {
		shouldSort = false
		socket.on("receive_message", messageListener);
		//.on('block_user', BlockUserListener);
		return () => {
			resetData.current = false;
			socket.off('receive_message', messageListener);
			//socket.off('block_user', BlockUserListener);
			//setChatMessageCount(0)
		}
	}, []);

	const messageListener = (roomChats) => {
		console.log('chat roomChats', roomChats)
		resetData.current = true
		//fetchGroups()
		setRooms((prevMessages) => {
			const newMessages = prevMessages.map((message, index) => {
				if (roomChats.receiverId === message.receiverId && roomChats.senderId === message.senderId ||
					roomChats.receiverId === message.senderId && roomChats.senderId === message.receiverId) {
					shouldSort = true
					console.log('useEffect message', authuser.user_id !== roomChats.senderId, message.receiver_unread_msg_count)
					return {
						...message,
						message: roomChats.message,
						messageType: roomChats.messageType,
						url: roomChats.url,
						updated_at: roomChats.updated_at,
						read_status: 0,
						receiver_unread_msg_count: authuser.user_id !== message.senderId ?
							message.receiver_unread_msg_count + 1 : 0,
						sender_unread_msg_count: authuser.user_id !== message.senderId ?
							0 : message.sender_unread_msg_count + 1,
					}

				}
				console.log('updates message', message.receiver_unread_msg_count)
				return message
			})

			//console.log('newMessages', newMessages)
			let sortedChat = newMessages.sort(function (left, right) {
				return moment.utc(left.updated_at).diff(moment.utc(right.updated_at))
			});
			//console.log('sortedChat[0', sortedChat[0])
			return sortedChat.reverse();
		});
	};

	const BlockUserListener = (message) => {
		console.log('block_user', message)
		// const messageIdToDelete = message.chat_unique_id
		// setChatMessages((prevMessages) => {
		// 	console.log(' before prevMessages.length', prevMessages.length)
		// 	const newMessages = prevMessages.filter(message => {
		// 		return (message.id !== messageIdToDelete &&
		// 			message.chat_unique_id !== messageIdToDelete)
		// 	})
		// 	console.log('newMessages.length', newMessages.length)
		// 	return newMessages;
		// });
		fetchGroups()
	}


	const receiverMessageCountUpdate = (roomChats) => {
		setRooms((prevMessages) => {
			const newMessages = prevMessages.map((message, index) => {
				if (roomChats.receiverId === message.receiverId && roomChats.senderId === message.senderId ||
					roomChats.receiverId === message.senderId && roomChats.senderId === message.receiverId) {
					return {
						...message,
						receiver_unread_msg_count: 0
					}
				}
				return message
			})
			return newMessages;
		});
	}

	useEffect(() => {
		//navigation.setOptions({ title: name, });
		// navigation.setOptions({
		// 	title: "",
		// 	headerLeft: () => (
		// 		<TouchableOpacity style={{
		// 			paddingLeft: 10, paddingRight: 30, marginRight: 10
		// 		}} onPress={() => navigation.toggleDrawer()}>
		// 			{/*Donute Button Image */}
		// 			<Image
		// 				source={menu}
		// 				style={{ width: wp(6), height: wp(6), marginLeft: 5, tintColor: COLORS.white }}
		// 			/>
		// 		</TouchableOpacity>
		// 	),
		// 	headerRight: () => (
		// 		<View style={{ paddingLeft: 10, marginRight: 10 }}  >
		// 			{/* <ChatAction /> */}
		// 		</View>
		// 	),
		// });
	}, [navigation]);

	const ChatAction = () => {
		return (
			<View style={{ display: 'flex', flexDirection: 'row', }}>

				<TouchableOpacity onPress={() => {
					navigation.navigate(t('navigate:notification'));
				}} style={{ paddingRight: wp(2), marginRight: 0 }} >
					<Image
						source={iconBell}
						style={{
							width: wp(6), height: wp(6), marginLeft: 5,
							tintColor: COLORS.white
						}}
					/>
					{
						notificationCount > 0 ? <View style={{
							height: 10, width: 10,
							backgroundColor: "red", borderRadius: 45,
							position: 'absolute', right: wp(2)
						}} /> : null
					}

				</TouchableOpacity>

				<TouchableOpacity
					style={{
						borderWidth: 1,
						borderColor: 'rgba(0,0,0,0.2)',
						alignItems: 'center',
						justifyContent: 'center',
						width: wp(6),
						height: wp(6),
						//position: 'absolute',
						//	bottom: 10,
						//	right: 10,
						backgroundColor: COLORS.primary,
						borderRadius: 100,
					}}
					onPress={() => {
						navigation.navigate("searchChatUsers",);

					}}
				>
					<Image
						source={chat}
						style={[{
							width: 25,
							height: 25,
							tintColor: "#fff"
						}]}
					/>
				</TouchableOpacity>



				{/* <ContextMenu
					actions={[{ title: "UnBlock" },]} // { title: t("common:report") }
					dropdownMenuMode={true}
					onPress={(e) => {
						//blockUserPopup(e.nativeEvent.index)
						navigation.navigate("blockedChatUsers",);
					}}
				>
					<FastImage
						style={[styles.image_small, {
							width: wp(7),
							height: wp(7),
							borderRadius: wp(5) / 2,
							marginLeft: wp(2),
						}]}
						source={iconDots}
						resizeMode={FastImage.resizeMode.cover}
					/>
				</ContextMenu> */}

			</View>


		)
	}

	// headerRight: () => (
	// 	<TouchableOpacity   >


	// 	</TouchableOpacity>
	// ),


	return (
		<SafeAreaView style={styles.chatscreen}>
			<View style={{ backgroundColor: COLORS.secondary, paddingTop: 10 }}>
				<View style={[styles.chatlistContainer, { paddingVertical: 0 }]}>
					{!loading && rooms && rooms.length > 0 ? (
						<FlatList
							data={rooms}
							renderItem={({ item }) => <ChatComponent item={item}
								receiverMessageCountUpdate={receiverMessageCountUpdate} />}
							keyExtractor={(item, index) => index.toString()}
							contentContainerStyle={{ paddingBottom: 50, }}
							bounces={false}
						/>
					) : null}

					{
						!loading && rooms.length <= 0 ?
							<View style={styles.chatemptyContainer}>
								<EmptyListComponent isLoading={false} data={rooms} msg={t('error:no_chat_rooms')} />
							</View>
							: null

					}


					{
						loading ?
							<View style={styles.chatemptyContainer}>
								<View style={[styles.loading]}>
									<ActivityIndicator size="large" color={COLORS.primary} />
								</View>
							</View> : null
					}
				</View>
			</View>
		</SafeAreaView>
	);
};

export default Chat;