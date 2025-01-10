import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { BASE_URL } from './constants/url';
import { useAuth } from './contexts/AuthContext';
import * as Location from 'expo-location';

const SignUpScreen = () => {
  const { authState, onLogout, onRegister, onLogin } = useAuth();
  const [locationServicesEnabled, setLocationServicesEnabled] = useState(false)

  const [latitude, setLatitude] = useState(-1);
  const [longitude, setLongitude] = useState(-1);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');


  const [step, setStep] = useState(1); // Step 1: Registration, Step 2: 2FA code input
  const [code, setCode] = useState('');
  const router = useRouter();

  // checks if the location enabled on the device
  const checkIfLocationEnabled= async ()=>{
    let enabled = await Location.hasServicesEnabledAsync(); //returns true or false
    if(!enabled){ //if not enable 
      Alert.alert('Location not enabled', 'Please enable your Location', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
    }else{
      Alert.alert("the location is enable!");
      setLocationServicesEnabled(enabled) //store true into state
    }
  }

  //get current location
  const getCurrentLocation = async () => {
    try {
      // Check if location services are enabled
      if (!locationServicesEnabled) {
        await checkIfLocationEnabled();
      }
  
      // Request foreground location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('Permission status:', status);
  
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Allow the app to use location services to continue.',
          [
            { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ]
        );
        return; // Exit early if permission is denied
      }
  
      // Get current position (latitude and longitude)
      const { coords } = await Location.getCurrentPositionAsync();
      console.log('Coords:', coords);
      
      if (!coords) {
        Alert.alert('Error', 'Unable to retrieve location.');
        return;
      }
  
      const { latitude, longitude } = coords;
      console.log('Latitude:', latitude, 'Longitude:', longitude);
      setLatitude(latitude);
      setLongitude(longitude);

    } catch (error: any) {
      console.error('Error in getCurrentLocation:', error.message);
      Alert.alert('Error', 'An error occurred while fetching location.');
    }
  };

  const register = async () => {
    const result = await onRegister! (email,username, password);
    if (result && result.error){
        Alert.alert(result.msg);
    }
    const result1 = await onLogin! (email);
    if (result1 && result1.error){
      Alert.alert(result.msg);
    }
  };
  
  const handleRegistrationSubmit = async () => {
    checkIfLocationEnabled(); // first, we check if the location enabled
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter a valid email address');
    } else if (!username.trim()) {
      Alert.alert('Error', 'Please enter a valid username');
    } else if (!password.trim()) {
      Alert.alert('Error', 'Please enter a valid password');
    } else {
      try {
        if (longitude !== -1 && latitude !== -1){
        const response = await axios.post(`${BASE_URL}/register`, { email, username, password, latitude, longitude });
        console.log('Server response:', response.data);
        Alert.alert('2FA Code Sent', `A 2FA code has been sent to ${email}`);
        setStep(2);
      }else{
        Alert.alert('Something went wrong with fetching your current location, please try again')
      }
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

  useEffect(() =>{
    if(latitude === -1 || longitude === -1){
      getCurrentLocation(); // getting the current location
    }
  })

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
            placeholder="Enter your email"
            placeholderTextColor="#888"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          
          <Button title="Submit" onPress={handleRegistrationSubmit} />
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
          <Button title="Submit 2FA Code" onPress={handleCodeSubmit} />
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
