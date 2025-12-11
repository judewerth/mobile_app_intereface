import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import LogIn from '@/assets/pop_ups/log_in';
import NoDosage from '@/assets/pop_ups/no_dosage';  // Assuming this is the NoDosage pop-up component

const dataFilePath = `${FileSystem.documentDirectory}data-storage.json`;

const TakeDosePromptUtils = ({ onComplete }: { onComplete: (userId: string) => void }) => {
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [showLogIn, setShowLogIn] = useState<boolean>(false);
  const [showNoDosage, setShowNoDosage] = useState<boolean>(false);

  useEffect(() => {
    const checkActiveAccount = async () => {
      try {
        // Read the data from the storage file
        const fileInfo = await FileSystem.getInfoAsync(dataFilePath);

        if (!fileInfo.exists) {
          Alert.alert("Error", "No data-storage.json file found. Please log in or create an account.");
          setShowLogIn(true);
          return;
        }

        const fileContent = await FileSystem.readAsStringAsync(dataFilePath);
        const data = JSON.parse(fileContent);

        const currentActiveAccount = data.current_active_account;

        if (!currentActiveAccount || currentActiveAccount === "") {
          // No active user, show the LogIn pop-up
          setShowLogIn(true);
        } else {
          // An active account exists
          setActiveUserId(currentActiveAccount);
          onComplete(currentActiveAccount);

          // After getting the user ID, check the latest dose timing
          await checkDoseTiming(currentActiveAccount, data);
        }
      } catch (error) {
        console.error("Error reading data-storage.json:", error);
        Alert.alert("Error", "There was an issue accessing the user data.");
      }
    };

    checkActiveAccount();
  }, []);

  const checkDoseTiming = async (userId: string, data: any) => {
    const userData = data[userId]?.userData || [];

    if (userData.length === 0) {
      Alert.alert("Error", "No dosage data available for this user.");
      return;
    }

    // Get the most recent dose dateTime
    const mostRecentDose = userData[userData.length - 1];
    const mostRecentDoseTime = new Date(mostRecentDose.dateTime);
    const currentTime = new Date();

    // Calculate the time difference in minutes
    const timeDifferenceInMinutes = (currentTime.getTime() - mostRecentDoseTime.getTime()) / (1000 * 60);

    console.log(`Time since last dose: ${timeDifferenceInMinutes} minutes`);

    if (timeDifferenceInMinutes < 240) {
      // If time difference is less than 240 minutes (4 hours), show the NoDosage pop-up
      setShowNoDosage(true);
    }
  };

  if (showLogIn) {
    return (
      <View>
        <LogIn
          onLogIn={(userId: string) => {
            setActiveUserId(userId);
            onComplete(userId); // Return the user ID once obtained
            setShowLogIn(false); // Close the pop-up
          }}
          onClose={() => setShowLogIn(false)} // Close the pop-up
        />
      </View>
    );
  }

  if (showNoDosage) {
    return (
      <View>
        <NoDosage onClose={() => setShowNoDosage(false)} />
      </View>
    );
  }

  return <View />;
};

export default TakeDosePromptUtils;
