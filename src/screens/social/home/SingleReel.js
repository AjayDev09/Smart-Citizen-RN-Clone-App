import React, { useRef, useState } from 'react'
import { Dimensions, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Video from 'react-native-video';
import { useHeaderHeight } from '@react-navigation/elements';
import { iconChatBubble, iconHeart, iconHeartFill } from '../../../constants/images';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';

const TOP_BOTTOM_MARGIN = 180
const SingleReel = ({ item, index, currentIndex }) => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  // console.log('windowWidth', windowWidth)
  // console.log('windowHeight', Dimensions.get('window').height, Dimensions.get('screen').height)
  //  console.log('StatusBar.currentHeight', StatusBar.currentHeight)

  const [mute, setMute] = useState(false);
  const [like, setLike] = useState(item.isLiked);

  const videoRef = useRef(null);

  const headerHeight = useHeaderHeight();
  // console.log('headerHeight', headerHeight)


  const onBuffer = buffer => {
    console.log('buffring', buffer);
  };
  const onError = error => {
    console.log('error', error);
  };
  console.log('index', item.post)
  return (
    <View key={index} style={{
      width: windowWidth,
      height: windowHeight,
      position: 'relative',
      // backgroundColor: 'green',
      display: 'flex',
      flexDirection: 'column'
    }}>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          console.log('item.post_type', item.post_type)
          setMute(!mute)
        }}
        style={{
          width: '100%',
          height: windowHeight - (hp(15) + 50),
          //position: 'absolute',
          //  alignItems: 'center',
        }}>
        {
          item.post_type === 2 ?
            <View
              style={{
                position: 'relative',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <Video
                videoRef={videoRef}
                onBuffer={onBuffer}
                onError={onError}
                repeat={true}
                resizeMode="cover"
                paused={currentIndex == index ? false : true}
                source={{ uri: item.post }}
                muted={mute}
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </View>
            : <View
              style={{
                position: 'relative',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <FastImage style={{ width: '100%', height: '100%', }}
                source={{
                  uri: item.post ? item.post : "",
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            </View>
        }
      </TouchableOpacity>

      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          height: 50,
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 2,
          paddingVertical: 5,
          backgroundColor: "#fff",
          alignSelf: 'flex-end'
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => setLike(!like)}>
            <Image
              source={like ? iconHeartFill : iconHeart}
              style={{ width: 20, height: 20, }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={iconChatBubble}
              style={{ width: 20, height: 20, }}
            />
          </TouchableOpacity>
          {/* <TouchableOpacity>
            <Feather name="navigation" style={{ fontSize: 20 }} />
          </TouchableOpacity> */}
        </View>
        {/* <Feather name="bookmark" style={{ fontSize: 20 }} /> */}
      </View>

    </View>
  )
}

export default SingleReel

const styles = StyleSheet.create({})