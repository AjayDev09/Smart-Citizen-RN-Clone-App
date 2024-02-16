import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    useWindowDimensions,
    Image,
    TouchableWithoutFeedback,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Portal } from 'react-native-portalize';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

const PortalView = ({
    selectedMessage,
    messageCordinates,
    setSelectedMessage,
    isSender,
}) => {
    const [blurAmount, setBlurAmount] = useState(0);
    const [ImojiValue, setImojiValue] = useState(0);
    console.log('ImojiValue----', ImojiValue);
    const scale = useSharedValue(0);
    const { height } = useWindowDimensions();
    let EmojiData = [
        {
            TextEmoji: '❤️'
        },
        {
            TextEmoji: '👍'
        },
        {
            TextEmoji: '😂'
        },
        {
            TextEmoji: '😍'
        },
        {
            TextEmoji: '😡'
        },
        {
            TextEmoji: '😄'
        },
        // {
        //     TextEmoji:'➕'
        // },
    ]
    useEffect(() => {
        if (selectedMessage) {
            scale.value = withSpring(1);
        } else {
            scale.value = 0;
        }
    }, [selectedMessage]);

    const reactionStyle = useAnimatedStyle(() => {
        let y = messageCordinates.y || 0;
        let shouldAnimate = false;
        const isLessDisatanceFromTop = y < 100;
        const isLessDisatanceFromBottom =
            height - y < selectedMessage?.layoutHeight;
        if (isLessDisatanceFromBottom) {
            y = y - selectedMessage?.layoutHeight;
            shouldAnimate = true;
        }

        if (isLessDisatanceFromTop) {
            y = y + selectedMessage?.layoutHeight;
            shouldAnimate = true;
        }
        y = isNaN(y) ? 0 : y;
        return {
            transform: [
                {
                    translateY: shouldAnimate
                        ? withTiming(y - 70, { duration: 200 })
                        : y - 70,
                },
            ],
        };
    });

    
    return (
        <Portal>
            <TouchableOpacity
                //   activeOpacity={1}
                onPress={() => { setSelectedMessage(null) }}
                style={styles.container}>
                <Animated.View style={[styles.reaction, reactionStyle]}>
                    {
                        EmojiData?.map((v, i) => {
                            return (
                                <Animated.Text
                                    onPress={() => { setImojiValue(v.TextEmoji), setSelectedMessage(null) }}
                                    style={styles.textFont}>{v?.TextEmoji}</Animated.Text>

                            )
                        })
                    }
                    <TouchableOpacity
                    style={{
                        marginHorizontal:5
                    }}
                      hitSlop={{ top: 5, left: 5, right: 5, bottom: 5 }}
                        onPress={() => { setSelectedMessage(null) }}
                    >
                        <Image
                            source={require('../../assets/images/close.png')}
                            style={{
                                width: 10,
                                height: 10,
                                tintColor: '#000',
                                marginHorizontal:5
                            }}
                        />

                    </TouchableOpacity>
                </Animated.View>
            </TouchableOpacity>
        </Portal>
    );
};

export default PortalView;

const styles = StyleSheet.create({
    container: {
        // width:"70%",
        // height:30,
        // backgroundColor:'red'
        // flex:1
        alignItems: "center",

    },
    messageStyle: {
        // position: 'absolute',
        backgroundColor: '#fff'
    },
    reaction: {
        position: 'absolute',
        padding: 10,
        borderRadius: 50,
        flexDirection: 'row',
        alignItems: 'center',
        // gap: 25,
        backgroundColor: '#fff',
        paddingVertical: 0,
        justifyContent:"center"

    },
    textFont: {
        fontSize: 25,
        color: '#fff',
        fontWeight: '600',
        padding: 4
    }
});