import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const {authState, onLogout} = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bkru</Text>
      {authState?.authenticated ? (
        // Authenticated View
        <View>
          <Text>Welcome back, authenticated user!</Text>
          <Button
            title="Logout"
            onPress={async () => {
              await onLogout(); 
              router.push('/LoginScreen'); 
            }}
          />
        </View>
      ) : (
        // Not Authenticated View
        <View>
          <Text>Hello! Please log in to continue.</Text>
          <Button
            title="Login"
            onPress={() => router.push('/LoginScreen')} // Redirect to LoginScreen
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
