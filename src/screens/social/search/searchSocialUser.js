import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, SafeAreaView, FlatList, TouchableOpacity, Image, Platform, ActivityIndicator, TextInput, Dimensions } from "react-native";
import { styles } from "./socialStyles";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { searchChatUserApi } from "../../../redux/actions/chatActions";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTranslation } from "react-i18next";
import EmptyListComponent from "../../../components/EmptyListComponent";
import { arrow_back, search } from "../../../constants/images";
import { COLORS } from "../../../theme";
import CustomInput from "../../../components/customInput";
import SearchSocialComponent from "./SearchSocialComponent";
import CustomSocialHeader from "../CustomSocialHeader";


const SearchSocialUsers = ({ SocialSelectedTab, setSocialSelectedTab }) => {
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
            // fetchGroups("")
        });
        return focusHandler;
    }, [navigation]);

    useEffect(() => {
        // setUsers([])
        // setTimeout(() => {
        //     //fetchGroups()
        // }, 2000);
        // console.log('searchQuery >>>> ', searchQuery, isEmpty(searchQuery))
        console.log("searchQuery", searchQuery);
        // fetchGroups(searchQuery)
    }, [searchQuery]);

    useEffect(() => {
        setLoading(true)
        let delayDebounceFn = setTimeout(() => {
            if (searchQuery.length >= 0) fetchGroups()
        }, 1000)

        return () => {
            clearTimeout(delayDebounceFn)
        }
    }, [searchQuery])

    function isEmpty(str) {
        return (!str || str.length === 0);
    }
    const fetchGroups = (test) => {
        // if (!isEmpty(searchQuery)) {
        const params = {
            search: searchQuery
        }
        // setLoading(true)
        dispatch(searchChatUserApi(params, authUser.token)).then((res) => {
            setLoading(false)
            console.log(params, res.data.length)
            if (!isEmpty(searchQuery))
                setUsers(res.data)
            else
                setUsers([])
        }).catch((error) => {
            console.log('error', error)
            setLoading(false)
        })
        //  } else {
        //  console.log(sdds'setUsers >>>')
        //  setUsers(undefined)
        //  }
    }

    const ListHeaderComponent = useMemo(() => (
        <CustomInput
            value={searchQuery}
            setValue={(name, text) => {
                setSearchQuery(text)
                // fetchGroups(text)
            }}
            placeholder={t("common:search")}
            keyboardType={'default'}
            autoFocus={false}
            customStyle={{
                borderBottomWidth: 0,
                marginLeft: (wp(1)),
                height: Platform.OS === 'ios' ? 30 : hp(6),
                paddingVertical: Platform.OS === 'ios' ? 0 : 0,
                textAlignVertical: 'center',
            }}
            clearButtonMode="while-editing"
        />
    ), [searchQuery, setSearchQuery])

    const onBackPress = () => {
        if (SocialSelectedTab === 0) {
            navigation.goBack()
        } else {
            setSocialSelectedTab(0)
        }
    }


    const renderMainView = () => {
        return (
            <View forceInset={{ bottom: 'never' }} style={styles.chatscreen}>
                <CustomSocialHeader
                    customComponent={ListHeaderComponent} onBackPress={onBackPress}
                />
                {/* <TextInput value={searchQuery} onChangeText={(text) => {
                    setSearchQuery(text)
                    // fetchGroups(text)
                }} /> */}
                <View style={styles.chatlistContainer}>
                    <FlatList
                        data={users}
                        renderItem={({ item, index }) => <SearchSocialComponent item={item} index={index} />}
                        keyExtractor={(item, index) => index.toString()}

                    />


                    {
                        isLoading ? <View style={[styles.loading]}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                        </View> : null
                    }
                </View>
                {
                    !isEmpty(searchQuery) && users.length <= 0 ? <EmptyListComponent isLoading={isLoading} data={users} msg={t('error:users_not_found')} /> :
                        null
                }
            </View>
        );
    }


    return renderMainView()

};

export default SearchSocialUsers;