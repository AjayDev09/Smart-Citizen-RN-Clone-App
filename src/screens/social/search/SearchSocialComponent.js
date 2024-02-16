import { View, Text, Image } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./socialStyles";
import { useTranslation } from "react-i18next";
import { iconDefaultUser } from "../../../constants/images";
import FastImage from "react-native-fast-image";
import { TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const SearchSocialComponent = ({ item, index }) => {
	const navigation = useNavigation();
	const { t, i18n } = useTranslation();

	const profilePic = item.user_status === 1 ? item.business_logo : item.profile_pic
	const userName = item.user_status === 1 ? item.business_name : item.first_name + " " + item.last_name

	useLayoutEffect(() => {
	}, []);

	const handleNavigation = () => {
		navigation.goBack()
		console.log('profilePic', profilePic === "null")
		navigation.navigate('social-profile', {
			user_id: item.id,
			item, item
		});
	};


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
						<Text style={[styles.cusername, { maxWidth: "80%" }]}>{userName ? userName : "-"}</Text>
					</View>

					{/* <Text style={[styles.cmessage, { width: "100%", textAlign: 'left' }]}>
							{userName ? userName : ""}
						</Text> */}

				</View>
			</View>

		</TouchableOpacity>
	);
};

export default SearchSocialComponent;