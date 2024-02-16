import React, { useState, useEffect, useMemo } from "react";
import { View, SafeAreaView, FlatList, TouchableOpacity, Image, Platform, ActivityIndicator, TextInput, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { searchChatUserApi } from "../../../redux/actions/chatActions";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import EmptyListComponent from "../../../components/EmptyListComponent";
import { arrow_back, search } from "../../../constants/images";
import { COLORS } from "../../../theme";
import CustomInput from "../../../components/customInput";
import SearchSocialComponent from "./BlockUserComponent";
import { RFValue } from "react-native-responsive-fontsize";
import CustomSocialHeader from "../CustomSocialHeader";
import { blockUserList } from "../../../redux/actions/socialActions";
import { styles } from "./BlockUserStyles";


const BlockedUsers = () => {
    const { t, i18n } = useTranslation();
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setLoading] = useState(false);

    const dispatch = useDispatch()
    const resetData = useRef(false);

    const navigation = useNavigation()

    const authUser = useSelector(({ auth }) => auth.data);

    useEffect(() => {
        const focusHandler = navigation.addListener('focus', () => {
            //	console.log('focusHandler', resetData.current)
            resetData.current = true
            fetchGroups()
        });
        return focusHandler;
    }, [navigation]);

    useEffect(() => {
        setUsers([])
        setTimeout(() => {
            //fetchGroups()
        }, 2000);
    }, []);

    function isEmpty(str) {
        return (!str || str.length === 0);
    }
    const fetchGroups = () => {

        setLoading(true)
        dispatch(blockUserList(authUser.token)).then((res) => {
            console.log('blockUserList res.data', res.data)
            setLoading(false)
            setUsers(res.data)
        }).catch((error) => {
            console.log('error', error)
            setLoading(false)
        })
    }


    console.log('users', users)

    return (
        <View forceInset={{ bottom: 'never' }} style={styles.chatscreen}>
            <CustomSocialHeader title={t('navigate:blockedUsers')} />
            <View style={styles.chatlistContainer}>
                <FlatList
                    data={users}
                    renderItem={({ item, index }) => <SearchSocialComponent item={item} index={index} callBack={fetchGroups} />}
                    keyExtractor={(item) => item.id}
                />
            </View>
            <EmptyListComponent isLoading={isLoading} data={users} msg={t('error:users_not_found')} />
            {
                isLoading ? <View style={[styles.loading]}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View> : null
            }
        </View>
    );
};

export default BlockedUsers;