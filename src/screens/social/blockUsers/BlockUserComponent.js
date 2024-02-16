import { View, Text, Image, Alert } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./BlockUserStyles";
import { useTranslation } from "react-i18next";
import { iconDefaultUser } from "../../../constants/images";
import FastImage from "react-native-fast-image";
import { TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { socialPostBlockUser } from "../../../redux/actions/socialActions";
import { useDispatch, useSelector } from "react-redux";
import { ShowErrorToast } from "../../../utils/common";

const SearchSocialComponent = ({ item, index, callBack }) => {
	const navigation = useNavigation();
	const { t, i18n } = useTranslation();
	const dispatch = useDispatch()
	const authUser = useSelector(({ auth }) => auth.data);

	const profilePic = item.user_status === 1 ? item.business_logo : item.profile_pic
	const userName = item.user_status === 1 ? item.business_name : item.first_name + " " + item.last_name

	useLayoutEffect(() => {
	}, []);

	const handleNavigation = () => {
		//	navigation.goBack()
		console.log('profilePic', profilePic === "null")
		navigation.navigate('social-profile', {
			user_id: item.block_user_id,
			item, item
		});
	};


	const onUnBlock = () => {
		Alert.alert(
			t("common:un_block_user"),
			t("common:un_block_user_message"),
			[
				{
					text: (t("common:yes")), onPress: () => {
						const params = {
							block_user_id: item.block_user_id,
							is_block: 2,   //1=block,2=unblock
						}
						console.log('params', params)
						dispatch(socialPostBlockUser(params, authUser.token))
							.then((response) => {
								console.log('socialPostBlockUser response', response)
								if (response.status === 200) {
									callBack()
								}
								ShowToast(response.message)
							}).catch((error) => {
								console.log('error', error)
								ShowErrorToast(error)
							})
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
						<Text style={[styles.cusername, { maxWidth: "80%" }]}>{item.name ? item.name : "-"}</Text>
					</View>

					{/* <Text style={[styles.cmessage, { width: "100%", textAlign: 'left' }]}>
							{userName ? userName : ""}
						</Text> */}

				</View>
				<TouchableOpacity
					style={[styles.actionButtonStyle, { marginLeft: 5 }]}
					activeOpacity={.5}
					onPress={onUnBlock}
				>
					<Text style={[styles.itemText, styles.textBold]}
					>{t('common:unblock')}</Text>
				</TouchableOpacity>
			</View>

		</TouchableOpacity>
	);
};

export default SearchSocialComponent;