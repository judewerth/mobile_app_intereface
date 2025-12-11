import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import DataTable from '@/assets/pop_ups/data_table'; // Adjust the path as needed
import { get_active_account } from '@/constants/save_to_json';

const App = () => {
  const [showTable, setShowTable] = useState(false); // Toggle for showing the data table
  const [activeUser, setActiveUser] = useState<string | null>(null);

  const handleToggleTable = () => {
    setShowTable((prev) => !prev);
  };

  const fetchActiveUser = async () => {
    const user = await get_active_account();
    setActiveUser(user);
  };
  fetchActiveUser()

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Welcome to Dose History! Active User: {activeUser}</Text>

      {/* Button to show/hide the DataTable */}
      <Button 
        title={showTable ? "Hide Data Table" : "Show Data Table"}
        onPress={handleToggleTable}
      />

      {/* Conditionally render DataTable */}
      {showTable && (
        <View style={styles.dataTableContainer}>
          <DataTable 
          userID={activeUser}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    position: 'absolute',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    top: 50,
    backgroundColor: '#bab7b9',
    padding: 10,
  },
  subTitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  dataTableContainer: {
    marginTop: 20,
    width: '100%', // Ensures the DataTable takes up the full width
  },
});

export default App;
