import React, { Component, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, Dimensions, Platform, SafeAreaView, Button } from 'react-native';
import { useTranslation } from 'react-i18next';
import Modal from "react-native-modal";
import { AirbnbRating, Rating } from 'react-native-ratings';
import { COLORS } from '../../theme';
import CustomInput from '../../components/customInput';


const ReviewRatingPopup = ({ modalVisible, setModalVisible, params, onCallBack, }) => {
    const { t, i18n } = useTranslation();
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const containerStyles = { backgroundColor: COLORS.secondary, height: 250, justifyContent: 'flex-start', alignItems: 'center' };

    const ratingCompleted = (rating) => {
        console.log("Rating is: " + rating)
        setRating(rating)
    }

    const onChangeValue = (name, value) => {
        //  console.log(name, value);
        setReview(value)
    };

    const isReivewDone = review.trim() !== "" || rating > 0 ? false : true

    return (
        <Modal
            isVisible={modalVisible}
            //style={styles.container}
            //  transparent={true}
            // visible={true}
            contentContainerStyle={containerStyles}
            //  transparent={true}
            onDismiss={() => {
                setModalVisible(false);
            }}
        >
            <View style={{
                display: 'flex',
                // width: '95%',
                // height: '100%',
                flexDirection: 'column',
                backgroundColor: COLORS.secondary,
                alignItems: 'center',
                padding: 10
            }}>
                <View style={{
                    width: 300,
                }}>
                    <Text style={[styles.title, {
                        marginTop: 20,
                        marginBottom: 20,
                        alignSelf: 'center'
                    }]}> {t("common:reviewTitle")} </Text>

                    <AirbnbRating
                        showRating={false}
                        ratingCount={5}
                        defaultRating={0}
                        onFinishRating={ratingCompleted}
                        style={{ marginTop: 20 }}
                    />

                    <View style={{
                        marginTop: 20,
                    }}>
                        <CustomInput
                            name={'review'}
                            value={review}
                            setValue={onChangeValue}
                            placeholder={t('common:review')}
                            keyboardType={'default'}
                            // errorMessage={t('error:review')}
                            customStyle={{ width: 300 }}

                        />
                        <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <TouchableOpacity disabled={isReivewDone} style={[styles.ButtonStyle,
                            {
                                backgroundColor: COLORS.primary, marginLeft: 0,
                                opacity: isReivewDone ? .6 : 1
                            }]}
                                onPress={() => {
                                    if (review.trim() !== "" || rating > 0) {
                                        params.review = review
                                        params.rating = rating
                                        onCallBack(params)
                                        setReview('')
                                        setRating(0)
                                        setModalVisible(!modalVisible)
                                    }

                                }} >
                                <Text style={styles.itemText}> {t("common:submit")} </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.ButtonStyle,
                            { backgroundColor: COLORS.primary }]}
                                //activeOpacity = { .5 } 
                                onPress={() => {
                                    setReview('')
                                    setRating(0)
                                    setModalVisible(!modalVisible)
                                }} >
                                <Text style={styles.itemText}> {t("common:cancel")} </Text>
                            </TouchableOpacity>

                            {/* <Button title={t("common:cancel")} onPress={{}} />
                        <Button title={t("common:report")} onPress={{}} /> */}
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
export default ReviewRatingPopup;

const styles = StyleSheet.create({
    container: {
        height: '50%',
        // width: 250, 
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: COLORS.secondary,
        //justifyContent: 'flex-end', margin: 0
    },
    title: {
        fontSize: 18,
        color: COLORS.text,
        textAlign: 'left',
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold"
    },
    itemText: {
        fontSize: 18,
        color: COLORS.text,
        textAlign: 'left',
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
    },
    ButtonStyle: {
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 20,
        //    width: '70%'
        marginLeft: 20
    },
    checkboxContainer: {
        flexDirection: 'row',
        marginTop: '10%',
        alignItems: 'center'
    },
    checkbox: {
        alignSelf: 'center',
        tintColors: 'green'
    },
});


