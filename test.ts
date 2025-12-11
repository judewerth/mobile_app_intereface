import { SaveUser } from './constants/save_to_json'; // Adjust this import path if needed

// Test data
const testUserId = "test1";
const testLoadCellOutput = 400;
const testNumPills = 10;

// Run the test
SaveUser(testUserId, testLoadCellOutput, testNumPills)
  .then(() => console.log("Test completed. Check data-storage.json for results."))
  .catch((error) => console.error("Test failed with error:", error));