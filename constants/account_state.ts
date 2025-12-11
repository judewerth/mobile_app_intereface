import * as FileSystem from 'expo-file-system';

// Path to the JSON data file
const dataFilePath = `${FileSystem.documentDirectory}data-storage.json`;


export const getTimeSinceLastDose = async (activeUser: string): Promise<number | boolean> => {
  try {
    // Check if the JSON file exists
    const fileInfo = await FileSystem.getInfoAsync(dataFilePath);
    if (!fileInfo.exists) {
      throw new Error("Data storage file not found.");
    }

    // Read and parse the JSON file
    const fileContent = await FileSystem.readAsStringAsync(dataFilePath);
    const data = JSON.parse(fileContent);

    // Check if the user exists in the JSON
    if (!data[activeUser]) {
      throw new Error(`User '${activeUser}' not found in the data.`);
    }

    // Retrieve user data
    const userData = data[activeUser];

    // Check if userData array is empty
    if (!userData || userData.length === 0) {
      console.log("No dose data available for this user.");
      return false; // Return boolean if no data
    }

    // Retrieve the last dose time
    const lastDose = userData[userData.length - 1].dateTime;
    const lastDoseTime = new Date(lastDose);

    // Get the current time
    const currentTime = new Date();

    // Calculate the time difference in milliseconds
    const timeDiffMs = currentTime.getTime() - lastDoseTime.getTime();

    // Convert milliseconds to rounded minutes
    const timeDiffMinutes = Math.round(timeDiffMs / (1000 * 60));

    return timeDiffMinutes;
  } catch (error) {
    console.error("Error calculating time since last dose:", error);
    throw error; // Rethrow the error for upstream handling
  }
};

