import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';


const SignUpScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1); // Step 1: registration, Step 2: 2FA code input
    const [code, setCode] = useState('');
    const router = useRouter();

    const handleRegistrationSubmit = ()=>{
        if (email.trim() === '') {
              Alert.alert('Error', 'Please enter a valid email address');
            } 
        else if (username.trim() === ''){
              Alert.alert('Error', 'Please enter a valid user-name.');
            }
        else if (password.trim() === ''){
              Alert.alert('Error', 'Please enter a valid password.');
            } 
        else {
              // Simulate sending 2FA code to the email (you can add your API call here)
              Alert.alert('2FA Code Sent', `A 2FA code has been sent to ${email}`);

              // Sending a POST request to the mock server (make it handle the simple cases for now)
              fetch('http://192.168.1.154:3000/register', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: email,
                    username: username,
                    password: password
                }),
              }).then((response) =>{
                if (response.ok){
                    return response.json(); // Parse response body as JSON if request is successful
                }
                else{
                    throw new Error('Failed to resigter a new user'); // Throw an error for non-2xx responses
                }
              }).then((data)=>{
                    setStep(2); // Move to Step 2: Enter 2FA code
              }).catch((error)=>{
                console.error('Error:', error);
                Alert.alert('Failed', `Register failed: ${error.message}`);
              })
            }
    }

    const handleCodeSubmit = () => {
        if (code.trim() === '') {
          Alert.alert('Error', 'Please enter the 2FA code');
        } else {
          // Simulate verifying the 2FA code (you can add your API call here)
          fetch('http://192.168.1.154:3000/confirm_code', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: code }),
          }).then((response) =>{
            if (response.ok){
                return response.json();
            }else{
                throw new Error('Failed to get a valid response to register new user'); // Throw an error for non-2xx responses
            }
          }).then((data) =>{
            Alert.alert('Success', `Logged in with email: ${email}`);
            router.push('/');
            console.log('Server response:', data); // Log server response for debugging
          }).catch((error) =>{
            console.error('Error:', error);
            Alert.alert('Failed', `Register failed: ${error.message}`);
          }).finally(() =>{
            setStep(1); // Reset to Step 1 for the next login
            setEmail(''); 
            setCode(''); 
          })
        }
      };

  return (
  <View style={styles.container}>
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
        <Button title="Register" onPress={handleRegistrationSubmit} />
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
  

export default SignUpScreen