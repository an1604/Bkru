import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { BASE_URL } from './url';
import { useAuth } from './AuthContext';

const SignUpScreen = () => {
  const { authState, onLogout, onRegister, onLogin } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // Step 1: Registration, Step 2: 2FA code input
  const [code, setCode] = useState('');
  const router = useRouter();

  const register = async () => {
    const result = await onRegister! (email,username, password);
    console.log("result:", result);
    if (result && result.error){
        Alert.alert(result.msg);
    }
    const result1 = await onLogin! (email);
    if (result1 && result1.error){
      Alert.alert(result.msg);
    }
  };
  
  const handleRegistrationSubmit = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter a valid email address');
    } else if (!username.trim()) {
      Alert.alert('Error', 'Please enter a valid username');
    } else if (!password.trim()) {
      Alert.alert('Error', 'Please enter a valid password');
    } else {
      try {
        const response = await axios.post(`${BASE_URL}/register`, { email, username, password });
        console.log('Server response:', response.data);
        Alert.alert('2FA Code Sent', `A 2FA code has been sent to ${email}`);
        setStep(2);
      } catch (error: any) {
        console.error('Error registering user:', error);
        Alert.alert('Failed', `Registration failed: ${error.response?.data?.message || 'Something went wrong. Please try again.'}`);
      } finally {
      }
    }
  };

  const handleCodeSubmit = async () => {
    if (!code.trim()) {
      Alert.alert('Error', 'Please enter the 2FA code');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/confirm_code`, { code });
      Alert.alert('Success', `Logged in with email: ${email}`);
      console.log('Server response:', response.data);
      
      register();
      router.push('/');
    } catch (error: any) {
      console.error('Error confirming code:', error);
      Alert.alert('Failed', `Registration failed: ${error.response?.data?.message || 'Something went wrong. Please try again.'}`);
    } finally {
    }
  };

  return (
    <View style={styles.container}>
      {authState?.authenticated ? (
        <>
          <Text>You are already logged in. You can log out if you really want to.</Text>
          <Button
            title="Logout"
            onPress={async () => {
              await onLogout();
              Alert.alert('Logged Out', 'You have been logged out successfully.');
              router.push('/');
            }}
          />
        </>
      ) : (
        <>
          <Text style={styles.title}>Sign Up</Text>
          {step === 1 ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter your username"
                placeholderTextColor="#888"
                value={username}
                onChangeText={setUsername}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#888"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#888"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter 2FA code"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={code}
                onChangeText={setCode}
              />
            </>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
  },
});

export default SignUpScreen;
