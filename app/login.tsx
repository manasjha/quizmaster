import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { useEffect } from 'react';
import { View, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();

  const redirectUri = 'https://auth.expo.io/@manasj31/QuizMaster';

  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      clientId: '873677963028-t7ef0gde5meg34p02nelartl4egagi02.apps.googleusercontent.com',
      redirectUri,
      scopes: ['profile', 'email'], // ✅ openid not needed for Firebase
      responseType: 'id_token', // ✅ Firebase needs ID token
    },
    {
      useProxy: true,
    }
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.authentication?.idToken;
      if (!idToken) {
        Alert.alert('No ID Token returned from Google');
        return;
      }

      const credential = GoogleAuthProvider.credential(idToken);
      signInWithCredential(auth, credential)
        .then(() => {
          console.log('✅ Firebase login success');
          router.replace('/onboarding/class');
        })
        .catch((err) => {
          console.error('❌ Firebase error:', err);
          Alert.alert('Firebase login failed');
        });
    }
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="Login with Google"
        disabled={!request}
        onPress={() => promptAsync({ useProxy: true })}
      />
    </View>
  );
}