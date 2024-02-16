import React, { useState, useEffect } from "react";
import { View, SafeAreaView, FlatList, TouchableOpacity, Image } from "react-native";
import { styles } from "./utils/chatStyles";
import ChatComponent from "./components/ChatComponent";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { BlockedChatUsersApi } from "../../redux/actions/chatActions";
import socket from "./utils/socket";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import EmptyListComponent from "../../components/EmptyListComponent";
import moment from "moment";
import { arrow_back, chat, iconPlus, menu } from "../../constants/images";
import { COLORS } from "../../theme";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { UseChatCount } from "../../context/chatCountProvider";
import BlockedUserComponent from "./components/BlockedUserComponent";





const BlockedChatUsers = ({ route }) => {
	const { t, i18n } = useTranslation();
	const [users, setUsers] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");

	const dispatch = useDispatch()
	const resetData = useRef(false);

	const navigation = useNavigation()

	const authuser = useSelector(({ auth }) => auth.data);

	useEffect(() => {
		const focusHandler = navigation.addListener('focus', () => {
			resetData.current = true
			fetchGroups()
		});
		return focusHandler;
	}, [navigation, searchQuery]);

	useEffect(() => {
		fetchGroups()
	}, [searchQuery]);

	const fetchGroups = () => {
		if (resetData.current) {
			dispatch(BlockedChatUsersApi(authuser.token)).then((res) => {
				console.log('BlockedChatUsersApi res', res.data)
				setUsers(res.data)
			}).catch((error) => {
				console.log('BlockedChatUsersApi', error)
			})
		}
	}


	useEffect(() => {
		// navigation.setOptions({
		// 	title: "",
		// 	headerLeft: () => (
		// 		<View style={{ display: 'flex', flexDirection: "row", alignItems: "center" }}>
		// 			<TouchableOpacity
		// 				onPress={() => navigation.goBack()}
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
		// 		</View>
		// 	),
		// });
	}, [searchQuery]);

	const unBlockUser = () => {

	}

console.log('users', users)

	return (
		<SafeAreaView forceInset={{ bottom: 'never' }} style={styles.chatscreen}>
			<View style={styles.chatlistContainer}>
				<FlatList
					data={users}
					renderItem={({ item, index }) => <BlockedUserComponent item={item} index={index} unBlockUser={unBlockUser} />}
					keyExtractor={(item, index) =>index}
				/>
				{
					users && users.length > 0 ? <></> :
						<EmptyListComponent isLoading={false} data={users} msg={t('error:usrs')} />
				}

			</View>
		</SafeAreaView>
	);
};

export default BlockedChatUsers;