import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { SaveUser, get_active_account, set_active_account } from '@/constants/save_to_json';
import { fetchAdafruitIOData } from '@/constants/adafruitIO';

interface LogInPromptProps {
  visible: boolean; // Controls the visibility of the prompt
  onClose: () => void; // Callback for closing the prompt
}

const LogInPrompt: React.FC<LogInPromptProps> = ({ visible, onClose }) => {
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [newUserId, setNewUserId] = useState('');
  const [numPills, setNumPills] = useState('');
  const [showCreateAccountPrompt, setShowCreateAccountPrompt] = useState(false);

  // Fetch the active account on component mount
  useEffect(() => {
    const fetchActiveAccount = async () => {
      const activeAccount = await get_active_account();
      setActiveUserId(activeAccount);
    };
    fetchActiveAccount();
  }, []);

  // Log in functionality
  const handleLogIn = async () => {
    if (!newUserId) {
      Alert.alert('Error', 'Please enter a User ID.');
      return;
    }

    try {
      await set_active_account(newUserId);
      Alert.alert('Success', `Logged in as ${newUserId}`);
      setActiveUserId(newUserId);
      onClose(); // Close the prompt after successful login
    } catch (error) {
      Alert.alert('Error', 'Failed to log in. Ensure the User ID exists.');
      console.error('Error logging in:', error);
    }
  };

  // Create new account functionality
  const handleCreateAccount = async () => {
    if (!newUserId || isNaN(Number(numPills))) {
      Alert.alert('Invalid Entry', 'Please enter a valid User ID and number of pills.');
      return;
    }

    try {
      const loadCellOutput = await fetchAdafruitIOData('loadcell');
      if (!loadCellOutput) {
        Alert.alert('Error', 'Failed to retrieve load cell output.');
        return;
      }

      // Attempt to save the user
      await SaveUser(newUserId, Number(loadCellOutput.value), Number(numPills));

      // Set the new user as the active account after successful creation
      await set_active_account(newUserId);

      Alert.alert('Success', `Account for ${newUserId} created and set as active.`);
      setActiveUserId(newUserId);
      setShowCreateAccountPrompt(false);
      onClose(); // Close the prompt after account creation
    } catch (error) {
      console.error('Error creating account:', error);
      Alert.alert('Error', 'Account creation failed. The User ID may already exist.');
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Hello, please enter your User ID or create a new account.</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter User ID"
            onChangeText={setNewUserId}
            value={newUserId}
          />
          <Button title="Log In" onPress={handleLogIn} />
          <Button title="Create new account" onPress={() => setShowCreateAccountPrompt(true)} />

          {showCreateAccountPrompt && (
            <Modal transparent={true} animationType="fade" onRequestClose={() => setShowCreateAccountPrompt(false)}>
              <View style={styles.overlay}>
                <View style={styles.createAccountContainer}>
                  <Text style={styles.title}>
                    Create a new Account. Make sure the bottle is upright on a flat surface.
                  </Text>
                  <View style={styles.inputRow}>
                    <Text style={styles.label}>User ID:</Text>
                    <TextInput style={styles.input} onChangeText={setNewUserId} value={newUserId} />
                  </View>
                  <View style={styles.inputRow}>
                    <Text style={styles.label}>Total Number of Pills:</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={setNumPills}
                      value={numPills}
                      keyboardType="numeric"
                    />
                  </View>
                  <Button title="Create Account" onPress={handleCreateAccount} />
                  <Button title="Cancel" onPress={() => setShowCreateAccountPrompt(false)} />
                </View>
              </View>
            </Modal>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#999',
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    marginRight: 10,
    fontSize: 16,
  },
  createAccountContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
  },
});

export default LogInPrompt;
