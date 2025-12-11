// dosage_window_checker.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';


// Function to check the dosage window
export function checkDosageWindow(lastDoseTime: string): boolean {
  const currentTime = new Date();
  const lastDoseDate = new Date(lastDoseTime);
  const timeDifferenceInHours =
    (currentTime.getTime() - lastDoseDate.getTime()) / (1000 * 60 * 60); // Convert milliseconds to hours

  // If less than 4 hours, return false to indicate the prompt should stop
  return timeDifferenceInHours >= 4;
}

export function calculateDosageRecommendation(
  lastDoseTime: string,
  painInput: 'happy' | 'neutral' | 'sad'
): number {
  const currentTime = new Date();
  const lastDoseDate = new Date(lastDoseTime);
  const timeDifferenceInHours =
    (currentTime.getTime() - lastDoseDate.getTime()) / (1000 * 60 * 60); // Convert milliseconds to hours

  // Dosage logic based on time since last dose
  if (timeDifferenceInHours < 6) {
    // Less than 6 hours
    if (painInput === 'happy') {
      return 1;
    } else if (painInput === 'neutral') {
      return 1;
    } else if (painInput === 'sad') {
      return 2;
    }
  } else {
    // 6 hours or more
    if (painInput === 'happy') {
      return 1;
    } else if (painInput === 'neutral') {
      return 2;
    } else if (painInput === 'sad') {
      return 3;
    }
  }

  // Fallback in case of unexpected input (shouldn't occur with valid inputs)
  throw new Error('Invalid pain input or time difference calculation.');
}


// Component to display the pop-up when dosage window is invalid
interface DosageWindowPopupProps {
  visible: boolean;
  onClose: () => void;
}

export const DosageWindowPopup: React.FC<DosageWindowPopupProps> = ({ visible, onClose }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popupContainer}>
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
          <Text style={styles.message}>
            No dosage should be taken at this time.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

// Styles for the pop-up
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popupContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  closeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  message: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});


// dosage_recommendation.ts

// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
// import { SaveData } from '@/constants/save_to_json'; // Adjust the import path accordingly
// import { fetchAdafruitIOData } from '@/constants/adafruitIO'; // Adjust the import path accordingly

// interface TakeDosePromptProps {
//   visible: boolean;
//   onClose: () => void;
//   activeUserId: string; // Add activeUserId to the props
// }

// let DosageRecommendation: number | null = null; // Exportable variable to store the recommendation

// const TakeDosePrompt: React.FC<TakeDosePromptProps> = ({ visible, onClose, activeUserId }) => {
//   const [recommendationVisible, setRecommendationVisible] = useState(false);
//   const [recommendedDose, setRecommendedDose] = useState<number | null>(null);
//   const [loadCellOutput, setLoadCellOutput] = useState<number | null>(null);
//   const [dateTime, setDateTime] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false);

//   // Recommended doses (easily adjustable)
//   const happyDose = 1;
//   const neutralDose = 2;
//   const sadDose = 3;

//   // Fetch Adafruit IO Data
//   const fetchData = async () => {
//     const feedKey = 'loadcell'; // Feed key for the loadcell data
//     setLoading(true);
//     try {
//       const data = await fetchAdafruitIOData(feedKey); // Fetch data from Adafruit IO
//       if (data) {
//         const loadCellValue = parseFloat(data.value); // Ensure it's a number
//         if (!isNaN(loadCellValue)) {
//           setLoadCellOutput(loadCellValue); // Set the load cell output as a number
//         } else {
//           console.error('Invalid load cell output value');
//         }
//         setDateTime(data.created_at); // Set the timestamp from the data
//       }
//     } catch (error) {
//       console.error('Error fetching Adafruit IO data:', error);
//       Alert.alert('Error', 'There was an issue fetching the data.');
//     }
//     setLoading(false);
//   };

//   // Trigger data fetching when the component is mounted or when DosageRecommendation changes
//   useEffect(() => {
//     if (visible && DosageRecommendation !== null) {
//       fetchData();
//     }
//   }, [visible, DosageRecommendation]);  

//   useEffect(() => {
//     if (!visible) {
//       setRecommendedDose(null);
//       setLoadCellOutput(null);
//       setDateTime('');
//     }
//   }, [visible]);

//   const handleFacePress = (dose: number) => {
//     setRecommendedDose(dose); // Set the recommended dose for display
//     DosageRecommendation = dose; // Set global recommendation for external use
//     setRecommendationVisible(true); // Open the recommendation pop-up
//   };

//   const closeAll = () => {
//     DosageRecommendation = null; // Reset recommendation
//     setRecommendationVisible(false);
//     onClose();
//   };
  

//   useEffect(() => {
//     // Save the data when DosageRecommendation, loadCellOutput, and dateTime are valid
//     if (DosageRecommendation !== null && loadCellOutput !== null && dateTime) {
//       SaveData(loadCellOutput, dateTime, DosageRecommendation).catch((error) => {
//         console.error('Error saving data:', error);
//         Alert.alert('Error', 'Failed to save the dose data.');
//       });
//     }
//   }, [DosageRecommendation, loadCellOutput, dateTime]);

//   return (
//     <>
//       {/* Initial Prompt: Select Pain Level */}
//       <Modal
//         transparent={true}
//         animationType="fade"
//         visible={visible && !recommendationVisible}
//         onRequestClose={onClose}
//       >
//         <View style={styles.overlay}>
//           <View style={styles.container}>
//             <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
//               <Text style={styles.closeText}>X</Text>
//             </TouchableOpacity>
//             <Text style={styles.title}>Please indicate your current pain level:</Text>
//             <View style={styles.faceContainer}>
//               <TouchableOpacity onPress={() => handleFacePress(happyDose)}>
//                 <Image source={require('@/assets/images/happy_face.png')} style={styles.faceImage} />
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => handleFacePress(neutralDose)}>
//                 <Image source={require('@/assets/images/neutral_face.png')} style={styles.faceImage} />
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => handleFacePress(sadDose)}>
//                 <Image source={require('@/assets/images/sad_face.png')} style={styles.faceImage} />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Recommendation Pop-up */}
//       <Modal
//         transparent={true}
//         animationType="fade"
//         visible={recommendationVisible}
//         onRequestClose={closeAll}
//       >
//         <View style={styles.overlay}>
//           <View style={styles.container}>
//             <Text style={styles.title}>
//               We recommend you take {recommendedDose} pill{recommendedDose && recommendedDose > 1 ? 's' : ''}.
//             </Text>
//             <TouchableOpacity onPress={closeAll} style={styles.closeButton}>
//               <Text style={styles.closeText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   container: {
//     width: '80%',
//     height: '40%',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 20,
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   closeIcon: {
//     position: 'absolute',
//     top: 10,
//     right: 10, // Moved to the right corner
//     padding: 5,
//   },
//   closeText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   faceContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     marginTop: 20,
//   },
//   faceImage: {
//     width: 60,
//     height: 60,
//     resizeMode: 'contain',
//   },
//   closeButton: {
//     marginTop: 20,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     backgroundColor: '#ddd',
//     borderRadius: 5,
//   },
// });

// export default TakeDosePrompt;
// export { DosageRecommendation };
