import React, { useRef, useEffect, useState } from 'react';
import {
  AppState,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  mediaDevices,
  RTCPeerConnection,
  RTCView,
  RTCIceCandidate,
  RTCSessionDescription,
} from 'react-native-webrtc';

import InCallManager from 'react-native-incall-manager';
// import requestCameraAndAudioPermission from '../../components/Permission';
import { COLORS } from '../../theme/color';

import { useSelector } from 'react-redux';
import socket from '../chat/utils/socket';
import { useTranslation } from 'react-i18next';
import { iconHeart, share } from '../../constants/images';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { onShare } from '../../constants/constant';

const LiveStreaming = props => {
  // var socket = useSocket();
  var user;
  var rtcPeerConnections = {};
  let rtcRemoteConnections = {};
  const [localStream, setLocalStream] = useState(null);
  const peerConnection = useRef(null);
  const [localMicOn, setlocalMicOn] = useState(true);
  const [localWebcamOn, setlocalWebcamOn] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [name, setName] = useState('raj');
  const [room, setRoom] = useState('');
  const [broadcasterName, setBroadcasterName] = useState('');
  const [broadcasting, setBroadcasting] = useState(false);
  const [newViewer, setNewViewer] = useState([]);
  const [consultingRoom, setConsultingRoom] = useState(false);
  const [myStream, setMyStream] = useState();
  const [mute, setMute] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [IsBroadCast, setIsBroadCast] = useState(false);
  const [viewerList, setViewerList] = useState([

  ]);
  console.log('viewerList-----', viewerList);
  const [broadcaster, setBroadcaster] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const authUser = useSelector(({ auth }) => auth.data);
  const { t, i18n } = useTranslation();
  const [remoteStream, setRemoteStream] = useState();

  let broadcasterRef = useRef(null);
  const rtcPeerConnectionsRef = useRef({});

  const iceServers = useRef(
    new RTCPeerConnection({
      configuration: {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      },
      iceTransportPolicy: 'all',
      iceCandidatePoolSize: 0,
      rtcpMuxPolicy: 'negotiate',
      iceServers: [
        {
          urls: 'turn:turn.toshavhaham.co.il:443?transport=udp',
          credential: 'toshav',
          username: 'toshav321',
        },
        {
          urls: 'turn:turn.toshavhaham.co.il:443?transport=tcp',
          credential: 'toshav',
          username: 'toshav321',
        },
        { urls: 'stun:turn.l.google.com:19302' },
      ],
      // audio: true,
      // video: true,
    }),
  );
  let roomID = props.route ? props?.route?.params?.data?.roomId : '';
  useEffect(() => {
    if (Platform.OS === 'android') requestCameraPermission();
    // joinBroadcaster()

    setTimeout(() => {
      joinViewer();
    }, 1000)
    return () => { };
  }, []);

  useEffect(() => {
    InCallManager.start();
    InCallManager.setKeepScreenOn(true);
    InCallManager.setForceSpeakerphoneOn(true);

    return () => {
      InCallManager.stop();
    };
  }, []);

  useEffect(() => {
    socket.on('viewerList', (rooms, viewList) => {
      // let roomID = props.route ? props?.route?.params?.data?.roomId : '';
      if (rooms.id === Number(roomID)) {
        console.log(room, roomID);
        setBroadcaster(prevBroadcaster => ({ ...prevBroadcaster, ...rooms }));
        // setRoomViewerList(Object.values(roomViewerList));
        // console.log('Room => ', room)
      }
      console.log('viewList => ', viewList);
      setViewerList(viewList);
    });
    socket &&
      socket.on('endCall', function () {
        EndCall();
      });
  }, []);

  /*
  .##........#######...######...####..######...######.
  .##.......##.....##.##....##...##..##....##.##....##
  .##.......##.....##.##.........##..##.......##......
  .##.......##.....##.##...####..##..##........######.
  .##.......##.....##.##....##...##..##.............##
  .##.......##.....##.##....##...##..##....##.##....##
  .########..#######...######...####..######...######.
  */

  const joinViewer = () => {
    let roomID = props.route ? props?.route?.params?.data?.roomId : '';
    console.log('roomID => ', roomID);
    if (roomID == undefined || roomID == null) {
      alert('Room not found. Please try again later.');
    } else {
      const user = {
        userId: authUser?.user_id,
        room: roomID,
        name: authUser?.first_name + ' ' + authUser?.last_name,
      };

      console.log('routes ROMM ID => ', roomID, user);

      setConsultingRoom(true);
      setIsBroadCast(false);
      setCurrentUser(user);
      console.log('joinViewer => ', user);
      console.log('joinViewer SOCKET => ', socket?.id);
      socket.emit('registerAsViewer', user);
      socket.emit('getViewerList', roomID);

      socket.on('roomDetailGet', function (rooms) {
        console.log('roomDetailGet', rooms, user);

        setRoom(rooms.id);
      });

      socket
        .on('offer', async function (broadcaster, sdp) {
          // setBroadcasterName(broadcaster + ' is broadcasting...');
          console.log('offer broadcaster', broadcaster);
          broadcasterRef.current = broadcaster;
          setBroadcasterName(broadcaster);
          // console.log('broadcaster sdp', sdp);

          rtcPeerConnectionsRef.current[
            broadcaster.socketId
          ] = new RTCPeerConnection(iceServers);
          console.log(
            'rtcPeerConnectionsRef.current[broadcaster.socketId] => ',
            JSON.stringify(rtcPeerConnectionsRef.current[broadcaster.socketId]),
          );
          if (
            rtcPeerConnectionsRef.current[broadcaster.socketId]
              .signalingState === 'have-remote-offer' ||
            rtcPeerConnectionsRef.current[broadcaster.socketId]
              .signalingState === 'stable'
          ) {
            try {
              rtcPeerConnectionsRef.current[
                broadcaster.socketId
              ].setRemoteDescription(sdp);
            } catch (error) {
              console.error('Error setting remote description:', error);
            }
          }
          ``;

          console.log(
            'createAnswer ============',
            rtcPeerConnectionsRef.current[broadcaster.socketId],
          );
          rtcPeerConnectionsRef.current[broadcaster.socketId]
            .createAnswer()
            .then(sessionDescription => {
              // console.log('sessionDescription', sessionDescription);
              rtcPeerConnectionsRef.current[
                broadcaster.socketId
              ].setLocalDescription(sessionDescription);

              //  console.log('joinViewer setLocalDescription =====');
              socket.emit('answer', {
                type: 'answer',
                sdp: sessionDescription,
                room: props?.route?.params?.data?.roomId,
              });
            })
            .catch(e => {
              console.log('createAnswer e', e);
            });

          rtcPeerConnectionsRef.current[
            broadcaster.socketId
          ].ontrack = event => {
            console.log(`setRemoteStream: ${JSON.stringify(event)}`);
            setRemoteStream(event.streams[0]);
          };

          rtcPeerConnectionsRef.current[
            broadcaster.socketId
          ].onicecandidate = event => {
            if (event.candidate) {
              // console.log(
              //   'joinViewer ----------------------------- ice candidate',
              //   event,
              // );
              // socket.emit('candidate', broadcaster.socketId, event.candidate);
              socket.emit('candidate', broadcaster.socketId, {
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate,
              });
            }
          };
        })
        .on('candidate', async function (socketId, event) {
          // console.log('joinViewer ---------------- candidate event', event);
          //  console.log('candidate', socketId);
          var candidate = new RTCIceCandidate({
            sdpMid: event.id,
            sdpMLineIndex: event.label,
            candidate: event.candidate,
          });
          if (candidate)
            rtcPeerConnectionsRef.current[socketId].addIceCandidate(candidate);
        })
        .on('answer', function (viewerId, event) {
          //  console.log('joinViewer ---------------- answer event', event);
          rtcPeerConnectionsRef.current[viewerId].setRemoteDescription(
            new RTCSessionDescription(event),
          );
        });
    }
  };


  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setViewerList(viewerList)
  };

  // console.log('myStream----', myStream);
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const EndCall = async () => {
    remoteStream &&
      remoteStream.getTracks().forEach(track => {
        track.stop();
      });
    remoteStream?.release();
    setRemoteStream(null);
    stopRTCConnections();

    console.log('remoteStream  => ', remoteStream);
    socket.off();
    socket.close();
    setModalVisible(false)
    setTimeout(() => {
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'coupons' }],
      });
    }, 100);
  };

  const stopRTCConnections = async () => {
    console.log('rtcPeerConnectionsRef.current', rtcPeerConnectionsRef.current);
    await Promise.all(
      Object.entries(rtcPeerConnectionsRef.current).map(
        async ([socketId, rtcPeerConnection]) => {
          // Remove tracks and close the connection only if the signaling state is not 'closed'
          if (rtcPeerConnection.signalingState !== 'closed') {
            rtcPeerConnection
              .getSenders()
              .forEach(sender => rtcPeerConnection.removeTrack(sender));
            await rtcPeerConnection.close();
          }

          // Optionally clear the entry for the closed connection
          delete rtcPeerConnectionsRef.current[socketId];
          rtcPeerConnectionsRef.current = {};
        },
      ),
    );

    // setConsultingRoom(false);
    // setRoomViewerList([]);
    // socket.off();
    // socket.close()
  };

  /*
  ..######...#######..##.....##.########...#######..##....##.########.##....##.########..######.
  .##....##.##.....##.###...###.##.....##.##.....##.###...##.##.......###...##....##....##....##
  .##.......##.....##.####.####.##.....##.##.....##.####..##.##.......####..##....##....##......
  .##.......##.....##.##.###.##.########..##.....##.##.##.##.######...##.##.##....##.....######.
  .##.......##.....##.##.....##.##........##.....##.##..####.##.......##..####....##..........##
  .##....##.##.....##.##.....##.##........##.....##.##...###.##.......##...###....##....##....##
  ..######...#######..##.....##.##.........#######..##....##.########.##....##....##.....######.
  */

  const RenderUser = ({ item }) => {
    console.log('item live--------->', item);
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
          }}
        >
          <View>
            <Image
              source={
                item.business_logo
                  ? { uri: item.business_logo }
                  : { uri: item.profile_pic }
                    ? { uri: item.profile_pic }
                    : require('../../assets/images/default_user.png')
              }

              style={{
                height: 15,
                width: 15,
                borderRadius: 16
              }}
            />
          </View>
          <Text
            style={{
              color: '#000',
              marginLeft: 20,
              fontSize: 15,
            }}
          >
            {item.business_name
              ? `${item.business_name}`
              : `${item.first_name} ${item.last_name} `}

          </Text>
        </View>
      </>
    );
  };

  const WebRtcScreen = () => {
    console.log('remoteStream =>', remoteStream?.toURL());
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.LiveView}>
            <Text style={styles.liveText}>• Live</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
              }}
              style={styles.infoContainer}
            >
              <Image
                source={require('../../assets/images/eye.png')}
                style={{
                  height: 15,
                  width: 15,
                  resizeMode: 'cover',
                }}
              />
              <Text style={styles.UserCountText}>{viewerList?.length}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.CloseBtn} onPress={EndCall}>
              <Image
                source={require('../../assets/images/close.png')}
                style={{
                  height: 12,
                  width: 12,
                  tintColor: '#000',
                }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <RTCView
          streamURL={remoteStream?.toURL()}
          style={styles.camera}
          objectFit={'cover'}
        />

        <View style={styles.controls}>
          {/* <TouchableOpacity
            style={{
              backgroundColor: COLORS.textPlaceHolder,
              padding: 5,
              borderRadius: 8,
       
              alignItems: "center",
              justifyContent: "center",
              flexDirection: 'row'
            }}
            onPress={() => {
              const lastPath = `LiveStreamingViewer/${roomID}`
              onShare('test', lastPath)
            }}  >
            <Image
              source={share}
              style={{
                width: 20,
                height: 20,
                // marginBottom: 5,
                tintColor: '#000'
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.textPlaceHolder,
              paddingHorizontal: 5,
              borderRadius: 8,
              marginLeft:5,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
            
            }}  >
            <Image
              source={iconHeart}
              style={{
                width: 20,
                height: 20,
                tintColor: '#000'
              }}
            />
          </TouchableOpacity> */}
          {/* <TouchableOpacity style={styles.toggleButton} onPress={CameraOnOff}>
            {localWebcamOn ? (
              <Image
                source={require('../../assets/images/video-camera.png')}
                style={{
                  height: 20,
                  width: 20,
                }}
              />
            ) : (
              <Image
                source={require('../../assets/images/no-video.png')}
                style={{
                  height: 20,
                  width: 20,
                }}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.toggleButton} onPress={MuteUnmute}>
            {localMicOn ? (
              <Image
                source={require('../../assets/images/mic.png')}
                style={{
                  height: 20,
                  width: 20,
                }}
              />
            ) : (
              <Image
                source={require('../../assets/images/mic-off.png')}
                style={{
                  height: 20,
                  width: 20,
                }}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.toggleButton} onPress={switchCamera}>
            <Image
              source={require('../../assets/images/switch-camera.png')}
              style={{
                height: 20,
                width: 20,
              }}
            />
          </TouchableOpacity> */}
        </View>
        {isModalVisible && (
          <Modal
            transparent={true}
            animationType="slide"
            visible={isModalVisible}
            onRequestClose={toggleModal}
          >
            <TouchableWithoutFeedback
            //onPress={toggleModal}
            >
              <View style={styles.outerContainer}>
                <View style={styles.modalContainer}>
                  <View style={{
                    // flexDirection: "row",
                    // alignItems: "center",
                    // marginTop: 20,
                  }}>
                    {/* <TextInput
                      value={searchQuery}
                      onChangeText={(text) => {
                        setSearchQuery(text)
                        setViewerList(viewerList?.filter(v => v.first_name.toLowerCase().includes(text.toLowerCase())))
                      }}
                      placeholder={t("common:search")}
                      style={{
                        height: Platform.OS === 'ios' ? 30 : heightPercentageToDP(6),
                        paddingVertical: Platform.OS === 'ios' ? 0 : 0,
                        textAlignVertical: 'center',
                        backgroundColor: "red",
                        borderRadius: 16,
                        width: '90%'
                      }}
                      cursorColor={COLORS.text}
                      clearButtonMode='while-editing'
                    /> */}

                    <TouchableOpacity
                      onPress={toggleModal}
                      style={{
                        alignItems: 'flex-end',
                        marginTop: 20,
                        // marginLeft: 10
                      }}
                    >
                      <Image
                        source={require('../../assets/images/close.png')}
                        style={{
                          height: 20,
                          width: 20,
                          tintColor: '#000',
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  {/* Your modal content goes here */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 10,
                    }}
                  >
                    <View>
                      <Image
                        source={require('../../assets/images/default_user.png')}
                        style={{
                          height: 15,
                          width: 15,
                        }}
                      />
                    </View>
                    <Text
                      style={{
                        color: '#000',
                        marginLeft: 20,
                        fontSize: 15,
                        fontWeight: 'bold',
                      }}
                    >
                      {broadcaster.first_name} {broadcaster.last_name} is
                      broadcasting...
                    </Text>
                  </View>
                  <FlatList
                    data={viewerList}
                    renderItem={RenderUser}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
      </View>
    );
  };

  return (
    <>
      {/* {consultingRoom ? <WebRtcScreen /> : JoinScreen()} */}
      {WebRtcScreen()}
    </>
  );
};

/*
..######..########.##....##.##.......########..######.
.##....##....##.....##..##..##.......##.......##....##
.##..........##......####...##.......##.......##......
..######.....##.......##....##.......######....######.
.......##....##.......##....##.......##.............##
.##....##....##.......##....##.......##.......##....##
..######.....##.......##....########.########..######.
*/

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    // backgroundColor: '#fff',
  },
  CloseBtn: {
    backgroundColor: COLORS.textPlaceHolder,
    padding: 8,
    borderRadius: 34,
    marginLeft: 10,
  },
  camera: {
    height: '100%',
    width: '100%',
  },
  controls: {
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row',
    right: 20,
  },
  toggleButton: {
    backgroundColor: COLORS.textPlaceHolder,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 5,
    marginLeft: 10,
  },
  toggleButtonText: {
    fontSize: 16,
    color: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
    zIndex: 5,
    position: 'absolute',
    width: '100%',
    top: 25,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.textPlaceHolder,
    paddingHorizontal: 10,
    borderRadius: 18,
  },
  UserCountText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 5,
  },
  customUIContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  customUIText: {
    color: COLORS.textDark,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '700',
  },
  LiveView: {
    backgroundColor: 'red',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  liveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerContainer: {
    flex: 1,
    // justifyContent: 'flex-end',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    height: '25%',
    width: '100%',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 0,
  },
});
export default LiveStreaming;
