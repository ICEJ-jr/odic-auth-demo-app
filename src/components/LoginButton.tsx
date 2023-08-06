import { useState, useContext, useEffect } from 'react';
import { StyleSheet, Button, View, Pressable, Text } from "react-native";
import { makeRedirectUri, useAuthRequest, useAutoDiscovery, exchangeCodeAsync, fetchUserInfoAsync, Prompt } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
// import * as jose from 'jose'

import { AuthContext } from "../contexts/AuthContext";



WebBrowser.maybeCompleteAuthSession();
    


const LoginButton = () => {
    const [authResponse, setAuthResponse] = useState(null)
    const [authCode, setAuthCode] = useState()

    // let userInfoResponse, userInfo
    const [tokenResponse, setTokenResponse] = useState(null)
    const [idToken, setIdToken] = useState(null)
    const [accessToken, setAccessToken] = useState(null)

    const [userInfoResponse, setuserInfoResponse] = useState(null)
    const [userInfo, setUserInfo] = useState(null)
    



    
    // const [tokenResponse, setTokenResponse] = useState(null)

    const discovery = useAutoDiscovery('https://auth.schoolall.io/realms/schoolall');
    

    // useEffect(() => {
    //   updateAuthorizationCreds({authCode, idToken});
    //   return () => {
    //     connection.disconnect();
    //   };
    // }, [serverUrl, roomId]);
   
    const { updateAuthorizationCreds } = useContext(AuthContext);

    const clientId = 'schoolall-mobile'
    const redirectUri = makeRedirectUri({
        scheme: 'exp',
        path: '/home'
    })

    const [request, result, promptAsync] = useAuthRequest(
        {
          clientId: clientId,
        //   redirectUri: 'exp://192.168.0.105:8081/--/home',
          redirectUri: redirectUri,
          scopes: ['openid'],
          responseType: 'code',
          usePKCE: true,
          prompt: Prompt.Login,
        },
        discovery
    );

    const getAuthorizationCode = async () => {
    try {
        const authResponse = await promptAsync()
        setAuthResponse(authResponse)
        // await promptAsync()
        // console.log("authResponse before setAuthCode: \n",authResponse)
        // setAuthCode(authResponse['params']['code'])
        const authCode = await authResponse['params']['code']
        setAuthCode(authCode)
        // console.log("AuthCode:\n",authCode);

        alert('AUTHORIZATION CODE REQUEST RESPONSE\n' + JSON.stringify(authResponse));
        updateAuthorizationCreds({"Authorization Code":authCode})

        // console.log("AuthResult: \n",result);
        // console.log("request: \n",request)
    } catch (error) {
        alert('AUTHORIZATION CODE REQUEST ERROR RESPONSE\n' + JSON.stringify(error));
        console.error(error);
    }
    }

    const getIdToken = async () => {
    const tokenRequestConfig = {
        grantType: "authorization_code",
        clientId:  clientId,
        code: result['params']['code'],
        redirectUri: redirectUri,
        code_verifier: request.codeVerifier
    }
    // console.log("tokenRequestConfig:\n",tokenRequestConfig)
    const tokenResponse = await exchangeCodeAsync(tokenRequestConfig, discovery)
    setTokenResponse(tokenResponse)
    const idToken = tokenResponse.idToken
    setIdToken(idToken)
    updateAuthorizationCreds({ idToken })
    }
    
    const getIdTokenManually = () => {
    //POST json
    let dataToSend =  {
        grant_type: "authorization_code",
        client_id:  clientId,
        code: result['params']['code'],
        redirect_uri: redirectUri,
        code_verifier: request.codeVerifier
    };
    //making data to send on server
    let Body = [];
    for (let key in dataToSend) {
        let encodedKey = encodeURIComponent(key);
        let encodedValue = encodeURIComponent(dataToSend[key]);
        Body.push(encodedKey + '=' + encodedValue);
    }
    const formBody = Body.join('&')
    //POST request
    fetch('https://auth.schoolall.io/realms/schoolall/protocol/openid-connect/token', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
        //Header Defination
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
    })
        .then((response) => {
        // console.log("response in get id token",response);
        return(response.json())
        })
        //If response is in json then in success
        .then((responseJson) => {
        // console.log("tokenResponse reads ",tokenResponse)
        // setIdToken(responseJson["id_token"])

        const tokenResponse = responseJson
        setTokenResponse(responseJson) // tokenResponse = responseJson
        // console.log("tokenResponse now reads ",tokenResponse)
        const idToken = tokenResponse["id_token"]
        const accessToken = tokenResponse["access_token"]
        setIdToken(idToken) //  idToken = tokenResponse["id_token"]
        setAccessToken(accessToken) // accessToken = tokenResponse["access_token"]
        console.log("id token",idToken);
        alert('ACCESS TOKEN REQUEST RESPONSE\n' + JSON.stringify(tokenResponse))
        updateAuthorizationCreds({
            "idToken":idToken,
            "accessToken": accessToken
        })
        // setTokenResponse(tokenResponse)
        // console.log("TokenResponse",tokenResponse);
        })
        //If response is not in json then in error
        .catch((error) => {
        alert('ACCESS TOKEN ERROR RESPONSE\n' + JSON.stringify(error));
        console.error(error);
        });
    };

    // console.log("tokenResponse before Perse IdToken",tokenResponse)
    const getUserInfo = () => {
        // console.log("tokenResponse in Perse IdToken",tokenResponse)
        fetchUserInfoAsync(tokenResponse,discovery).then((userInfo) => {
            console.log("userInfo", userInfo)
            alert('USER REQUEST RESPONSE\n' + JSON.stringify(userInfo));
            updateAuthorizationCreds({"User Info":userInfo})
            console.log("userInfo:\n",userInfo);
        }).
        catch(error =>{
            alert('USER INFO ERROR RESPONSE\n' + JSON.stringify(error));
            console.log("Error in getUserInfo / fetchUserInfoAsync",error)
        });
    }

    const getUserInfoManually = () => {
        console.log("IdToken for user Info:\n",idToken)
        fetch('https://auth.schoolall.io/realms/schoolall/protocol/openid-connect/userinfo', {
            method: 'GET',
            headers: {
                //Header Defination
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenResponse.access_token}`,
            }
            //Request Type
        })
        .then((response) => response.json())
        //If response is in json then in success
        .then((responseJson) => {
            const userInfoResponse = responseJson
            setuserInfoResponse(userInfoResponse)
            const userInfo = userInfoResponse
            setUserInfo(userInfo) //  idToken = tokenResponse["id_token"]
            //Success
            alert('ACCESS TOKEN REQUEST RESPONSE\n' + JSON.stringify(responseJson));
            updateAuthorizationCreds({"User Info":userInfo})
            console.log(responseJson);
        })
        //If response is not in json then in error
        .catch((error) => {
        //Error
        alert(error);
        console.error("user info error", error);
        });
    }

    return (
        <> 
            <Pressable
                style={styles.button}
                disabled={!request}
                onPress={() => getAuthorizationCode()}
                >
                <Text style={styles.buttonText}>{'Login!'}</Text>
            </Pressable>
            <Pressable
                style={[styles.button, {backgroundColor: '#464b5164'}]}
                disabled={true} 
                onPress={() => getIdToken()}
                >
                <Text style={styles.buttonText}>{'Get Id token - with library (Not Working!)'}</Text>
            </Pressable>
            <Pressable
                style={styles.button}
                disabled={!result}
                onPress={() => getIdTokenManually()}
                >
                <Text style={styles.buttonText}>{'Get Id token  - manually'}</Text>
            </Pressable>
            <Pressable
                style={[styles.button, {backgroundColor: '#464b5164'}]}
                disabled={true}
                onPress={() => getUserInfo()}
                >
                <Text style={styles.buttonText}>{'Get User Info - with library (Not Working!)'}</Text>
            </Pressable>
            <Pressable
                style={styles.button}
                disabled={!result}
                onPress={() => getUserInfoManually()}
                >
                <Text style={styles.buttonText}>{'Get User Info - manually'}</Text>
            </Pressable>
        </>
    )
}
// 

const styles = StyleSheet.create({
    text: {
      color: '#fff',
      marginHorizontal: 8,
      maxWidth: '100%',
      paddingHorizontal: 8,
      justifyContent: 'center',
       
    },
    button: {
      backgroundColor: '#3067f2',
      flex: 0,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 24,
      elevation: 3,
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
export default LoginButton
