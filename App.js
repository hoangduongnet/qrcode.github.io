// Barcode and QR Code Scanner using Camera in React Native
// https://aboutreact.com/react-native-scan-qr-code/

// import React in our code
import React, {useEffect, useState} from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  Image,
  Text,
  View,
  Linking,
  TouchableHighlight,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
  BackHandler
} from 'react-native';

// import qr code scanner




// import CameraKitCameraScreen
import {CameraKitCameraScreen} from 'react-native-camera-kit';

// Import Image Picker
// import ImagePicker from 'react-native-image-picker';

const App = () => {
  // const [isPermitted, setIsPermitted] = useState(false);
  // const [captureImages, setCaptureImages] = useState([]);
  const [qrvalue, setQrvalue] = useState('');
  const [opneScanner, setOpneScanner] = useState(false);
  // pick images
  // const [filePath, setFilePath] = useState({});

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [jwt, setJwt] = useState([])

  useEffect(() => {
    // get jwt
    const fetchData = async () => {
      await fetch('https://35.240.216.132:1337/auth/local',{
        method: 'POST',
        body: {
          identifier: 'tlu_qrcode@tlu.edu.vn',
          password: 'tluqrcode@2020',
        }
      })
      .then((response) => response.json())
      .then((jwt) => {
        setJwt(jwt)
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  
     

    }

  }, []);

  const onOpenlink = () => {
    // If scanned then function to open URL in Browser
    Linking.openURL(qrvalue);
  };

  const onBarcodeScan = (qrvalue) => {
    // Called after te successful scanning of QRCode/Barcode
    setQrvalue(qrvalue);
    setOpneScanner(false);

    fetch(`https://35.240.216.132:1337/student?student_code_in=${qrvalue}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authoriation: jwt
      }
    })
      .then((response) => response.json())
      .then((json) => {
        setData(json.movies);
        console.log(data);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));

  };

  const onOpneScanner = () => {
    // To Start Scanning
    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'App needs permission for camera access',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            // If CAMERA Permission is granted
            setQrvalue('');
            setOpneScanner(true);
          } else {
            alert('CAMERA permission denied');
          }
        } catch (err) {
          alert('Camera permission err', err);
          console.warn(err);
        }
      }
      // Calling the camera permission function
      requestCameraPermission();
    } else {
      setQrvalue('');
      setOpneScanner(true);
    }
  };



  // cancel button

  // const onBottomButtonPressed = (event) => {
    
  //   if (event.type === 'left') {
  //     setIsPermitted(false);
  //   } else if (event.type === 'right') {
  //     setIsPermitted(false);
  //     setCaptureImages(images);
  //   } else {
  //     Alert.alert(
  //       event.type,
  //       images,
  //       [{text: 'OK', onPress: () => console.log('OK Pressed')}],
  //       {cancelable: false},
  //     );
  //   }
  // };

  return (
    <SafeAreaView style={{flex: 1}}>
      {opneScanner ? (
        <View style={{flex: 1}} {...this.props}>
          <CameraKitCameraScreen

            // Buttons to perform action done and cancel
            // Buttons to perform action done and cancel
            // actions={{
            //   rightButtonText: 'Done',
            //   leftButtonText: 'Cancel'
            // }}
            // onBottomButtonPressed={
            //   (event) => onBottomButtonPressed(event)
            // }
            
            cameraFlipImage={require('./assets/flip.png')}

            showFrame={true}
            // Show/hide scan frame
            scanBarcode={true}
            // Can restrict for the QR Code only
            laserColor={'#FF3D00'}
            // Color can be of your choice
            frameColor={'#00C853'}
            // If frame is visible then frame color
            colorForScannerFrame={'black'}
            // Scanner Frame color
            onReadCode={(event) =>
              onBarcodeScan(event.nativeEvent.codeStringValue)

            
              
            }
          />
        </View>
      ) : (
        <View style={styles.container}>
          <Image
        style={styles.logo}
        source={require('./Images/logo.png')}
        />

          <Text style={styles.titleText}>
            QR Code K62 TLU
          </Text>
          <Text style={styles.textStyle}>
            {qrvalue ? 'Ket Qua Kiem Tra: ' + '\n' + qrvalue : ''}
          </Text>
          {qrvalue.includes('https://') ||
          qrvalue.includes('http://') ||
          qrvalue.includes('geo:') ? (
            <TouchableHighlight onPress={onOpenlink}>
              <Text style={styles.textLinkStyle}>
                {
                  qrvalue.includes('geo:') ?
                  'Open in Map' : 'Hiển Thị Thông Tin Sinh Viên'
                }
              </Text>
            </TouchableHighlight>
          ) : null}
          <TouchableHighlight
            onPress={onOpneScanner}
            style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>
              Open Camera
            </Text>
          </TouchableHighlight>

                {/*  */}
                
                

          

               

        </View>
      )}
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginBottom: 40
  },
  titleText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textStyle: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
    marginTop: 20,
  },
  buttonStyle: {
    fontSize: 16,
    color: 'white',
    backgroundColor: '#FA58D0',
    padding: 5,
    minWidth: 250,
    marginTop: 20
  },
  buttonTextStyle: {
    padding: 5,
    color: 'white',
    textAlign: 'center',
  },
  textLinkStyle: {
    color: 'blue',
    paddingVertical: 20,
  },
});