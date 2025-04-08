import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import { View, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
    {
      clientId: '873677963028-t7ef0gde5meg34p02nelartl4egagi02.apps.googleusercontent.com', // ✅ Web Client ID
      scopes: ['profile', 'email'],
    },
    {
      useProxy: true, // ✅ Use Expo Proxy for fallback
    }
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.authentication?.idToken;

      if (!idToken) {
        Alert.alert('No ID Token returned from Google');
        return;
      }

      console.log('🟢 ID Token (via Proxy):', idToken);

      // Send to backend
      fetch('http://192.168.29.3:3001/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.token) {
            console.log('✅ Login success:', data.user);
            router.replace('/onboarding/class');
          } else {
            console.error('❌ Backend error:', data.error);
            Alert.alert('Login failed', data.error || 'Backend error');
          }
        })
        .catch((err) => {
          console.error('❌ Network error:', err);
          Alert.alert('Login failed', 'Network issue');
        });
    }
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="Login with Google (Proxy)"
        disabled={!request}
        onPress={() => {
          console.log('🟡 Proxy login button pressed');
          promptAsync({ useProxy: true });
        }}
      />
    </View>
  );
}
