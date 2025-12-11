import React, { useState, useEffect } from 'react';
import { View, Alert, Text, Button } from 'react-native';
import * as FileSystem from 'expo-file-system';
import LogIn from '@/assets/pop_ups/log_in';
import NoDosage from '@/assets/pop_ups/no_dosage';
import BottleUpright from '@/assets/pop_ups/bottle_upright';
import PainLevelInput from '@/assets/pop_ups/pain_level_input';  // Assuming you have this component
import { exportAdafruitIOData } from '@/constants/adafruitIO';

const dataFilePath = `${FileSystem.documentDirectory}data-storage.json`;

const TakeDosePromptUtils = ({ onComplete }: { onComplete: (userId: string) => void }) => {
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [showLogIn, setShowLogIn] = useState<boolean>(false);
  const [showNoDosage, setShowNoDosage] = useState<boolean>(false);
  const [showBottleUpright, setShowBottleUpright] = useState<boolean>(false);
  const [showPainLevelInput, setShowPainLevelInput] = useState<boolean>(false);

  useEffect(() => {
    const checkActiveAccount = async () => {
      try {
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
          setShowLogIn(true);
        } else {
          setActiveUserId(currentActiveAccount);
          onComplete(currentActiveAccount);
          
          // After getting the user ID, we proceed to extract dose timing and check the time difference
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
      // If time difference is less than 4 hours, show the "no_dosage.tsx" pop-up
      setShowNoDosage(true);
    } else {
      // If time difference is greater than 240 minutes (4 hours), show the "bottle-upright.tsx" pop-up
      setShowBottleUpright(true);
      // After showing the pop-up, update the Adafruit IO feed with value 1
      await updateAdafruitIO();
    }
  };

  const updateAdafruitIO = async () => {
    try {
      const response = await exportAdafruitIOData(1, "TakeDose");
      if (response) {
        console.log("Successfully updated the TakeDose feed on Adafruit IO:", response);
      } else {
        console.error("Failed to update Adafruit IO feed.");
      }
    } catch (error) {
      console.error("Error updating Adafruit IO feed:", error);
    }
  };

  if (showLogIn) {
    return (
      <View>
        <LogIn
          onLogIn={(userId: string) => {
            setActiveUserId(userId);
            onComplete(userId);
            setShowLogIn(false);
          }}
          onClose={() => setShowLogIn(false)}
        />
      </View>
    );
  }

  const NoDosage = ({ onClose }: { onClose: () => void }) => {
    return (
      <div>
        <p>No dosage available.</p>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };

  if (showNoDosage) {
    return (
      <View>
        <NoDosage onClose={() => setShowNoDosage(false)} />
      </View>
    );
  }

  if (showBottleUpright) {
    return (
      <View>
        <BottleUpright onClose={() => setShowBottleUpright(false)} />
      </View>
    );
  }

  interface PainLevelInputProps {
    onClose: () => void;
    onSelect: (level: string) => void;
  }
  
  const PainLevelInput: React.FC<PainLevelInputProps> = ({ onClose, onSelect }) => {
    const [level, setLevel] = useState('');
  
    const handleSubmit = () => {
      onSelect(level);
      onClose();
    };
  
    return (
      <div>
        <input
          type="number"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          placeholder="Enter pain level"
        />
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
  

  if (showPainLevelInput) {
    return (
      <View>
        <PainLevelInput onClose={() => setShowPainLevelInput(false)} onSelect={(level) => console.log(level)} />
      </View>
    );
  }

  return <View />;
};

export default TakeDosePromptUtils;
