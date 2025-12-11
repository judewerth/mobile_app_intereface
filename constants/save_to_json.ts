import * as FileSystem from 'expo-file-system';

interface UserData {
  numPills: number;
  dateTime: string;
  pillsRecommended: number;
}

interface DataStorage {
  current_active_account: string; // Explicitly define this as always a string
  [userId: string]: UserData[] | string; // Allow userId keys or current_active_account
}

const dataFilePath = `${FileSystem.documentDirectory}data-storage.json`;

export const SaveData = async (
  userID: string,
  numPills: number,
  dateTime: string,
  pillsRecommended: number
) => {
  try {
    // Check if the file exists
    const fileInfo = await FileSystem.getInfoAsync(dataFilePath);
    let data: DataStorage = { current_active_account: userID };

    if (fileInfo.exists) {
      const fileContent = await FileSystem.readAsStringAsync(dataFilePath);
      data = JSON.parse(fileContent);
    }

    // If user already exists, append the new data to their list
    if (data[userID] && Array.isArray(data[userID])) {
      const newEntry: UserData = { numPills, dateTime, pillsRecommended };
      (data[userID] as UserData[]).push(newEntry);
    } else {
      // If user does not exist, create a new list with the first entry
      data[userID] = [{ numPills, dateTime, pillsRecommended }];
    }

    // Update the current active account
    data.current_active_account = userID;

    // Write updated data back to the file
    const formattedData = JSON.stringify(data, null, 2);
    await FileSystem.writeAsStringAsync(dataFilePath, formattedData, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    console.log("Success", `Data for user ${userID} saved successfully.`);
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

export const set_active_account = async (user_id: string): Promise<boolean> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(dataFilePath);
    let data: any = {};

    // Check if the file exists
    if (fileInfo.exists) {
      const fileContent = await FileSystem.readAsStringAsync(dataFilePath);
      data = JSON.parse(fileContent);
    }

    // Check if the user_id exists in the JSON data
    if (user_id != "") {
      if (!data[user_id]) {
        console.error(`User with ID ${user_id} does not exist.`);
        return false; // Indicate failure
      }
    }

    // Update or set the current_active_account field
    data.current_active_account = user_id;

    // Write the updated data back to the file
    const formattedData = JSON.stringify(data, null, 2);
    await FileSystem.writeAsStringAsync(dataFilePath, formattedData, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    console.log(`Active account successfully updated to ${user_id}.`);
    return true; // Indicate success
  } catch (error) {
    console.error("Error setting active account:", error);
    throw error; // Propagate any unexpected errors
  }
};


export const logOutUser = async () => {
  try {
    // Read the current data from the file
    const fileContents = await FileSystem.readAsStringAsync(dataFilePath);
    const data = JSON.parse(fileContents);

    // Reset the active user
    data.current_active_user = ""; // Set the active user to an empty string

    // Write the updated data back to the file
    await FileSystem.writeAsStringAsync(dataFilePath, JSON.stringify(data, null, 2));
    console.log('Logged out successfully, current_active_user is reset.');
  } catch (error) {
    console.error('Error logging out:', error);
  }
  return null
};

export const get_active_account = async (): Promise<string | null> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(dataFilePath);

    // Check if the file exists
    if (!fileInfo.exists) {
      console.log('Error', 'Data storage file not found.');
      return null;
    }

    // Read and parse the file
    const fileContent = await FileSystem.readAsStringAsync(dataFilePath);
    const data = JSON.parse(fileContent);

    // Check if current_active_account exists
    if (!data.current_active_account) {
      console.log('No Active Account', 'There is currently no active account.');
      return null;
    }

    // Return the active account ID
    console.log(`Current active account: ${data.current_active_account}`);
    return data.current_active_account;
  } catch (error) {
    console.error('Error accessing active account:', error);
    return null;
  }
};