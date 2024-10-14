import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';

const {width, height} = Dimensions.get('window');

const SplashScreen = ({navigation}: any) => {

  useEffect(() => {
    setTimeout(async () => {
      navigation.navigate('Home');
    }, 3000);
  }, [navigation]);

  return (
    <View style={[styles.container,]}>
      <View
        style={{
          height: '100%',
          width: '100%',
          // flexDirection:'row'
          // flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100,

        }}>
        <Image
          style={{
            zIndex: 100,
            height: 150,
            width: 150,
          }}
          source={require('../assets/location.png')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    height: height,
    width: width,
  },
});

export default SplashScreen;