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
      setStep(2); // Move to Step 2: Enter 2FA code
    }
  };

  const handleCodeSubmit = () => {
    if (code.trim() === '') {
      Alert.alert('Error', 'Please enter the 2FA code');
    } else {
      // Simulate verifying the 2FA code (you can add your API call here)
      Alert.alert('Success', `Logged in with email: ${email}`);
      router.push('/');
      setStep(1); // Reset to Step 1 for the next login
      setEmail(''); 
      setCode(''); 
    }
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
