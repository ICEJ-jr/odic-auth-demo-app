import { useState, createContext } from 'react';
import { makeRedirectUri, useAuthRequest, useAutoDiscovery } from 'expo-auth-session';

const AuthContext = createContext(null);



const AuthProvider = ({children}) => {
    const [authorizationCreds, setAuthorizationCreds] = useState(null);

    const updateAuthorizationCreds = (creds) => {
        setAuthorizationCreds(creds);
    }

  return (
    <AuthContext.Provider value={{ authorizationCreds, updateAuthorizationCreds }}> 
      {children} 
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider };