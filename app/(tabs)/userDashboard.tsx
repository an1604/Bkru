import { View, Text, StyleSheet, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../constants/url';
import { useRouter } from 'expo-router';

const UserDashboard = () => {
    const router = useRouter();
  
  const { authState } = useAuth();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const getUserDetails = async () => {
    try {
      const userResponse = await axios.get(`${BASE_URL}/user-details`, {
        headers: { Authorization: `Bearer ${authState.token}` }, 
      });

      if (userResponse.status === 200) {
        const { username } = userResponse.data; // Destructure the username
        setUsername(username);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Dashboard</Text>
      {username ? (
        <View style={styles.welcomeContainer}>
          <Text style={styles.username}>Welcome, {username}!</Text>

          {/* Buttons with spacing */}
          <View style={styles.buttonContainer}>
            <Button title="Notify!" onPress={() => {
              alert('New notification!');
              router.push("/newNotification");
              }} />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Notification History" onPress={() => alert('Notification History pressed')} />
          </View>
        </View>
      ) : (
        <Text style={styles.errorText}>Unable to fetch user details.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: 'gray',
  },
  username: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 15,
  },
  welcomeContainer: {
    alignItems: 'center',
  },
  buttonContainer: {
    width: '80%',
    marginBottom: 15, 
  },
  infoText: {
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default UserDashboard;
