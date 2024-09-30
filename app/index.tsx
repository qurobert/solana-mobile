import {StyleSheet, View, Button, TouchableOpacity} from 'react-native';
import 'react-native-get-random-values';
import * as Location from 'expo-location';
import React, {useRef, useState} from "react";

import {
  CameraView,
  CameraType,
  useCameraPermissions,
} from 'expo-camera';

export default function HomePage() {
  const [facing, setFacing]             = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef                       = useRef(null); // Ref to the camera

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (

      <View style={styles.container}>
        <View style={styles.boxGranted}>
          <Button onPress={requestPermission} title="Access to camera" />
        </View>
      </View>
    );
  }
  async function getCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return null;
    }

    let location = await Location.getCurrentPositionAsync({});
    return location;
  }

  async function toDataURL(url: string) {
    const blob = await fetch(url).then(res => res.blob());
    return URL.createObjectURL(blob);
  }

  async function download(uri: string, location: Location.LocationObject | null = null) {
    const a = document.createElement("a");
    a.href = await toDataURL(uri);
    a.download = `nft_lat-${location?.coords.latitude}_longitude-${location?.coords.longitude}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }


  async function capture() {
      if (cameraRef.current) {
        try {

          // @ts-ignore
          const photo = await cameraRef.current.takePictureAsync();

          const location = await getCurrentLocation();

          // Get current location
          if (!location) {
            console.error('Location refused');
          }
          await download(photo.uri, location);

          // Generate a new wallet
          // ...

        } catch (error) {
          console.error('Failed for full process:', error);
        }
      }
    }

  return (
    <View style={styles.container}>

      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonCapture} onPress={capture}>
            <svg xmlns="http://www.w3.org/2000/svg"
                 viewBox="0 0 512 512"
                 style={{width: 64, height: 64, fill: 'white'}}
            >
              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"/>
            </svg>
          </TouchableOpacity>
        </View>

      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  littleContainer: {
    maxWidth: '100%',
  },
  boxGranted: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },


  camera: {
    flex: 1,
  },

  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },

  buttonFlip: {
    flex: 1,
    alignItems: 'center',
  },

  buttonCapture: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },

  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },

  imagePreview: {
    padding: 20,
    alignItems: 'center',
  },
});
