import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { set_active_account } from '@/constants/save_to_json'; // Import set_active_account

const LogIn = ({
  onLogIn,
  onClose,
}: {
  onLogIn: (userId: string) => void;
  onClose: () => void;
}) => {
  const [userId, setUserId] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State to hold the error message

  const dataFilePath = `${FileSystem.documentDirectory}data-storage.json`;

  const handleLogIn = async () => {
    try {
      // Try setting the active account
      const success = await set_active_account(userId);

      if (!success) {
        // If the user ID does not exist, set an error message
        setErrorMessage("That User ID doesn't exist. Please Create an Account and try again.");
        return; // Exit early
      }

      // If login is successful, pass the userId to the parent component
      onLogIn(userId);

      // Close the pop-up
      onClose();
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Enter your User ID to log in:</Text>

      {/* Input Field */}
      <TextInput
        style={styles.input}
        placeholder="Type your User ID"
        value={userId}
        onChangeText={setUserId}
      />

      {/* Error Message */}
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {/* Log In Button */}
      <TouchableOpacity style={styles.logInButton} onPress={handleLogIn}>
        <Text style={styles.logInButtonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    position: 'absolute',
    top: 170,
    left: 35,
    width: 300,
    height: 200,
    backgroundColor: '#bab7b9',
    borderWidth: 3
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
    backgroundColor: '#ccc',
    borderRadius: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  logInButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  logInButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LogIn;
