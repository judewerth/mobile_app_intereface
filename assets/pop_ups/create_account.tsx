import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import BottleUpright from '@/assets/pop_ups/bottle_upright'; // Import the BottleUpright component
import { SaveData } from '@/constants/save_to_json'; 

const CreateAccount = ({onClose}: {onClose: () => void;}) => {

  const [userID, setUserID] = useState(''); // State to store the userID
  const [numPills, setNumPills] = useState<number | null>(null); // State to store numPills
  const [doseTime, setDoseTime] = useState<string | null>(null); // State to store doseTime

  const [showUserIDPrompt, setShowUserIDPrompt] = useState(true); // Control for showing userID prompt
  const [showBottleUpright, setShowBottleUpright] = useState(false);

  // Function to handle the creation of the user account
  const handleCreateAccount = () => {
    setShowUserIDPrompt(true); // Show the userID input prompt
  }; 
  const handleCloseCreateAccount = () => {
    setShowUserIDPrompt(false); // Show the userID input prompt
  };

  // Callback function to handle the extracted data from BottleUpright
  const handleDataExtracted = (extractedNumPills: number, extractedDoseTime: string) => {
    setNumPills(extractedNumPills); // Store numPills
    setDoseTime(extractedDoseTime); // Store doseTime

    const pillsRecommended = 0; 

    // Call SaveData to store the account data
    SaveData(userID, extractedNumPills, extractedDoseTime, pillsRecommended);

    // Log the extracted values to the console
    console.log(`Saved data userID: ${userID}, numPills: ${extractedNumPills}, doseTime: ${extractedDoseTime}, pillsRecommended: ${pillsRecommended} to data-storage.json`);
  };

  // Function to close the BottleUpright pop-up
  const handleBottleUpright = () => {
    setShowBottleUpright(true); // Close the BottleUpright pop-up
  };  
  const handleCloseBottleUpright = () => {
    setShowBottleUpright(false); // Close the BottleUpright pop-up
  };

  return (
    <View style={styles.container}>
      {/* Show the "Enter your User ID" prompt when triggered */}
      {showUserIDPrompt && (
        <View style={styles.userIDPrompt}>
          <Text style={styles.promptText}>Enter a new User ID to Create Account</Text>
          {/* Input field for the User ID */}
          <TextInput
            style={styles.userIDInput}
            value={userID}
            onChangeText={setUserID}
            placeholder="Enter User ID"
          />
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => {
              handleCloseCreateAccount()
              handleBottleUpright()
            }}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Conditional rendering of the BottleUpright pop-up */}
      {showBottleUpright && (
        <BottleUpright
          onClose={handleCloseBottleUpright}
          onDataExtracted={handleDataExtracted} // Pass callback to extract data
        />
      )}

    </View>
  );


};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', // Added to prevent potential issues with zIndex stacking
  },
  createAccountButton: {
    position: 'absolute',
    top: 40, // Keeps it at 40px from the top
    right: 20, // Keeps it 20px from the left
    backgroundColor: '#b95fe0',
    borderRadius: 5,
    zIndex: 2, // Ensure it's placed above other elements
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userIDPrompt: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#b95fe0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 2,
    top: 150,
    zIndex: 1, // Ensure this is below the BottleUpright pop-up
  },
  promptText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userIDInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    width: '100%',
    paddingLeft: 10,
    marginBottom: 20,
  },
  doneButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CreateAccount;
