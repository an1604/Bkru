import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { BASE_URL } from './url';

export default function LoginScreen() {
  const { authState, onLogout, onLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1); // Step 1: Email input, Step 2: 2FA code input
  const router = useRouter();

  const login = async () =>{
    const result = await onLogin! (email);
    
    console.log("result:", result);
    if (result && result.error){
      Alert.alert(result.msg);
    }
  };  

  const handleEmailSubmit = async () => {    
    if (email.trim() === '') {
      Alert.alert('Error', 'Please enter a valid email address');
    } else {
      try {
        await axios.post(`${BASE_URL}/get_mfa_key`, { email });
        Alert.alert('2FA Code Sent', `A 2FA code has been sent to ${email}`);
        setStep(2);
      } catch (error) {
        console.error('Error sending email:', error);
        Alert.alert('Error', 'Failed to send 2FA code. Please try again.');
      } finally {
      }
    }
  };

  const handleCodeSubmit = async () => {
    if (code.trim() === '') {
      Alert.alert('Error', 'Please enter the 2FA code');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/confirm_code`, { code });
      Alert.alert('Success', `Logged in with email: ${email}`);
      router.push('/'); // Navigate to home
      login();
    } catch (error: any) {
      console.error('Error confirming code:', error);
      Alert.alert(
        'Failed',
        `Login failed: ${error.response?.data?.message || 'Something went wrong. Please try again.'}`
      );
    } finally {
      setStep(1);
      setEmail('');
      setCode('');
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
          <Text style={styles.title}>Login Page</Text>
          {step === 1 ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#888"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
              <Button title="Submit Email" onPress={handleEmailSubmit}/>
              <Button
                title="Signup"
                onPress={() => router.push('/SignUpScreen')} // Navigate to SignUpScreen
                color="#007BFF"
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
              <Button title="Submit Code" onPress={handleCodeSubmit} />
            </>
          )}
        </>
      )}
    </View>
  );
}

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
