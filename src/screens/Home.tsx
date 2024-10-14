import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
  Button,
  Dimensions,
  Text,
} from 'react-native';
// import MapView, { Marker, Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { getDistance } from 'geolib';
import DestinationButton from '../components/DestinationButton';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';
import { usePlaces } from '../context/locationContext';
import Menu from '../components/Menu';
import MapView, { Marker, Polyline } from 'react-native-maps';

const { height, width } = Dimensions.get('window');

export default function Home({navigation}: any) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [destination, setDestination] = useState(null);
  const [isChoosingDestination, setIsChoosingDestination] = useState(false);
  const { destination ,setDestination, places, setPlaces } = usePlaces();
  const mapRef = useRef(null);

  const defaultLocation = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  console.log(location);
  

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        setLoading(false);
      },
      (error) => {
        Alert.alert(
          'Error',
          `Failed to get your location: ${error.message}` +
          ' Make sure your location is enabled.'
        );
        console.log(error, 'error');

        setLocation(defaultLocation);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'This app needs access to your location',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getCurrentLocation();
          } else {
            Alert.alert(
              'Permission Denied',
              'Location permission is required to show your current location on the map.'
            );
            setLocation(defaultLocation);
            setLoading(false);
          }
        } catch (err) {
          console.warn(err);
          setLocation(defaultLocation);
          setLoading(false);
        }
      } else {
        getCurrentLocation();
      }
    };

    requestLocationPermission();
  }, []);

  const handleMapPress = (e) => {
    const coordinate = e.nativeEvent.coordinate;
    // if (isChoosingSource) {
    //   setSource(coordinate);
    //   setIsChoosingSource(false);
    if (isChoosingDestination) {
    setDestination(coordinate);
    setIsChoosingDestination(false);
    }
  };

  const removeDestination = () => {
    setDestination(null);
  };

  const zoomToMarker = (marker) => {
    if (mapRef.current && marker) {
      mapRef.current.animateToRegion({
        latitude: marker.latitude,
        longitude: marker.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  // const predefinedPlaces = [
  //   {
  //     description: 'Empire State Building',
  //     geometry: { location: { lat: 40.748817, lng: -73.985428 } },
  //   },
  //   {
  //     description: 'Statue of Liberty',
  //     geometry: { location: { lat: 40.689247, lng: -74.044502 } },
  //   },
  //   {
  //     description: `Chetan's Home`,
  //     geometry: { location: {lat: 23.2671976, lng: 77.4626481,} },
  //   }
  // ];

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: width,
            paddingHorizontal: 10,
            position: 'absolute',
            top: 0,
            zIndex: 20,
            elevation: 5
          }}>
            <Menu navigation={navigation}/>
            <GooglePlacesAutocomplete
              placeholder="Search"
              onPress={(data, details = null) => {
                console.log(data, details);
                setDestination({
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                });
              }}
              query={{
                key: 'AIzaSyDvPLKp3jbXqZnybV92qe2wbJ4DWptExM4',
                language: 'en',
              }}
              textInputProps={{
                placeholderTextColor: 'gray',
              }}
              styles={{
                container: {
                  flex: 1, // Adjusts the search bar width dynamically
                  alignSelf: 'center',
                },
                textInputContainer: {
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  padding: 8,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 5,
                  elevation: 4,
                  marginLeft: 10, // Space between menu and search bar
                },
                textInput: {
                  backgroundColor: '#fff',
                  height: 40,
                  borderRadius: 8,
                  paddingVertical: 5,
                  paddingHorizontal: 15,
                  fontSize: 16,
                  color: '#333',
                },
                poweredContainer: {
                  display: 'none',
                },
                listView: {
                  backgroundColor: '#fff',
                  borderRadius: 5,
                  marginTop: 5,
                  elevation: 3,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                },
                row: {
                  padding: 10,
                  height: 44,
                  flexDirection: 'row',
                  backgroundColor: '#fff',
                  borderBottomColor: '#eee',
                  borderBottomWidth: 1,
                },
                separator: {
                  height: 1,
                  backgroundColor: '#eee',
                },
                description: {
                  fontSize: 14,
                  color: '#555',
                },
                predefinedPlacesDescription: {
                  color: '#1faadb',
                },
              }}
              fetchDetails={true}
              predefinedPlaces={places}
              predefinedPlacesAlwaysVisible={true}
            />
          </View>


          <MapView
            ref={mapRef}
            style={styles.map}
            showsUserLocation={true}
            region={location}
            onPress={handleMapPress}
          >
            <Marker coordinate={location} />
            {destination && (
              <Marker
                coordinate={destination}
                title={'Destination'}
                description={'Your destination location'}
                pinColor={'blue'}
                onPress={() => zoomToMarker(destination)}
              />
            )}

            {/* <MapViewDirections
              origin={location}
              destination={destination}
              apikey={'AIzaSyC1-BDCGN1JWp_rkjErXWrdhduE28__awA'}
              strokeWidth={6}
              strokeColor="red"
              optimizeWaypoints={true}
              onStart={(params) => {
                console.log(`Started routing between`);
              }}
              onReady={result => {
                console.log(`Distance km`)
                console.log(`Duration: min.`)
                fetchTime(result.distance, result.duration),
                  mapRef.current.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      // right: 30,
                      // bottom: 300,
                      // left: 30,
                      // top: 100,
                    },
                  });
              }}
              onError={(errorMessage) => {
                // console.log('GOT AN ERROR');
              }}
            /> */}

            {destination && (
              <Polyline
                coordinates={[location, destination]}
                strokeColor="#000"
                strokeWidth={2}
              />
            )}
          </MapView>

          <DestinationButton
            destination={destination}
            isChoosingDestination={isChoosingDestination}
            setIsChoosingDestination={setIsChoosingDestination}
            removeDestination={removeDestination}
            location={location}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    height: height,
    width: width,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  autocompleteContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 10, // ensure this is above the map
    elevation: 5,
    height: 50, // for Android to ensure proper stacking
    backgroundColor: 'red', // optional, makes it more visible
  },
});
