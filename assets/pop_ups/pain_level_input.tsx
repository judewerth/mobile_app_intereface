import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SaveData } from '@/constants/save_to_json';
import BottleUpright from '@/assets/pop_ups/bottle_upright'; // Import the BottleUpright component
import { get_active_account } from '@/constants/save_to_json';

const PainLevelInput = ({
  onClose,
  onSelect,
  accountState,
  userID,
}: {
  onClose: () => void;
  onSelect: (level: string) => void;
  accountState: 'red' | 'yellow' | 'green' | 'NoUser';
  userID: string | null;
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string>(''); // Initially empty
  const [pillsRecommended, setPillsRecommended] = useState<number | null>(null); // Initially null
  const [showBottleUpright, setShowBottleUpright] = useState(false);
  const [numPills, setNumPills] = useState<number | null>(null);
  const [doseTime, setDoseTime] = useState<string | null>(null);
  const [showPainInputPrompt, setPainInputPrompt] = useState(true); 
  const [showContinueButton, setShowContinueButon] = useState(false);

  // Function to handle the creation of the user account
  const handlePainInput = () => {
    setPainInputPrompt(true); 
  };

  useEffect(() => {
    if (selectedLevel) {
      const recommendedPills = getRecommendedPills(selectedLevel);
      setPillsRecommended(recommendedPills);
    }
  }, [selectedLevel, accountState]);

  const getRecommendedPills = (level: string): number => {
    if (accountState === 'yellow') {
      return level === 'happy' || level === 'neutral' ? 1 : 2;
    } else if (accountState === 'green') {
      return level === 'happy' ? 1 : level === 'neutral' ? 2 : 3;
    }
    return 0;
  };

  const handleSelectPainLevel = (level: string) => {
    setSelectedLevel(level); // Update the selected pain level
    onSelect(level); // Pass the selected level to the parent
    setShowContinueButon(true)
  };

  const handleDataExtracted = (extractedNumPills: number, extractedDoseTime: string) => {
    setNumPills(extractedNumPills);
    setDoseTime(extractedDoseTime);
    SaveData(String(userID), extractedNumPills, extractedDoseTime, Number(pillsRecommended));
    console.log(
      `Saved data userID: ${userID}, numPills: ${extractedNumPills}, doseTime: ${extractedDoseTime}, pillsRecommended: ${pillsRecommended} to data-storage.json`
    );
  };

  const handleCloseBottleUpright = () => {
    setShowBottleUpright(false);
    setPainInputPrompt(false)
  };

  return (
    <View style={styles.container}>
      {showPainInputPrompt && (
        <View style={styles.Background}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <Text style={styles.promptText}>Please input your pain level.</Text>
          <View style={styles.imageRow}>
            <TouchableOpacity onPress={() => handleSelectPainLevel('happy')}>
              <Image source={require('@/assets/images/happy_face.png')} style={styles.image} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelectPainLevel('neutral')}>
              <Image source={require('@/assets/images/neutral_face.png')} style={styles.image} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelectPainLevel('sad')}>
              <Image source={require('@/assets/images/sad_face.png')} style={styles.image} />
            </TouchableOpacity>
          </View>
          <Text style={styles.pillsText}>
            Pills Recommended: {pillsRecommended !== null ? pillsRecommended : ''}
          </Text>

          {showContinueButton && (
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => {
                setShowBottleUpright(true);
                setPainInputPrompt(false);
              }}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {showBottleUpright && (
        <BottleUpright
          onClose={handleCloseBottleUpright}
          onDataExtracted={handleDataExtracted}
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
  Background: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#b95fe0',
    position: 'absolute',
    left: 2,
    top: 140,
    height: 250,
    width: 370,
    zIndex: -1, // Ensure this is below the BottleUpright pop-up
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
  promptText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  pillsText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  continueButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});

export default PainLevelInput;
