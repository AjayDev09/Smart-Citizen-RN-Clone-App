import { View, Text, Image, Alert } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./LikedUsersStyles";
import { useTranslation } from "react-i18next";
import { iconDefaultUser } from "../../../constants/images";
import FastImage from "react-native-fast-image";
import { TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { socialUserConnect } from "../../../redux/actions/socialActions";
import { useDispatch, useSelector } from "react-redux";
import { ShowToast } from "../../../utils/common";

const LikedUserComponent = ({ item, index, callBack, UserID }) => {
	const navigation = useNavigation();
	const { t, i18n } = useTranslation();
	const dispatch = useDispatch()
	const authUser = useSelector(({ auth }) => auth.data);

	//console.log('item', item)

	const profilePic = item.profile_pic
	const name = item.name
	const userName = item.user_name
	const userID = item.user_id

	useLayoutEffect(() => {
	}, []);

	const handleNavigation = () => {
		//	navigation.goBack()
		console.log('userID sdsds', userID)
		navigation.navigate('social-profile', {
			user_id: userID,
			item, item
		});
	};

	const onDisconnect = () => {
		if (item && item.is_request === 2) {
			Alert.alert(
				t("common:disconnect_user"),
				t("common:disconnect_user_message"),
				[
					{
						text: (t("common:cancel")),
						onPress: () => console.log("Cancel Pressed"),
					},
					{
						text: (t("common:ok")), onPress: () => {
							socialUserConnectApi(item)
						}
					},
					{
						text: (t("common:no")),
						onPress: () => console.log("Cancel Pressed"),
					},
				]
			);
		}else{
			socialUserConnectApi(item)
		}
	}
	const socialUserConnectApi=(item)=>{
		const param = {
			receiver_id: userID,
			is_request: item && item.is_request === 2 ? 4 : 1
		}
		console.log('param', param, authUser.token)
		dispatch(socialUserConnect(param, authUser.token))
			.then((res) => {
				console.log('res.data', res)
				if (res.status === 200) {
					callBack()
					ShowToast(res.message)
				}
			}).catch((error) => {
				console.log('res.error', error)
			})
	}
	return (
		<TouchableOpacity style={styles.cchat} onPress={handleNavigation}>

			<View style={[styles.crightContainer, { flexDirection: "row", paddingVertical: 10, }]}>
				{
					profilePic && profilePic !== "null" ? <FastImage style={[styles.image_small, {
						marginTop: 0,
					}]}
						source={profilePic ? {
							uri: profilePic ? profilePic : "",
							priority: FastImage.priority.normal,
						} : iconDefaultUser}
						//onError={iconDefaultUser}						 
						resizeMode={FastImage.resizeMode.cover}
					/> :
						<FastImage style={[styles.image_small, {
							height: 35,
							width: 35,
							borderRadius: 0,
							marginTop: 0,
							padding: 0
						}]}
							source={iconDefaultUser}
							//onError={iconDefaultUser}
							resizeMode={FastImage.resizeMode.contain}
						/>
				}

				<View style={{
					flex: 1,
					flexDirection: "column",
					justifyContent: 'center'
				}}>
					<View style={{ display: 'flex', flexDirection: "row", justifyContent: 'space-between' }}>
						<Text style={[styles.cusername, { maxWidth: "80%" }]}>{name ? name : "-"}</Text>
					</View>

					{/* <Text style={[styles.cmessage, { width: "80%", textAlign: 'left' }]}>
							{userName ? userName : ""}
						</Text> */}

				</View>
				{
					userID !== authUser.user_id ? <TouchableOpacity
						style={[styles.actionButtonStyle, { marginLeft: 5 }]}
						activeOpacity={.5}
						onPress={onDisconnect}
					>
						{/* <Text style={[styles.itemText, styles.textBold]}
						>{item.is_request === 2 ? t('common:disconnect') : item.is_request === 1 ? t('common:requested') : t('common:connect')}</Text> */}

						<Text style={[styles.itemText, styles.textBold]}
						>{item.is_request === 2 ? t('common:disconnect') : t('common:connect')}</Text>

					</TouchableOpacity> : null
				}

			</View>

		</TouchableOpacity>
	);
};

export default LikedUserComponent;