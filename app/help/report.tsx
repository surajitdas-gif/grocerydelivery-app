import React, { useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ReportScreen() {

  const [problem, setProblem] =
    useState('');

  const submitReport = async () => {

    try {

      if (!problem.trim()) {

        Alert.alert(
          'Please enter your issue'
        );

        return;
      }

      const userData =
        await AsyncStorage.getItem(
          'user'
        );

      const user = userData
        ? JSON.parse(userData)
        : null;

      const payload = {

        userId:
          user?._id || '',

        userName:
          user?.name || 'Unknown User',

        issue: problem,

      };

      console.log(
        'SENDING REPORT:',
        payload
      );

      const res = await fetch(
        'https://grocerydelivery-backend.onrender.com/api/reports/create',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify(
            payload
          ),
        }
      );

      const data = await res.json();

      console.log(
        'REPORT RESPONSE:',
        data
      );

      if (data.success) {

        Alert.alert(
          'Report submitted ✅'
        );

        setProblem('');

      } else {

        Alert.alert(
          'Failed to submit report'
        );

      }

    } catch (error) {

      console.log(
        'REPORT ERROR:',
        error
      );

      Alert.alert(
        'Something went wrong'
      );

    }

  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Report Problem 🐛
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Describe your issue..."
        multiline
        value={problem}
        onChangeText={setProblem}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={submitReport}
      >

        <Text style={styles.buttonText}>
          Submit Report
        </Text>

      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    height: 180,
    textAlignVertical: 'top',
  },

  button: {
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },

});