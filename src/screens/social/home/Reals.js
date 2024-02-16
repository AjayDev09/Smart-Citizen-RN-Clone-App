import React, { useRef, useState } from "react";
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import SingleReel from "./SingleReel";
import { videoData } from ".";
import { Dimensions, FlatList, StatusBar, View } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useHeaderHeight } from '@react-navigation/elements';
import ReelCard from "./ReelCard";
const ScreenHeight = Dimensions.get("window").height;

const TOP_BOTTOM_MARGIN = 187

const SocialReels = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const swiperRef = useRef();
    const windowWidth = Dimensions.get('screen').width;
    const windowHeight = Dimensions.get('screen').height;

    const headerHeight = useHeaderHeight();

    const handleChangeIndexValue = ({ index }) => {
        setCurrentIndex(index);
        if (swiperRef)
            swiperRef.current.scrollToIndex({ index: index })
    };

    const FlatListRef = useRef(null);
    const [ViewableItem, SetViewableItem] = useState("");
    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 70 });

    // Viewable configuration
    const onViewRef = useRef((viewableItems) => {
        if (viewableItems?.viewableItems?.length > 0)
            SetViewableItem(viewableItems.viewableItems[0].item._id || 0);
    });

    return (
        <View style={{
            width: windowWidth,
            height: windowHeight - (hp(10.5) + headerHeight),
            // flexGrow:1,
            //     backgroundColor: "green"
        }}>
            {/* <SwiperFlatList
                ref={(ref) => { swiperRef.current = ref }}
                vertical={true}
                onChangeIndex={handleChangeIndexValue}
                data={videoData}
                index={currentIndex}
                renderItem={({ item, index }) => (
                    <SingleReel item={item} index={index} currentIndex={currentIndex} />
                )}
                keyExtractor={(item, index) => item.id}
                contentContainerStyle={{
                    paddingBottom: 20,  
                }}
            /> */}

            <FlatList
                ref={FlatListRef}
                data={videoData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                    <ReelCard
                        item={item}
                        index={index}
                        ViewableItem={ViewableItem}
                        onFinishPlaying={(index) => {
                            if (index !== videoData.length - 1) {
                                // @ts-ignore: Object is possibly 'null'.
                                FlatListRef.current.scrollToIndex({
                                    index: index + 1,
                                });
                            }
                        }}
                    />

                )}
                getItemLayout={(_data, index) => ({
                    length: ScreenHeight - 0,
                    offset: ScreenHeight * index,
                    index,
                })}
                pagingEnabled
                decelerationRate={0.9}
                onViewableItemsChanged={onViewRef.current}
                viewabilityConfig={viewConfigRef.current}
            />
        </View>
    );
};

export default SocialReels;