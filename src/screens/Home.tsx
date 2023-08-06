import { createContext, useContext  } from 'react';
import { SafeAreaView, StyleSheet, Text, Pressable, View, ScrollView, StatusBar } from "react-native";
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, useAutoDiscovery } from 'expo-auth-session';
import *  as Linking from 'expo-linking';

import ScreenContext from '../contexts/ScreenContext'
import { AuthContext } from "../contexts/AuthContext";

import Login from '../components/LoginButton'


const prefix = Linking.createURL('/');

// console.log("prefix: ",prefix )
WebBrowser.maybeCompleteAuthSession();

export default function HomeScreen({navigation}) {
  const discovery = useAutoDiscovery('https://auth.schoolall.io/realms/schoolall');

  const {authorizationCreds, updateAuthorizationCreds} = useContext(AuthContext);
  const url = useContext(ScreenContext);


  const [request, result, promptAsync] = useAuthRequest(
    {
      clientId: 'schoolall-mobile',
      redirectUri: 'exp://192.168.0.105:8081/--/home',
      // redirectUri: makeRedirectUri({
      //   scheme: 'myapp'
      // }),
      scopes: ['openid', 'profile'],
      responseType: 'code',
      usePKCE: true,
    },
    discovery
  );


  
  return (
    <SafeAreaView style={styles.container}>
      <View style={{
        // backgroundColor: 'red'
      }}>
        <Login/>
      </View>
      {authorizationCreds &&
        <ScrollView  style={styles.scrollView}>
          <Text  style={styles.text}>{JSON.stringify(authorizationCreds, null, 2)}</Text>
        </ScrollView>
      }
      <View style={styles.actions}>
        <Pressable
          style={styles.button}
          onPress={() => {
            /* 1. Navigate to the Details route with params */
            navigation.navigate('Details', {
              itemId: 86,
              otherParam: 'anything you want here',
            });
          }}
        ><Text style={styles.buttonText}>{'Go to Detail'}</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => {
            /* 1. Navigate to the Details route with params */
            navigation.navigate('Callback', {
              itemId: 86,
              otherParam: 'anything you want here',
           })}}><Text style={styles.buttonText}>{'Go to Callback - via React navigation'}</Text> 
        </Pressable>
        
        <Pressable
          style={styles.button}
          onPress={() => {
            Linking.openURL('exp://192.168.0.105:8081/--/callback')
          }}
        >
        <Text style={styles.buttonText}>{'Go to Callback - via Linking'}</Text> 
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => WebBrowser.openBrowserAsync('https://www.schoolall.io')}
        >
          <Text style={styles.buttonText}>{'Open URL with an in-app browse'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: StatusBar.currentHeight,
      alignContent: 'center',
    },
    scrollView: {
      backgroundColor: '#464b5164',
      marginHorizontal: 4,
    },
    text: {
      color: '#fff',
      marginHorizontal: 8,
      maxWidth: '100%',
      paddingHorizontal: 8,
      justifyContent: 'center',
       
    },
    actions: {
      // backgroundColor: '#0d783d',
      display: 'flex',
      marginTop: 'auto'
    },
    button: {
      // backgroundColor: '#3067f2',
      flex: 0,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 4,
      elevation: 3,
      backgroundColor: 'black',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginVertical: 4
    },
    buttonText: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
    }
  });
  