import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Platform, TouchableOpacity, Image, Dimensions, ActivityIndicator, Modal } from 'react-native'
import Pdf from 'react-native-pdf';
import { RFValue } from 'react-native-responsive-fontsize';
import { pdf } from '../constants/images';
import { COLORS } from '../theme';
import DocumentPopup from './DocumentPopup';
import { memo } from 'react';

let source = { uri: '' }
const CustomPDFView = ({ docUrl = "", docHight = 150, onLongPress, showDownload = false }) => {
    const videoPlayer = React.useRef();
    const [modalVisible, setModalVisible] = React.useState(false);
    const [thumbnail, setThumbnail] = React.useState("");
    const [loading, setLoading] = useState(false)

    // console.log('docUrl ', docUrl)

    const goFullScreen1 = () => {
        console.log("setModalVisible", modalVisible);
        setModalVisible(!modalVisible)
    };

    useEffect(() => {
        const encoded = encodeURI(docUrl);
        // console.log('encoded', encoded)
        source = { uri: encoded, cache: true };
        setLoading(true)
        //getURL()
    }, [docUrl]);



    let filename = docUrl.substring(docUrl.lastIndexOf('/') + 1, docUrl.length)
    return (
        < >
            <TouchableOpacity style={[styles.container]} onLongPress={onLongPress} onPress={() => { goFullScreen1() }}  >
                <View style={{ width: "100%", height: "100%", justifyContent: 'center', alignItems: 'center', }}>
                    {source.uri != '' &&
                        <Pdf
                            source={source}
                            singlePage={true}
                            trustAllCerts={false}
                            onLoadComplete={(numberOfPages, filePath) => {
                                setLoading(false)
                            }}
                            onLoadProgress={(percent) => {
                                console.log("i", percent);
                            }}
                            onPageChanged={(page, numberOfPages) => {
                                // console.log(`Current page: ${page}`);
                            }}
                            onError={(error) => {
                                setLoading(false)
                                console.log(error);
                            }}
                            onPressLink={(uri) => {
                                // console.log(`Link pressed: ${uri}`);
                            }}
                            style={styles.pdf} />
                    }
                </View >
                <View style={{ position: 'absolute', width: 150, flexDirection: 'row', paddingLeft: 10, bottom: 0, backgroundColor: "#fff", alignItems: 'center', justifyContent: 'flex-start' }}>
                    <Image
                        source={pdf}
                        style={[styles.image, {
                            width: 25,
                            height: 25,
                            marginBottom: 5
                            //alignSelf:'flex-end',
                            //justifyContent:'flex-end'
                            // marginLeft: 10,
                            //  tintColor: COLORS.textDark
                        }]}
                    />
                    {/* <Text  style={[styles.itemText, {flex:1,   fontSize: RFValue(14), bottom: 0, fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold", color: COLORS.textDark }]}>
                        {filename}
                    </Text> */}
                </View>
            </TouchableOpacity>
            {
                modalVisible ? <DocumentPopup modalVisible={modalVisible} setModalVisible={setModalVisible} docUrl={docUrl} showDownload={showDownload} /> : null
            }
            {/* {
                loading && <Modal visible={loading}
                    // animationType="slide"
                    transparent={true}>
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }}>
                        <ActivityIndicator color={COLORS.primary} size={'large'} />
                    </View>
                </Modal>
            } */}
        </ >
    )
}

export default memo(CustomPDFView)

// Later on in your styles..
var styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    pdf: {
        flex: 1,
        width: 150,
        height: 150,
    },
    itemText: {
        fontSize: RFValue(16),
        color: COLORS.text,
        textAlign: 'left',
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
    },
});