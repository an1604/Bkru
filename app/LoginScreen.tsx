import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1); // Step 1: Email input, Step 2: 2FA code input
  const router = useRouter();

  const handleEmailSubmit = () => {
    if (email.trim() === '') {
      Alert.alert('Error', 'Please enter a valid email address');
    } else {
      // Simulate sending 2FA code to the email (you can add your API call here)
      Alert.alert('2FA Code Sent', `A 2FA code has been sent to ${email}`);
      
      // Sending a POST request to the mock server (make it handle the simple cases for now)
      fetch('http://192.168.1.154:3000/get_mfa_key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });
      

      setStep(2); // Move to Step 2: Enter 2FA code
    }
  };

  const handleCodeSubmit = () => {
    if (code.trim() === '') {
      Alert.alert('Error', 'Please enter the 2FA code');
      return;
    }
  
    // Send POST request to the server
    fetch('http://192.168.1.154:3000/confirm_code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: code }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // Parse response body as JSON if request is successful
        } else {
          throw new Error('Failed to log in'); // Throw an error for non-2xx responses
        }
      })
      .then((data) => {
        // Successful login
        Alert.alert('Success', `Logged in with email: ${email}`);
        console.log('Server response:', data); // Log server response for debugging
  
        // Navigate to the home page
        router.push('/');
      })
      .catch((error) => {
        // Handle network errors or non-2xx responses
        console.error('Error:', error);
        Alert.alert('Failed', `Login failed: ${error.message}`);
      })
      .finally(() => {
        // Reset state in all cases (success or failure)
        setStep(1);
        setEmail('');
        setCode('');
      });
  };
  

  return (
    <View style={styles.container}>
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
          <Button title="Submit Email" onPress={handleEmailSubmit} />
          
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
