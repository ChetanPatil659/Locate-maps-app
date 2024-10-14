import React, { useRef, useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, Animated, StyleSheet, Alert } from 'react-native';
import { usePlaces } from '../context/locationContext';

const Menu = ({navigation}: any) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const {destination, setPlaces, places} = usePlaces()

  // Create animated values for each button
  const animation1 = useRef(new Animated.Value(0)).current;
  const animation2 = useRef(new Animated.Value(0)).current;
  const animation3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isMenuOpen) {
      // Sequence of animations with slight delay
      Animated.stagger(100, [
        Animated.timing(animation1, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(animation3, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Hide buttons when menu closes
      Animated.stagger(100, [
        Animated.timing(animation3, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(animation2, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(animation1, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isMenuOpen]);

  // Interpolation for Y-axis movement (move upwards from behind)
  const translateY1 = animation1.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0], // Starts 50 units lower
  });

  const translateY3 = animation3.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0], // Starts 50 units lower
  });

  const onLike = () => {
    if(!destination) {
      Alert.alert('Error', 'Please select a location to add to favorites');
      return;
    } else {

      setPlaces([
        {
          description: `Chetan's Home`,
          geometry: { location: { lat: destination.latitude, lng: destination.longitude, } },
        },
        ...places
      ])

      Alert.alert('Added to favorites', 'You can view your favorites in the favorites tab');
      console.log('like', destination);
      
    }
  }

  const onLocation = () => {
    navigation.navigate('Locations');
    console.log('location');
  }



  return (
    <View style={{ alignItems: 'flex-start', justifyContent: 'center', flexDirection: 'row', paddingTop: 15, position: 'relative', top:0}}>
      {/* Hamburger Menu Icon */}
      <TouchableOpacity onPress={() => setIsMenuOpen(!isMenuOpen)} style={styles.menuIconContainer}>
        {
          isMenuOpen ? (
            <Image source={require('../assets/close.png')} style={styles.menuIcon} />
          ) : (
            <Image source={require('../assets/menu.png')} style={styles.menuIcon} />
          )
        }
        {/* <Image source={require('../assets/menu.png')} style={styles.menuIcon} /> */}
      </TouchableOpacity>

      {/* Animated buttons */}
      {isMenuOpen && (
        <View style={styles.buttonContainer}>
          <Animated.View style={{ ...styles.animatedButton, transform: [{ translateY: translateY3 }] }}>
            <TouchableOpacity style={styles.menuButton} onPress={onLocation}>
              <Image source={require('../assets/location.png')} style={styles.iconStyle} />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ ...styles.animatedButton, transform: [{ translateY: translateY1 }] }}>
            <TouchableOpacity style={styles.menuButton} onPress={onLike}>
              <Image source={require('../assets/plus.png')} style={styles.iconStyle} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  menuConmenuContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 30,
    elevation: 5,
    position: 'relative',
  },
  menuIconContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 10,
  },
  menuIcon: {
    width: 30,
    height: 30,
  },
  buttonContainer: {
    alignItems: 'center',
    position: 'absolute',
    top:75,
  },
  animatedButton: {
    marginBottom: 10,
  },
  menuButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  iconStyle: {
    width: 30,
    height: 30,
  },
});

export default Menu;
