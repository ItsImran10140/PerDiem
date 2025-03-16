/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Image,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { GOOGLE_WEB_CLIENT_ID } from '@env';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Login = ({ navigation }: RouterProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      await GoogleSignin.signIn();
      const { accessToken, idToken } = await GoogleSignin.getTokens();
      if (!idToken) {
        throw new Error('No ID token present!');
      }

      const googleCredential = auth.GoogleAuthProvider.credential(idToken, accessToken);
      await auth().signInWithCredential(googleCredential);
      console.log('Successfully signed in with Google');
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      alert('Google Sign-In failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const signin = async () => {
    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
      console.log('Successfully signed in with email');
    } catch (error: any) {
      console.log(error);
      alert('Sign in failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignup = () => {
    navigation.navigate('Signup');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/home.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.headerText}>Sign In</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              autoCapitalize="none"
              onChangeText={(text) => setEmail(text)}
            />
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              placeholder="Password"
              value={password}
              autoCapitalize="none"
              onChangeText={(text) => setPassword(text)}
            />

            {loading ? (
              <ActivityIndicator size="large" color="white" style={styles.loader} />
            ) : (
              <View style={styles.buttonContainer}>
                <Pressable style={styles.signInButton} onPress={signin}>
                  <Text style={styles.buttonText}>Sign In</Text>
                </Pressable>
                <View style={{ width: '100%', alignItems: 'center' }}>
                  <Text style={{ color: 'white' }}>Or</Text>
                </View>
                <Pressable style={styles.googleButton} onPress={handleGoogleLogin}>
                  <Image
                    source={require('../../assets/search.png')}
                    style={{ width: 24, height: 24 }}
                    resizeMode="contain"
                  />
                  <Text style={styles.buttonGoogleText}>Sign in with Google</Text>
                </Pressable>

                <View style={styles.signupLinkContainer}>
                  <Text style={styles.signupText}>Don't have an account? </Text>
                  <Pressable onPress={navigateToSignup}>
                    <Text style={styles.signupLink}>Create Account</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#C8ACD6',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 5,
  },
  logo: {
    marginTop: 80,
    width: 400,
    height: 400,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    marginTop: -250,
  },
  input: {
    backgroundColor: '#EEEEEE',
    borderWidth: 1,
    opacity: 0.8,
    borderColor: '#ddd',
    borderRadius: 20,
    padding: 10,
    marginBottom: 15,
    fontSize: 14,
  },
  loader: {
    marginTop: 20,
  },
  buttonContainer: {
    marginTop: 10,
    gap: 15,
  },
  signInButton: {
    backgroundColor: '#9B7EBD',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  googleButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
  },
  signupLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  signupText: {
    color: '#fff',
  },
  signupLink: {
    color: '#fff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonGoogleText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
