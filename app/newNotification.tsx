import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { BASE_URL } from './constants/url';

// Function to trigger different notification types
const triggerNotification = async (type: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/new_notification`, { type });
    console.log(response);
    
    if (response.status === 200) {
        Alert.alert('Notification Sent', `Notification of type "${type}" was created successfully.`);
    } else {
      Alert.alert('Notification Failed to Send');
    }
  } catch (error) {
    console.error('Error sending notification:', error);
    Alert.alert('Error', 'Failed to create the notification.');
  }
};

const NewNotification = () => {
  return (
    <View style={styles.container}>
      <Button title="Success Notification" onPress={() => triggerNotification('Success')} />
      <View style={styles.spacing} />
      <Button title="Warning Notification" onPress={() => triggerNotification('Warning')} />
      <View style={styles.spacing} />
      <Button title="Error Notification" onPress={() => triggerNotification('Error')} />
      <View style={styles.spacing} />
      <Button title="Info Notification" onPress={() => triggerNotification('Info')} />
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
  spacing: {
    height: 10, // Adds spacing between buttons
  },
});

export default NewNotification;
