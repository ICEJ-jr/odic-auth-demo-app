import { SafeAreaView, StyleSheet, Text, Button, View } from "react-native";
import *  as Linking from 'expo-linking';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';


import ScreenContext from './src/contexts/ScreenContext';
import { AuthProvider } from "./src/contexts/AuthContext";

import HomeScreen from './src/screens/Home';
import DetailsScreen from './src/screens/Details';
import CallbackScreen from './src/screens/Callback';


const prefix = Linking.createURL('/');
// console.log(prefix)

const Stack = createNativeStackNavigator();

export default function App() {
  const linking = {
    prefixes: [prefix],
    // prefixes: ['myapp://app'],
    config: {
      screens: {
        Home: "home",
        Details: "details",
        Callback: "callback"
      },
    },
  }

  // console.log("Screen Linked")
  const url = Linking.useURL();

   

  return (
    // feedback={<Text> Loading...</Text>}
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}> 
      <AuthProvider>
        <ScreenContext.Provider value={url}>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} options={{title: "Home"}}/>
            <Stack.Screen name="Details" component={DetailsScreen} options={{title: "Detail"}} initialParams={{ itemId: 42 }}/>
            <Stack.Screen name="Callback" component={CallbackScreen} options={{title: "Callback"}} initialParams={{ itemId: 10 }}/>
          </Stack.Navigator>
        </ScreenContext.Provider>
      </AuthProvider>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

