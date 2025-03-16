/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import auth from '@react-native-firebase/auth';
import { useState } from 'react';
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

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Signup = ({ navigation }: RouterProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signup = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      console.log('Successfully signed up');
    } catch (error: any) {
      console.log(error);
      alert('Sign up failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/home.png')} 
              style={styles.logo} 
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.headerText}>Create Account</Text>
            
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
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              placeholder="Confirm Password"
              value={confirmPassword}
              autoCapitalize="none"
              onChangeText={(text) => setConfirmPassword(text)}
            />
            
            {loading ? (
              <ActivityIndicator size="large" color="#C8ACD6" style={styles.loader} />
            ) : (
              <View style={styles.buttonContainer}>
                <Pressable style={styles.signUpButton} onPress={signup}>
                  <Text style={styles.buttonText}>Sign Up</Text>
                </Pressable>
                
                <View style={styles.loginLinkContainer}>
                  <Text style={styles.loginText}>Already have an account? </Text>
                  <Pressable onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginLink}>Login</Text>
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

export default Signup;

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
    marginBottom: 40,
  },
  logo: {
    marginTop: 90,
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
    marginTop: -250
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
  signUpButton: {
    backgroundColor: '#9B7EBD',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  loginText: {
    color: '#fff',
  },
  loginLink: {
    color: '#fff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
}); 