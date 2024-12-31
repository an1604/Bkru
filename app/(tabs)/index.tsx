import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const auth = React.useContext(AuthContext);
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bkru</Text>
      {!auth?.isAuthenticated? (
        <Button
        title="Login"
        onPress={() => router.push('/LoginScreen')} 
      />) : (
        <Text>Hello, authenticated user! </Text>
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
