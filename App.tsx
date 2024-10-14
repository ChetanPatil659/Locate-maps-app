/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-get-random-values'

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  StyleSheet,
} from 'react-native';
import Home from './src/screens/Home';
import { PlacesProvider } from './src/context/locationContext';
import Locations from './src/screens/Locations';
import SplashScreen from './src/screens/Splash';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

const Stack = createNativeStackNavigator()

function App(): React.JSX.Element {

  return (
    <PlacesProvider>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName='Splash'>
        <Stack.Screen name='Splash' component={SplashScreen} />
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='Locations' component={Locations} />
      </Stack.Navigator>
    </NavigationContainer>
    </PlacesProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
