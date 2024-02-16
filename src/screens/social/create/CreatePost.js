import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert, Platform, TextInput, Keyboard, KeyboardAvoidingView, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import { useDispatch, useSelector } from 'react-redux';
import { gallery } from '../../../constants/images';
import { COLORS } from '../../../theme';
import { IsRightOrLeft, ShowErrorToast, ShowToast, isImageByType } from '../../../utils/common';
import { addPost } from '../../../redux/actions/socialActions';
import { useTranslation } from 'react-i18next';
import { createFileUriFromContentUri } from '../../../constants/constant';
import { RFValue } from 'react-native-responsive-fontsize';
import { useHeaderHeight } from '@react-navigation/elements';
import { ImageCompressor, VideoCompressor } from '..';
import { getRealPath, getVideoMetaData } from 'react-native-compressor';
import CustomSocialHeader from '../CustomSocialHeader';
import { useNavigation } from '@react-navigation/native';



// import 'react-native-get-random-values';
// import { v4 as uuidv4 } from "uuid";
//import Context from '../../context';
// import { storage, storageRef, uploadBytesResumable, getDownloadURL, database, databaseRef, databaseSet } from "../../firebase";

const CreatePost = ({ SocialSelectedTab, setSocialSelectedTab }) => {
  //const loading = false
  const navigation = useNavigation()

  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const authUser = useSelector(({ auth }) => auth.data);

  const { t, i18n } = useTranslation();

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNext, setIsNext] = useState(false);
  const [AddCaption, setCaption] = useState("")
  const user = useSelector(({ auth }) => auth.data);

  const [compressedVideo, setCompressedVideo] = useState();

  // const { user, setUser, setHasNewPost } = useContext(Context);
  // console.log('authUser.user_id', authUser.user_id)

 // console.log('authUser.token', authUser.token)

  const showMessage = (title, message) => {
    Alert.alert(
      title,
      message
    );
  };

  const uploadPost = () => {
    const options = {
      mediaType: 'mixed'
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        return null;
      } else if (response.assets && response.assets.length) {
        const file = response?.assets && response.assets[0];
        const uri = file.uri; //Platform.OS === 'android' ? uri : uri.replace('file://', '')
        const fileName = file.fileName; //
        const type = file.type;
        console.log('fileName', fileName)
        if (uri && fileName) {
          const fileObject = {
            name: fileName,
            uri: uri,
            type: type
          };
          setPost(() => file);
        }
      }
    });
  };

  const buildPost = ({ id, content }) => {
    return { id, content, likes: [], nLikes: 0, postCategory: post.type.includes('image') ? 1 : 2, author: { id: user.id, fullname: user.fullname, avatar: user.avatar } }
  }

  const createPost0 = async () => {
    if (!post) {
      showMessage('Error', 'Please upload your post image or video');
      return;
    }
    // setIsLoading(true);
    // const storageImageRef = storageRef(storage, `posts/${post.name}`);
    // const localFile = await fetch(post.uri);
    // const fileBlob = await localFile.blob();
    // const uploadTask = uploadBytesResumable(storageImageRef, fileBlob, { contentType: post.type });
    // uploadTask.on('state_changed',
    //   (snapshot) => {
    //   },
    //   (error) => {
    //     setPost(null);
    //     setIsLoading(false);
    //     showMessage('Error', 'Failure to create your post, please try again');
    //   },
    //   async () => {
    //     const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
    //     if (downloadUrl) {
    //       const uuid = uuidv4();
    //       const createdPost = buildPost({ id: uuid, content: downloadUrl });
    //       databaseSet(databaseRef(database, 'posts/' + uuid), createdPost);
    //       user.nPosts = user.nPosts ? user.nPosts + 1 : 1;
    //       databaseSet(databaseRef(database, 'users/' + user.id), user);
    //       setUser(user);
    //       setIsLoading(false);
    //       setPost(null);
    //       setHasNewPost(true);
    //       showMessage('Info', "You post was created successfully");
    //       navigation.navigate('Home');
    //     }
    //   }
    // );




    setLoading(true)
    const data = new FormData();
    const url = post ?
      Platform.OS === 'android' && post.type === 'video/mp4' ?
        await createFileUriFromContentUri(post.uri) :
        post.uri : ''
    const fileName = post ? Platform.OS === 'android' && post.type === 'video/mp4' ?
      `${post.name}.mp4` : post.name : ''

    data.append('post', {
      name: fileName,
      type: post.type,
      uri: Platform.OS === 'ios' ? post.uri.replace('file://', '') : url,
    });
    console.log('post.type', post.type)
    data.append('post_type', post.type === 'video/mp4' ? 2 : 1);
    dispatch(addPost(data, authUser.token))
      .then((res) => {
        if (res.status === 200) {
          setTimeout(() => {
            console.log('addPost res', res.data)
            setLoading(false)
            ShowToast(res.message)
            setSocialSelectedTab(0)
          }, 1000);
        }
      }).catch((error) => {
        // console.log('error', error)
        setLoading(false)
        ShowErrorToast(error)
      })
  };



  

  const createPost = async () => {
    setLoading(true)

    //testCompress()
    //return

    console.log('post.uri', post.type === 'video/mp4' ? "video" : "image")

    // const realPath =  await getRealPath(post.uri.replace('file:///', ''), post.type === 'video/mp4'? "video": "image");
    // console.log('metaData', realPath)
    //  const metaData = await getVideoMetaData(realPath);

    // const compressedSource = await compressFile(
    //   CompressFileType.IMAGE,
    //   'https://picsum.photos/500'
    // );
    const result = post.type === 'video/mp4' ?
      await VideoCompressor.compress(post.uri, {
        compressionMethod: "auto",
      },
        (progress) => {
          console.log({ compression: progress });
        }
      ).then(async (compressedFileUrl) => {
        // do something with compressed video file
        console.log('compressedFileUrl', compressedFileUrl)
        postData(compressedFileUrl)

      }) :
      await ImageCompressor.compress(post.uri, {
        compressionMethod: "auto",
      },
        (progress) => {
          console.log({ compression: progress });
        }
      ).then(async (compressedFileUrl) => {
        // do something with compressed image file
        console.log('compressedFileUrl', compressedFileUrl)
        postData(compressedFileUrl)
      });

    console.log('result', result)


  }




  const postData = async compressedFileUrl => {
    console.log('isImageByType >> ', isImageByType(post.type))

    const url = post ?
      Platform.OS === 'android' && post.type === 'video/mp4' ?
        await compressedFileUrl :    //createFileUriFromContentUri(compressedFileUrl)
        compressedFileUrl : ''
    const params = {
      image: post,
      post_type: isImageByType(post.type) ? 1 : 2,
      description: AddCaption,
    }
    const data = new FormData();
    const fileName = post ? Platform.OS === 'android' && post.type === 'video/mp4' ? 'video.mp4' : post.fileName : ''
    Object.keys(params).forEach(key => {
      if (key === 'image') {
        if (post) {
          data.append('post', {
            name: fileName,
            type: post.type,
            uri: Platform.OS === 'ios' ? post.uri.replace('file://', '') : url,
          });
          // data.append("post", compressedFileUrl)
        } else {
          data.append(key, params[key]);
        }
      } else {
        data.append(key, params[key]);
      }
    });
    console.log('params', params)

    setLoading(true)
    dispatch(addPost(data, authUser.token))
      .then((res) => {
        if (res.status === 200) {
          setTimeout(() => {
            console.log('addPost res', res.data)
            setLoading(false)
            ShowToast(res.message)
            setSocialSelectedTab(0)
          }, 1000);
        }
      }).catch((error) => {
        console.log('error', error)
        setLoading(false)
        ShowErrorToast(error)
      })
  }




  const testCompress = async () => {
    if (!post) return;
    try {
      const realPath = await getRealPath(post.uri, 'video');
      const dstUrl = await VideoCompressor.compress(
        post.uri,
      );
      console.log({ dstUrl }, 'compression result');
      setCompressedVideo(dstUrl);
      progressRef.current?.setProgress(0);
    } catch (error) {
      console.log({ error }, 'compression error');
      setCompressedVideo(sourceVideo);
      progressRef.current?.setProgress(0);
    }
  };

  const customCaption = () => {
    return <ScrollView contentContainerStyle={{ flexGrow: 1, flex: 1, }}
      keyboardShouldPersistTaps='handled'
    >
      <TextInput
        placeholder={t('common:postCreateMsg')}
        style={[styles.itemText, {
          borderBottomWidth: 0, color: '#fff',
          paddingBottom: Platform.OS === 'ios' ? 0 : 8,
          display: 'flex',
          fontSize: RFValue(16),
          textAlign: IsRightOrLeft(i18n.language),
          marginTop: 20,
          alignItems: 'flex-start',
        }]}
        keyboardType={'default'}
        value={AddCaption}
        multiline={true}
        numberOfLines={2}
        maxLength={500}
        onChangeText={(text) => setCaption(text)}
        placeholderTextColor={"#fff"}
        // returnKeyType="done"
        onBlur={() => {
          Keyboard.dismiss();
        }}
      //blurOnSubmit={true}
      />
    </ScrollView>
  }

  const renderUploadedContent = () => {
    if (!post) {
      return (
        <TouchableOpacity style={styles.uploadContainer} onPress={uploadPost}>
          <Image style={styles.uploadImageIcon} source={gallery} />
          <Text style={styles.uploadImageTitle}>{t("common:post_upload_msg")}</Text>
        </TouchableOpacity>
      );
    }
    if (post && post.type && post.type.includes('image')) {
      return (
        <TouchableOpacity style={styles.postContainer} onPress={uploadPost}>
          <Image style={styles.postContent} source={{ uri: post.uri }} />
        </TouchableOpacity>
      );
    }
    if (post && post.type && post.type.includes('video')) {
      console.log('post', post)
      if (Platform.OS === 'ios') {
        return (
          <View style={styles.videoContainer}>
            <Video
              style={styles.videoElement}
              shouldPlay
              muted={true}
              source={{ uri: post.uri }}
              allowsExternalPlayback={false} />
            <TouchableOpacity style={styles.videoOverlay} onPress={uploadPost} />
          </View>
        );
      }
      return (
        <View style={styles.videoContainer}>
          <VideoPlayer
            autoplay
            repeat
            showOnStart={false}
            style={styles.videoElement}
            source={{ uri: post.uri }}
          />
          <TouchableOpacity style={styles.videoOverlay} onPress={uploadPost} />
        </View>
      );
    }
    return <></>;
  }
  const nextRenderUploadedContent = () => {
    if (post && post.type && post.type.includes('image')) {
      return (
        <View
          style={[styles.postContainer, { alignItems: 'flex-start', width: "100%", padding: 16 }]}
        // onPress={uploadPost}
        >
          <TouchableOpacity onPress={uploadPost}>
            <Image style={styles.uploadImageIcon} source={{ uri: post.uri }} />
          </TouchableOpacity>
          {customCaption()}
        </View>
      );
    }
    if (post && post.type && post.type.includes('video')) {
      // console.log('post', post)
      if (Platform.OS === 'ios') {
        return (
          <View style={[styles.videoContainer, { alignItems: 'flex-start', padding: 16 }]}>
            <TouchableOpacity onPress={uploadPost}>
              <Video
                style={styles.uploadImageIcon}
                shouldPlay
                muted={true}
                source={{ uri: post.uri }}
                allowsExternalPlayback={false} />
            </TouchableOpacity>
            {customCaption()}
            {/* <TouchableOpacity style={styles.videoOverlay} onPress={uploadPost} /> */}
          </View>
        );
      }
      return (
        <View style={[styles.videoContainer, { alignItems: 'flex-start', padding: 16 }]}>
          <TouchableOpacity style={styles.uploadImageIcon} onPress={uploadPost}>
            <VideoPlayer
              autoplay
              repeat
              showOnStart={false}
              style={styles.uploadImageIcon}
              source={{ uri: post.uri }}
            />
          </TouchableOpacity>
          {customCaption()}
          {/* <TouchableOpacity style={styles.videoOverlay} onPress={uploadPost} /> */}
        </View>
      );
    }
    return <></>;
  }

  const onBackPress = () =>{
    if(SocialSelectedTab === 0){
      navigation.goBack()
    }else{
      setSocialSelectedTab(0)
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }
  const headerHeight = useHeaderHeight();
  const name = t("navigate:postCreate") 
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={headerHeight - 10}
      style={styles.container}>
        <CustomSocialHeader title={name} onBackPress={onBackPress}/>
      {isNext ?
        nextRenderUploadedContent()
        : renderUploadedContent()}
      {
        isNext ? <View style={{
          width: '100%', display: 'flex', flexDirection: "row", alignItems: 'center',
          justifyContent: 'center'
        }}>
          <TouchableOpacity style={styles.uploadBtn} onPress={() => { setIsNext(false) }}>
            <Text style={styles.uploadTxt}>{t("common:go_back")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadBtn} onPress={createPost}>
            <Text style={styles.uploadTxt}>{t("common:create_post")}</Text>
          </TouchableOpacity>
        </View> :
          <View style={{
            width: '100%', display: 'flex', flexDirection: "row", alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TouchableOpacity style={styles.uploadBtn} onPress={() => {
              if (!post) {
                showMessage('', t("common:post_error_msg"));
                return;
              }
              setIsNext(true)
            }}>
              <Text style={styles.uploadTxt}>{t("common:next")}</Text>
            </TouchableOpacity>
          </View>

      }



    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  uploadContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  uploadImageIcon: {
    width: 96,
    height: 96
  },
  uploadImageTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    paddingVertical: 16,
    color: COLORS.text
  },
  postContainer: {
    flex: 1,
    display: 'flex',
  },
  postContent: {
    flex: 1,
    aspectRatio: 1,
    resizeMode: 'contain'
  },
  videoContainer: {
    flex: 1,
    left: 0,
    width: "100%",
    //position: 'absolute',
    right: 0,
    top: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  videoElement: {
    flex: 1,
    width: "100%",
  },
  videoElementPreview: {
    height: 150,
    width: "50%",
    backgroundColor: "#000"
  },
  videoOverlay: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    backgroundColor: 'transparent',
    right: 0,
    top: 0,
  },
  uploadBtn: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    display: 'flex',
    fontWeight: 'bold',
    height: 56,
    justifyContent: 'center',
    margin: 16,
    marginBottom: 24,
    left: 0,
    right: 0,
    bottom: 0
  },
  uploadTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default CreatePost;