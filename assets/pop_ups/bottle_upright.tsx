import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { fetchAdafruitIOData } from '@/constants/adafruitIO';
import { exportAdafruitIOData } from '@/constants/adafruitIO';

const BottleUpright = ({ onClose, onDataExtracted }: { onClose: () => void, onDataExtracted: (numPills: number, doseTime: string) => void }) => {
  const [isWaiting, setIsWaiting] = useState(false);
  const [numPills, setNumPills] = useState<number | null>(null);
  const [doseTime, setDoseTime] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const initiateProcess = async () => {
    try {
      await exportAdafruitIOData(1, 'takedose');
      setIsWaiting(true);

      const checkDoseSent = async () => {
        const result = await fetchAdafruitIOData('dosesent');
        return result && Number(result.value) === 1;
      };

      const interval = setInterval(async () => {
        const doseSent = await checkDoseSent();
        if (doseSent) {
          clearInterval(interval);

          const loadCellData = await fetchAdafruitIOData('loadcell');
          if (loadCellData && loadCellData.value !== undefined) {
            const numPillsValue = Number(loadCellData.value);
            setNumPills(numPillsValue);
            setDoseTime(String(loadCellData.created_at));
            onDataExtracted(numPillsValue, String(loadCellData.created_at)); // Pass data back to CreateAccount
          }

          await exportAdafruitIOData(0, 'dosesent');
          setIsWaiting(false);
          setIsComplete(true);
        }
      }, 300);
    } catch (error) {
      console.error('Error during process:', error);
      setIsWaiting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textBackground}>
        <Text style={styles.title}>
          After pressing continue the bottle will unlock. Take or store pills, then place on a flat surface.
        </Text>
      </View>
      <View style={styles.Background}>
        <Image source={require('@/assets/images/bottle.png')} style={styles.image} />
      </View>
      {!isWaiting && !isComplete && (
        <TouchableOpacity style={styles.continueButton} onPress={initiateProcess}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      )}
      {isWaiting && (
        <View style={styles.waitContainer}>
          <Text style={styles.waitText}>Please Wait...</Text>
        </View>
      )}
      {isComplete && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
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
    backgroundColor: '#f2f2f2',
  },
  textBackground: {
    position: 'absolute',
    top: 150, // Adjust as needed to place it within the container
    left: 10,
    backgroundColor: 'rgba(128, 128, 128, 0.8)', // Grey background for text
    padding: 15, // Increased padding for more space around the text
    borderRadius: 5,
    marginBottom: 20,
    width: 350,
    borderWidth: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    lineHeight: 20, // Optional: Adjust line height for better readability
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
    height: 280,
    width: 370,
    zIndex: -1, // Ensure this is below the BottleUpright pop-up
  },
  image: {
    position: 'absolute',
    top: 100, // Position the image at the top within the container
    left: 130,
    width: 100,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
    zIndex: 1,
    borderWidth: 2,
  },
  continueButton: {
    position: 'absolute',
    top: 380, // Position the continue button at the bottom of the container
    left: 140,
    backgroundColor: '#ed810e',
    padding: 10,
    borderRadius: 5,
    zIndex: 1,

  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    zIndex: 1,
  },
  waitContainer: {
    position: 'absolute',
    top: 380, // Position the wait container just above the continue button
    left: 120,
    backgroundColor: '#D3D3D3', // Light grey for waiting
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  waitText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    zIndex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 380, // Position the close button at the top
    left: 150, // Align it to the right
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    zIndex: 1,
  },
});

export default BottleUpright;