import { createContext, useContext  } from 'react';
import { SafeAreaView, StyleSheet, Text, Button, View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import *  as Linking from 'expo-linking';

import ScreenContext from '../contexts/ScreenContext'

// const url = Linking.useURL();

export default function CallbackScreen({ }) {
  const screen = useContext(ScreenContext);
  /* 2. Get the param */
  // const { itemId, otherParam } = route.params;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Linking Screen</Text>
      {/* <Text>itemId: {JSON.stringify(itemId)}</Text>
      <Text>otherParam: {JSON.stringify(otherParam)}</Text> */}
      {/* <Button title="Go to Home" onPress={() => navigation.navigate('Home')} /> */}
      {/* <Button title="Go back" onPress={() => navigation.goBack()} /> */}
    </View>
  );
}