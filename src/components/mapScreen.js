import React, { Component, useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text, Image, Dimensions, Platform, SafeAreaView } from 'react-native';
import { useEffect } from 'react';
import { close } from '../constants/images';
import { COLORS } from '../theme';
 

const SCREEN_WIDTH = Dimensions.get('screen').width
const SCREEN_HEIGHT = Dimensions.get('screen').height
const MapScreen = ({modalVisible, setModalVisible, setLocation }) => {
    const [fullScreen, setFullScreen] = useState(true);

    useEffect(() => {


    }, [modalVisible])


    const scrollRef = React.useRef(null);
    return (
        <Modal
            style={styles.container}
            //  transparent={true}
            // visible={true}
            onRequestClose={() => {
                //  setModalVisible(!modalVisible);
            }}
        >
            <SafeAreaView style={{
                flex: 1, backgroundColor: COLORS.secondary, alignItems: 'flex-start',
                flexDirection: 'column',
                alignSelf: 'center'
            }}>
                <TouchableOpacity
                    style={{ paddingTop: 10 }}
                    onPress={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <Image
                        source={close}
                        style={[styles.image, {
                            width: 20,
                            height: 20,
                            marginLeft: 10,

                            tintColor: COLORS.primary
                        }]}
                    />
                </TouchableOpacity>
                <View style={{
                    marginTop: 20,
                    flex: 1, display: 'flex', backgroundColor: COLORS.secondary, justifyContent: 'flex-start',
                    flexDirection: 'row'
                }}>

                </View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        flexDirection: 'column',
        backgroundColor: COLORS.secondary,
        paddingBottom: 30,
        paddingHorizontal: 10,
        overflow: 'hidden',
    },
    itemText: {
        fontSize: 18,
        color: COLORS.text,
        textAlign: 'left',
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold"
    },
    backgroundVideo: {
        aspectRatio: 1,
        // width: "100%",
        height: SCREEN_HEIGHT - 200,
        alignSelf: 'center',
        // backgroundColor: '#FFF',
        //backgroundColor: COLORS.secondary,
    },
    rbStyle: {
        backgroundColor: COLORS.secondary,

    },
    image: {
        // width: 20,
        // height: 20,
    },
});

export default MapScreen;
