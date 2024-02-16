import React, { useState, useEffect, useMemo } from "react";
import { View, SafeAreaView, FlatList, TouchableOpacity, Image, Platform, ActivityIndicator } from "react-native";
import { styles } from "./utils/chatStyles";
import ChatComponent from "./components/ChatComponent";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { chatGroupApi, searchChatUserApi } from "../../redux/actions/chatActions";
import socket from "./utils/socket";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import EmptyListComponent from "../../components/EmptyListComponent";
import moment from "moment";
import SearchChatComponent from "./components/SearchChatComponent";
import { arrow_back, search } from "../../constants/images";
import { COLORS } from "../../theme";
import CustomInput from "../../components/customInput";
import { TextInput } from "react-native-paper";
import { isEmpty } from "../../utils/common";


const SearchChatUsers = ({ route }) => {
    const { t, i18n } = useTranslation();
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setLoading] = useState(false);

    const dispatch = useDispatch()
    const resetData = useRef(false);

    const navigation = useNavigation()

    const authuser = useSelector(({ auth }) => auth.data);

    useEffect(() => {
        const focusHandler = navigation.addListener('focus', () => {
            //	console.log('focusHandler', resetData.current)
            resetData.current = true
            // fetchGroups()
        });
        return focusHandler;
    }, [navigation, searchQuery]);

    useEffect(() => {
        setLoading(true)
        let delayDebounceFn = setTimeout(() => {
            if (searchQuery.length >= 0) fetchGroups()
        }, 1000)

        return () => {
            clearTimeout(delayDebounceFn)
        }
    }, [searchQuery]);

    const fetchGroups = () => {
        if (resetData.current) {
            const params = {
                search: searchQuery
            }
            // setLoading(true)
            dispatch(searchChatUserApi(params, authuser.token)).then((res) => {
                setLoading(false)
                console.log('searchChatUserApi res', res.data.length)
                setUsers(res.data)
            }).catch((error) => {
                setLoading(false)
                console.log('searchChatUserApi', error)
            })
        }
    }


    useEffect(() => {
        //navigation.setOptions({ title: name, });
        navigation.setOptions({
            title: "",
            headerLeft: () => (
                <View style={{ display: 'flex', flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack() //navigate('Home')
                        }
                    >
                        <Image
                            source={arrow_back}
                            style={[styles.image_small, {
                                width: wp(6),
                                height: wp(6),
                                tintColor: COLORS.white,
                            }]}
                        />
                    </TouchableOpacity>
                    {ListHeaderComponent}
                    {/* <TouchableOpacity
                    //onPress={() => navigation.navigate('Home')}
                    >
                        <Image
                            source={image ? { uri: image } : ""}
                            style={[styles.image_small, {
                                width: wp(7),
                                height: wp(7),
                                borderRadius: wp(9) / 2,
                                marginLeft: wp(2),
                                //tintColor: COLORS.white,
                            }]}
                        />

                    </TouchableOpacity>
                    <Text style={{ color: 'white' }}>{name}</Text> */}
                </View>
            ),
        });
    }, [searchQuery]);



    const ListHeaderComponent = useMemo(() => (
        <View>
            <View style={[]}>
                {/* <Image
                    source={search}
                    style={[{
                        width: 25,
                        height: 25,
                    }]}
                /> */}
                <CustomInput
                    value={searchQuery}
                    setValue={(name, text) => setSearchQuery(text)}
                    placeholder={t("common:search")}
                    keyboardType={'default'}
                    autoFocus={true}
                    customStyle={{
                        borderBottomWidth: 0,
                        marginLeft: (wp(1)),
                        // height: 30,
                        // paddingBottom: Platform.OS === 'ios' ? 0 : 8,
                        height: Platform.OS === 'ios' ? 30 : hp(6),
                        paddingVertical: Platform.OS === 'ios' ? 0 : 0,
                        textAlignVertical: 'center',
                    }}
                />

            </View>
        </View>
    ), [searchQuery, setSearchQuery])

    return (
        <SafeAreaView forceInset={{ bottom: 'never' }} style={styles.chatscreen}>
            <View style={styles.chatlistContainer}>
                {/* {ListHeaderComponent()} */}
                {users && users.length > 0 ? (
                    <>
                        <FlatList
                            data={users}
                            renderItem={({ item, index }) => <SearchChatComponent item={item} index={index} />}
                            keyExtractor={(item) => item.id}
                        // ListHeaderComponent={ListHeaderComponent}

                        />
                    </>
                ) : null}
                {
                    isLoading ? <View style={styles.chatemptyContainer}>
                        <View style={[styles.loading]}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                        </View>
                    </View> : null
                }
            </View>
            {
                    !isEmpty(searchQuery) && users.length <= 0 ? <EmptyListComponent isLoading={isLoading} data={users} msg={t('error:users_not_found')} /> :
                        null
                }
        </SafeAreaView>
    );
};

export default SearchChatUsers;