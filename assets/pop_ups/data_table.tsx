import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { DataTable } from 'react-native-paper';

// Path for the data file
const dataFilePath = `${FileSystem.documentDirectory}data-storage.json`;

const DataTableComponent = ({ userID }: { userID: string | null }) => {
  const [accountData, setAccountData] = useState<any[]>([]);

  // Get the current active account data from data-storage.json
  useEffect(() => {
    const fetchData = async (userID: string | null) => {
      let data: any = {};

      try {
        // Read data from data-storage.json
        const fileInfo = await FileSystem.getInfoAsync(dataFilePath);
        if (fileInfo.exists) {
          const fileContent = await FileSystem.readAsStringAsync(dataFilePath);
          data = JSON.parse(fileContent);
        }

        if (userID && data[userID]) {
          setAccountData(data[userID]); // Set the account data for the given user ID
        } else {
          console.warn('No data found for userID:', userID);
          setAccountData([]); // Reset if no data is found
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(userID);
  }, [userID]);

  // Format dateTime to a readable format
  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString(); // Format as "MM/DD/YYYY, HH:MM:SS AM/PM"
  };

  return (
    <View style={styles.container}>
      {/* Table Header using react-native-paper DataTable */}
      <DataTable style={styles.dataTable}>
        <DataTable.Header style={styles.tableHeader}>
          <View style={styles.headerTextWrapper}>
            <Text style={styles.headerText}>Time</Text>
          </View>
          <View style={styles.headerTextWrapper}>
            <Text style={styles.headerText}>Pills Recommended</Text>
          </View>
          <View style={styles.headerTextWrapper}>
            <Text style={styles.headerText}>Total Pills</Text>
          </View>
        </DataTable.Header>

        {/* Data Table Rows */}
        {accountData.length > 0 ? (
          accountData.map((item, index) => (
            <DataTable.Row key={index} style={styles.tableRow}>
              <DataTable.Cell>{formatDateTime(item.dateTime)}</DataTable.Cell>
              <DataTable.Cell>{item.pillsRecommended}</DataTable.Cell>
              <DataTable.Cell>{item.numPills}</DataTable.Cell>
            </DataTable.Row>
          ))
        ) : (
          <View style={styles.emptyView}>
            <Text style={styles.emptyText}>No data available for this User ID.</Text>
          </View>
        )}
      </DataTable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  dataTable: {
    borderRadius: 10,
    width: 300,
    //overflow: 'hidden',
  },
  tableHeader: {
    height: 80,
    backgroundColor: '#007bff', // Blue background for header
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    flexDirection: 'row', // Ensure the header titles are placed horizontally
  },
  headerTextWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  tableRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
    height: 60,
  },
  emptyView: {
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    color: '#6c757d',
    textAlign: 'center',
  },
});

export default DataTableComponent;
