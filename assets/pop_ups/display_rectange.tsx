import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getTimeSinceLastDose } from '@/constants/account_state'; // Import the function

interface ConditionalDisplayRectangleProps {
    activeUser: string | null; // Allow activeUser to be null
    onAccountStateChange?: (state: 'red' | 'yellow' | 'green' | 'NoUser') => void; // Include NoUser state
  }
  
  const ConditionalDisplayRectangle: React.FC<ConditionalDisplayRectangleProps> = ({ activeUser, onAccountStateChange }) => {
    const [timeDiff, setTimeDiff] = useState<number | boolean>(false); // Time since last dose
    const [accountState, setAccountState] = useState<'red' | 'yellow' | 'green' | 'NoUser'>('NoUser'); // Default state is NoUser
  
    const t1 = 5; // Threshold 1 (4 hours)
    const t2 = 10; // Threshold 2 (6 hours)
  
    useEffect(() => {
      const fetchTimeDiff = async () => {
        if (!activeUser) {
          // Handle case when no user is logged in
          setAccountState('NoUser');
          if (onAccountStateChange) {
            onAccountStateChange('NoUser');
          }
          return;
        }
  
        try {
          const diff = await getTimeSinceLastDose(activeUser);
          setTimeDiff(diff);
  
          let newState: 'red' | 'yellow' | 'green' | 'NoUser' = 'green'; // Default state
          if (typeof diff === 'number') {
            if (diff < t1) {
              newState = 'red';
            } else if (diff < t2) {
              newState = 'yellow';
            }
          } else {
            newState = 'green'; // Fail-safe state
          }
  
          setAccountState(newState);
  
          if (onAccountStateChange) {
            onAccountStateChange(newState);
          }
        } catch (error) {
          console.error('Error fetching time difference:', error);
          setAccountState('green'); // Fail-safe: set state to green
          if (onAccountStateChange) {
            onAccountStateChange('green');
          }
        }
      };
  
      fetchTimeDiff();
    }, [activeUser]);
  
    const getDisplayText = () => {
      switch (accountState) {
        case 'red':
          return 'Red State: No Dosage is available at this time.';
        case 'yellow':
          return 'Yellow State: Dosage is available.';
        case 'green':
          return 'Green State: Dosage is recommended.';
        default:
          return '';
      }
    };
  
    if (accountState === 'NoUser') {
      // Do not render anything if no user is logged in
      return null;
    }
  
    return (
      <View
        style={[
          styles.rectangle,
          accountState === 'red'
            ? styles.red
            : accountState === 'yellow'
            ? styles.yellow
            : styles.green,
        ]}
      >
        <Text style={styles.text}>{getDisplayText()}</Text>
        {typeof timeDiff === 'number' && (
          <Text style={styles.text}>{`${timeDiff} minutes since last dose.`}</Text>
        )}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    rectangle: {
      width: '90%',
      padding: 20,
      borderRadius: 10,
      marginVertical: 10,
      justifyContent: 'center',
      alignItems: 'center',
      top: -80,
    },
    red: {
      backgroundColor: '#f44a4a', // Red color
    },
    yellow: {
      backgroundColor: '#ecd31d', // Yellow color
    },
    green: {
      backgroundColor: '#5cb139', // Green color
    },
    text: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FFF', // White text
      textAlign: 'center',
    },
  });
  
  export default ConditionalDisplayRectangle;