import { View, Text, Pressable, Image } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../utils/chatStyles";
import { useSelector } from "react-redux";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { iconDefaultUser, iconDocs, iconDocsNew, iconGalleryNew, iconHeadPhones, iconPicture, iconVideoCamera, upload } from "../../../constants/images";
import FastImage from "react-native-fast-image";
import { TouchableOpacity } from "react-native";
import Vi from "rn-emoji-keyboard/lib/commonjs/translation/vi";
import { DATE_FORMATE_12_SORT, fileNameFromUrl, isAudio, isDocument, isImage, isPDF, isVideo } from "../../../utils/common";
import { COLORS } from "../../../theme";
import { RFValue } from "react-native-responsive-fontsize";

const ChatComponent = ({ item, receiverMessageCountUpdate }) => {
	const navigation = useNavigation();
	const { t, i18n } = useTranslation();
	//console.log('item', item)


	const authuser = useSelector(({ auth }) => auth.data);

	// {"id": 1, "isFirstMessage": 1, "message": "Hi", "receiverId": 422, "receiver_name": null, "receiver_profile_pic": "", "senderId": 404, "sender_name": "test business", "sender_profile_pic": null}

	const receiverName = item.receiverId === authuser.user_id ? item.sender_name : item.receiver_name

	const receiverId = item.receiverId === authuser.user_id ? item.senderId : item.receiverId
	//const receiverImage = item.receiverId === authuser.user_id ? item.receiver_profile_pic : item.sender_profile_pic
	const receiverImage = item.receiverId === authuser.user_id ? item.sender_profile_pic : item.receiver_profile_pic
	//console.log('authuser user_id', receiverId,  name, authuser.user_id)

	//console.log('receiverName', receiverName)


	const msgCount = item.receiverId === authuser.user_id ?
		item.receiver_unread_msg_count : item.sender_unread_msg_count

	// const status = item.receiverId === authuser.user_id ?
	//  item.read_status === 0 ?
	//   true : false : false;

	//console.log('msgCount', item.receiverId)
	const status = item.receiverId === authuser.user_id ? item.read_status === 0 && msgCount > 0 ? true : false :
		item.senderId === authuser.user_id ? item.read_status === 0 && msgCount > 0 ? true : false : false;

	// console.log('item.read_status', item.read_status)
	// console.log('status',
	// 	item.receiverId === authuser.user_id,
	// 	item.receiver_unread_msg_count,
	// 	item.senderId === authuser.user_id,
	// 	item.sender_unread_msg_count,
	// 	"msgCount",
	// 	msgCount)

	//console.log('ids', item.receiverId, authuser.user_id, receiverId, item.read_status === 0, status)
	// useEffect(() => {
	// 	//setMessages(item.messages[item.messages.length - 1]);
	// }, [item, status]);
	//console.log('status',msgCount, status)

	const handleNavigation = () => {
		//console.log('item', item)

		receiverMessageCountUpdate(item)
		navigation.navigate("messaging", {
			id: receiverId,
			name: receiverName,
			image: receiverImage,
			item: item
		});
	};



	const imgIcon = item.messageType && item.messageType === 'image' ?
		isAudio(item.url) ?
			iconHeadPhones :
			isDocument(item.url) || isPDF(item.url) ?
				iconDocsNew :
				isVideo(item.url) ? iconVideoCamera :
					isImage(item.url) ? iconPicture : undefined : undefined

	const filename = item.messageType && item.messageType === 'image' ?
		isAudio(item.url) ?
			t("common:audio") :
			isDocument(item.url) || isPDF(item.url) ?
				fileNameFromUrl(item.url) :
				isVideo(item.url) ? t("common:video") :
					isImage(item.url) ? t("common:photo") : undefined : undefined


	//fileNameFromUrl(item.url)


	//console.log('status', status)
	return (
		<TouchableOpacity activeOpacity={0.7} style={styles.cchat} onPress={handleNavigation}>


			<View style={[styles.crightContainer, { flexDirection: "row", paddingVertical: 10, }]}>
				{receiverImage ? <FastImage style={[styles.image_small, {
					marginTop: 5,
				}]}
					source={{
						uri: receiverImage ? receiverImage : "",
						priority: FastImage.priority.normal,
					}}
					resizeMode={FastImage.resizeMode.cover}
				/> : <FastImage style={[styles.image_small, {
					marginTop: 5,

				}]}
					source={iconDefaultUser}
					//onError={iconDefaultUser}
					resizeMode={FastImage.resizeMode.contain}
				/>}

				<View style={{
					flex: 1,
					flexDirection: "column",
				

				}}>
					<View style={{ flexDirection: "row", justifyContent:"space-between",alignItems:"center",marginBottom:0 }}>
						<Text numberOfLines={2} style={[styles.cusername, { flex:1, textAlign: 'left'}]}>{receiverName}</Text>			
						{
							status ? <Text style={[styles.ctime, {   fontWeight: 'bold', }]}>
								{moment(item.updated_at).format(DATE_FORMATE_12_SORT)}
							</Text> : <Text style={[styles.ctime, {  }]}>
								{moment(item.updated_at).format(DATE_FORMATE_12_SORT)}
							</Text>
						}
					</View>

					<View style={{  flexDirection: "row", alignItems: 'center',marginTop:5}}>
						{
							item.messageType && item.messageType === 'image' ?
								<Image
									style={{
										tintColor: status ? COLORS.black : COLORS.textDark,
										resizeMode: "contain",
										width: 15,
										height: 15,
										marginRight: 5,
									}}
									source={imgIcon}
								/> : null
						}
						{
							status ? <Text numberOfLines={1} style={[styles.cmessage, {
								width: "90%",
								fontWeight: 'bold', color: "#000", marginTop: 0, textAlign: 'left'
							}]}>
								{filename ? filename : item?.message ? item.message : ""}
							</Text>
								: <Text numberOfLines={1} style={[styles.cmessage, { color: COLORS.textDark, width: "100%", textAlign: 'left', }]}>
									{filename ? filename : item?.message ? item.message : ""}
								</Text>
						}
						{msgCount > 0 ? 
						<Text  style={[styles.cusername, { fontSize: RFValue(18),marginRight:20 }]}>{msgCount}</Text> 
						: null}
					</View>

				</View>
			</View>

		</TouchableOpacity>
	);
};

export default ChatComponent;