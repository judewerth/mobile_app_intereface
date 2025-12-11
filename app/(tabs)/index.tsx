import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

import { set_active_account, get_active_account } from '@/constants/save_to_json';

import CreateAccount from '@/assets/pop_ups/create_account'; // Ensure this import is correct
import LogIn from '@/assets/pop_ups/log_in'; // Import the LogIn component
import ConditionalDisplayRectangle from '@/assets/pop_ups/display_rectange';
import PainLevelInput from '@/assets/pop_ups/pain_level_input';

const BlankTab = () => {
  // Define Constants
  // Create Account

  const [accountInfo, setAccountInfo] = useState<{ userId: string, numPills: number, doseTime: string } | null>(null);
  const [showCreateAccount, setShowCreateAccount] = useState(false); // Control PainLevelInput visibility

  // Log In
  const [showLogIn, setShowLogIn] = useState(false); // State to control LogIn visibility

  // Display Active User
  const [activeUser, setActiveUser] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // State to track refreshes
  const fetchActiveUser = async () => {
    const user = await get_active_account();
    setActiveUser(user);
  };
  // Display State
  const [accountState, setAccountState] = useState<'red' | 'yellow' | 'green' | 'NoUser'>('NoUser');

  // Take Dose Button
  const [showPainLevelInput, setShowPainLevelInput] = useState(false); // Control PainLevelInput visibility
  const [selectedPainLevel, setSelectedPainLevel] = useState<string | null>(null); // Store the selected pain level
  const [showTakeDose, setShowTakeDose] = useState(false);

  // Define Handles
  // Create Account
  const handleCreateAccountPress = () => {
    setShowCreateAccount(true); // Show the PainLevelInput pop-up
  };  
  const handleCreateAccountClose = () => {
    setShowCreateAccount(false); // Hide the PainLevelInput pop-up
  };
  const handleAccountCreated = (userId: string, numPills: number, doseTime: string) => {
    setAccountInfo({ userId, numPills, doseTime});
    console.log(`Account created for ${userId} with ${numPills} pills.`);
  };

  // Log In
  const handleCloseLogIn = () => {
    setShowLogIn(false); // Close LogIn pop-up
  };
  const handleLogIn = (userId: string) => {
    console.log('Logged in as:', userId);  // Handle successful login actions here (e.g., set active user, navigate to main screen, etc.)
  };

  // Log Out
  const handleLogOut = async () => {
    try {
      // Set the active account to an empty string to log out
      await set_active_account("");
      setActiveUser(null); // Clear the active user in state
      console.log("Logged Out", "You have been successfully logged out.");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Display Active User
  useEffect(() => {
    const fetchActiveUser = async () => {
      const user = await get_active_account(); // Get the active account using the function
      setActiveUser(user);
    };
    fetchActiveUser();
  }, []);
  useEffect(() => { // Fetch the active user whenever refreshKey changes
    fetchActiveUser();
    handleShowTakeDose();
  }, [refreshKey]);
  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey to trigger re-render
  };

  // Take Dose Button
  const handleTakeDosePress = () => {
    setShowPainLevelInput(true); // Show the PainLevelInput pop-up
  };
  // Callback to handle when PainLevelInput is closed
  const handlePainLevelInputClose = () => {
    setShowPainLevelInput(false); // Hide the PainLevelInput pop-up
  };
  const handlePainLevelSelect = (level: string) => {
    setSelectedPainLevel(level); // Store the selected pain level
    console.log(`Selected pain level: ${level}`); // Log for debugging
  };
  const handleShowTakeDose = () => {
    if (accountState === 'yellow' || accountState === 'green') {
      setShowTakeDose(true)}
    else {
      setShowTakeDose(false)
    }
  }


  return (
    // Create Buttons
    <View style={styles.container}>
      {/* Create Account Button */} 
      <TouchableOpacity
        style={styles.createAccountButton}
        onPress={handleCreateAccountPress} // Show the modal when the button is pressed
      >
        <Text style={styles.createAccountButtonText}>Create Account</Text>
      </TouchableOpacity>

      {showCreateAccount && <CreateAccount 
      onClose={handleCreateAccountClose} 
      />}

      {/* Log In Button */} 
      <TouchableOpacity 
        style={styles.logInButton}
        onPress={() => setShowLogIn(true)} // Show LogIn pop-up
      >
        <Text style={styles.logInButtonText}>Log In</Text>
      </TouchableOpacity>
      {/* Conditionally render LogIn pop-up */}
      {showLogIn && <LogIn onLogIn={handleLogIn} onClose={handleCloseLogIn} />}

      {/*Display Active User*/}
      <TouchableOpacity style={styles.button} onPress={handleRefresh}>
        <Text style={styles.activeUserText}> 
          {activeUser ? `Current Active User: ${activeUser}` : 'No Active User. Please Log in.'} 
        </Text> 
      </TouchableOpacity>
    
      {/* Log Out Button */}
      <TouchableOpacity style={styles.logOutButton} onPress={handleLogOut}>
        <Text style={styles.logOutButtonText}>Log Out</Text>
      </TouchableOpacity>

      {/* Display State */}
      <View style={styles.stateRectangle}>
        <ConditionalDisplayRectangle 
          activeUser={activeUser}
          onAccountStateChange={(state) => setAccountState(state)}
        />
      </View>

      {/* Take Dose*/}
      {showTakeDose && (<TouchableOpacity
        style={styles.takeDoseButton}
        onPress={handleTakeDosePress} // Show the modal when the button is pressed
      >
        <Text style={styles.takeDoseButtonText}>Take Dose</Text>
      </TouchableOpacity>
      )}

      {showPainLevelInput && <PainLevelInput 
      onClose={handlePainLevelInputClose} 
      onSelect={handlePainLevelSelect}
      accountState={accountState}
      userID={activeUser}
      />}

    </View>
    
    
  );
};

const styles = StyleSheet.create({
  // Design Button
  container: {
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,

  },
  // Create Account
  createAccountButton: {
    position: 'absolute',
    top: 40, // Keeps it at 40px from the top
    left: 20, // Keeps it 20px from the left
    backgroundColor: '#d269ea',
    padding: 10,
    borderRadius: 5,
    zIndex: 1, // Ensure the button is on top of other elements
  },
  createAccountButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Log In
  logInButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
    backgroundColor: '#33a2ff',
    borderRadius: 5,
  },
  logInButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Log Out
  logOutButton: {
    position: 'absolute',
    top: 85,
    right: 20,
    padding: 10,
    backgroundColor: '#f44a4a',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logOutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Display Active User
  button: {
    padding: 10,
    backgroundColor: '#9e9e9e',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 300,
    right: 90,
    zIndex: -1, // Moves this to the background

  },
  activeUserText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    zIndex: -1, // Moves this to the background
  
  },

  // State Rectange
  stateRectangle: {
    position: 'absolute',
    zIndex: -1,
    bottom: 120,
    right: 5,
  },

  // Take Dose
  takeDoseButton: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75, // Circular button
    backgroundColor: '#e046b8', // Green color for the button
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 40,
    right: 115,
    borderWidth: 3,
  },
  takeDoseButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default BlankTab;
