import { Platform, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { List, Modal, Portal } from 'react-native-paper';
import { arrowDown, check, close, drawCheck } from '../../constants/images';
import { Image } from 'react-native';
import { COLORS } from '../../theme';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RFValue } from 'react-native-responsive-fontsize';
import { MultiSelect } from 'react-native-element-dropdown';
import MultiSelectComponent from '../../components/MultiSelectComponent';
import LocationMultiSelectPopup from '../../components/LocationMultiSelectSearch';
import { getLabelField } from '../../utils/common';

const SCREEN_WIDTH = Dimensions.get('screen').width
const widthP = (SCREEN_WIDTH * 15) / 100
const Filters = ({ isCouponScreen, onCouponCallBack, couponsCategoryList = [],
    blogsCategoryList = [],
    onBlogCallBack,
    onCloseFilters, showFilter, isChatScreen = false }) => {

    const { t, i18n } = useTranslation();

    const categories = useSelector(({ coupon }) => coupon.couponsCategory);
    const locationList = useSelector(({ coupon }) => coupon.locationList);

    const [selectedTab, setselectedTab] = useState(isCouponScreen ? 1 : 1);
    const [selectedCategory, setselectedCategory] = useState([]);
    const [selectedDiscount, setselectedDiscount] = useState('');
    const [categoryDataArray, setCategoryDataArray] = useState([]);
    const [locationData, setLocationData] = useState([])
    const [location, setLocationState] = useState([])
    const [locationModalVisible, setLocationModalVisible] = useState(false)



    const TYpeArray = [
        { id: 1, label: 'categories' },
        { id: 2, label: 'location' },
        { id: 3, label: 'discount_type' },
    ];


    useEffect(() => {
        var item = locationList.find((item, index) => item.id == location)
        // const city_area = i18n.language === 'he' ? item.city_area_he : i18n.language === 'ar' ? item.city_area_ab : item.city_area
        //  console.log('location.location_id', item)
    }, [location])

    useEffect(() => {
        const DataArray = isChatScreen ? [] : isCouponScreen ? couponsCategoryList : blogsCategoryList;
        // console.log('DataArray', DataArray)
        if (DataArray) {
            setCategoryDataArray(DataArray.map((item, index) => {
                return { label: item.category_name, label_ar: item.category_name_ab, label_he: item.category_name_he, value: String(item.category_id) }
            }))
        }
        //setCategoryDataArray(DataArray)
        setselectedTab(isCouponScreen ? 1 : 1)
        //console.log('isCouponScreen', isCouponScreen)
        clearAll()
    }, [isCouponScreen, categories, isChatScreen])

    useEffect(() => {
        if (locationList)
            setLocationData(locationList.map((item, index) => {
                return { label: item.city_area, label_ar: item.city_area_ab, label_he: item.city_area_he, value: String(item.id) }
            }))
        return () => {
        }
    }, [locationList])





    const hideModel = () => { onCloseFilters() };
    const clearAll = () => {
        setselectedCategory([])
        setselectedDiscount('')
        setLocationState([])
    };
    const onChangeValue = (value) => {
        console.log('first', value)
        setLocationState(value);
    };

    const containerStyles = { backgroundColor: '#f2f2f2', height: 250, justifyContent: 'flex-start' };


    const discountTypeRender = () => {
        return (<>
            <View style={styles.typeinnerWrapper}>
                <TouchableOpacity
                    style={styles.rbStyle}
                    onPress={() => {
                        setselectedDiscount("Flat")
                    }}>
                    {selectedDiscount === "Flat" && <View style={styles.selected} />}
                </TouchableOpacity>
                <Text style={styles.typeText}>{t('common:flat')}</Text>
            </View>
            <View style={styles.typeinnerWrapper}>

                <TouchableOpacity
                    style={styles.rbStyle}
                    onPress={() => {
                        setselectedDiscount("Percentage")
                    }}>
                    {selectedDiscount === "Percentage" && <View style={styles.selected} />}
                </TouchableOpacity>
                <Text style={styles.typeText}>{t('common:percentage')}</Text>
            </View>
        </>)
    }

    const array = isCouponScreen ? TYpeArray : TYpeArray.slice(0, 1)
    let finalSelectedItems = locationData.filter((item) => {
        const id = item.value
        //  console.log('locationData.find', locationData.find((item)=> item.value === id))
        return location.find((item) => item === id)
    });

    //  console.log('location', location)
    const labelField = i18n.language === 'he' ? "label_he" : i18n.language === 'ar' ? 'label_ar' : "label"
    const labelCategoryField = i18n.language === 'he' ? "category_name_he" : i18n.language === 'ar' ? 'category_name_ar' : "category_name"


    return (
        <View>
            <Portal style={{}}>
                <Modal
                    visible={showFilter}
                    onDismiss={hideModel}
                    contentContainerStyle={containerStyles}
                >
                    <View
                        style={{
                            display: 'flex',
                            height: '100%',
                            flexDirection: 'column',
                            //   backgroundColor: '#f2f2f2',
                        }}
                    >
                        <View style={styles.headerContainer}>
                            <TouchableOpacity
                                onPress={() => { onCloseFilters() }}
                            >
                                <Image
                                    source={close}
                                    style={[styles.image, {
                                        width: 20,
                                        height: 20,
                                        tintColor: COLORS.textDark
                                    }]}
                                />
                            </TouchableOpacity>

                            <Text style={styles.headerTitle}>{t("common:apply_filters")}</Text>

                            <TouchableOpacity
                                onPress={() => { clearAll() }}
                            >
                                <Text style={styles.txtClearAll}>{t('common:clear_all')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.lineHorizontal} />
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                backgroundColor: '#fff',
                                height: 300
                            }}
                        >
                            <View style={{ width: '32%', }}>
                                {array.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => setselectedTab(item.id)}
                                            key={index}
                                            style={{
                                                backgroundColor:
                                                    selectedTab === item.id ? '#2a489f' : 'white',
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    styles.txtTab,
                                                    {
                                                        color: selectedTab === item.id ? 'white' : '#505050',
                                                        marginHorizontal: wp(2)
                                                    },
                                                ]}
                                            >
                                                {t("common:" + item.label)}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                            <View style={styles.lineVerticle} />
                            <View style={{ width: '68%', backgroundColor: '#f2f2f2', paddingTop: 5 }}>
                                {
                                    selectedTab === 1 ? <View style={{ flex: 1 }}>
                                        <MultiSelectComponent
                                            data={categoryDataArray}
                                            labelField={getLabelField(i18n.language)}
                                            selectedValue={selectedCategory}
                                            onChangeValue={setselectedCategory}
                                        />
                                    </View> : null
                                }
                                {/* {
                                    selectedTab === 2 ? <View style={{ flex: 1 }}>
                                         <MultiSelectComponent
                                            data={locationData}
                                            labelField={labelField}
                                            selectedValue={location}
                                            onChangeValue={onChangeValue}
                                            isSearch={true}
                                        />
                                    </View> : null
                                } */}

                                {
                                    selectedTab === 2 ? <TouchableOpacity style={{
                                        width: (SCREEN_WIDTH - widthP),
                                        justifyContent: 'center',
                                        marginLeft: wp("1%"),
                                        borderColor: COLORS.textDark,
                                        borderBottomColor: COLORS.textDark,
                                        borderBottomWidth: 1,
                                    }} onPress={() => {
                                        setLocationModalVisible(!locationModalVisible)
                                    }}>
                                        <Text style={[styles.text, {
                                            fontSize: RFValue(16), alignItems: 'center',
                                        }]}>
                                            {t('common:storelocation')}
                                        </Text>

                                    </TouchableOpacity> : null
                                }

                                {
                                    selectedTab === 2 ? <View style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
                                        <Text style={[styles.text, {
                                            fontSize: RFValue(16), alignItems: 'center',
                                        }]}>
                                            {
                                                finalSelectedItems.map((item, index) => {
                                                    return finalSelectedItems.length - 1 === index ? item[getLabelField(i18n.language)] + " " : item[getLabelField(i18n.language)] + ", "
                                                })
                                            }
                                        </Text>
                                    </View> : null
                                }


                                {
                                    locationModalVisible ? <LocationMultiSelectPopup
                                        name={'location_id'}
                                        locationData={locationData}
                                        modalVisible={locationModalVisible}
                                        setModalVisible={setLocationModalVisible}
                                        selectedValue={location}
                                        onChangeValue={onChangeValue}
                                        onCallBack={onChangeValue} /> : null
                                }
                                {
                                    selectedTab === 3 ? discountTypeRender() : null
                                }

                                <View style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: "flex-end", paddingBottom: 20 }}>
                                    <TouchableOpacity
                                        style={styles.buttonStyle}
                                        onPress={() => {
                                            const params = {
                                                category_id: selectedCategory,
                                                discount_type: selectedDiscount,
                                                location_id: location,
                                            }
                                            isCouponScreen ? onCouponCallBack(params) : onBlogCallBack(params)
                                        }}
                                    >
                                        <Text style={[styles.txtTab, { fontSize: RFValue(18), color: COLORS.text }]}>{t("common:apply")}  </Text>
                                    </TouchableOpacity>
                                </View>

                            </View>

                        </View>


                    </View>
                </Modal>
            </Portal>
        </View >
    );
};

export default Filters;

const styles = StyleSheet.create({
    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    headerTitle: {
        fontSize: RFValue(20),
        color: '#505050',
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
    },
    txtClearAll: {
        fontSize: RFValue(16),
        color: '#505050',

        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular",
    },
    txtTab: {
        fontSize: RFValue(16),
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
        paddingVertical: 7,
        paddingLeft: 10,
    },
    lineHorizontal: {
        height: 1,
        width: '100%',
        backgroundColor: '#b7b7b7',
        marginTop: 5,
    },
    lineVerticle: {
        height: '100%',
        width: 1,
        backgroundColor: '#b7b7b7'
    },
    image: {
        width: 20,
        height: 20,
        left: 0
    },
    buttonStyle: {
        marginLeft: wp(1),
        paddingTop: hp(".5%"),
        paddingBottom: hp(".5%"),
        width: wp("30%"),
        backgroundColor: COLORS.primary,
        borderRadius: 35,
        alignItems: 'center',

    },

    typeinnerWrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 5,
        marginTop: 10
    },
    typeText: {
        fontSize: RFValue(18),
        color: COLORS.textDark,
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
    },
    rbStyle: {
        height: 25,
        width: 25,
        borderRadius: 110,
        borderWidth: 2,
        marginHorizontal: 5,
        borderColor: COLORS.textDark,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selected: {
        width: 16,
        height: 16,
        borderRadius: 55,
        backgroundColor: COLORS.primary,
    },
    dropdown: {
        // height: Platform.OS == "ios" ? 35 : hp(6),
        paddingLeft: wp(2),
        backgroundColor: 'transparent',
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 14,
        color: COLORS.white,
    },
    selectedStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: 'white',
        shadowColor: '#000',
        marginTop: 8,
        marginRight: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    icon: {
        marginRight: 5,
    },
    selectedStyle: {
        borderRadius: 12,
    },
});
