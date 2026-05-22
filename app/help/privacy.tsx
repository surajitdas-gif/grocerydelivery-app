import React from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';

export default function PrivacyScreen() {

  return (

    <ScrollView style={styles.container}>

      <Text style={styles.title}>
        Privacy Policy 🔒
      </Text>

      <Text style={styles.text}>

        We collect user information such as
        name, phone number, address and
        location to process deliveries and
        improve user experience.

        {'\n\n'}

        Your payment information is handled
        securely through trusted payment
        providers.

        {'\n\n'}

        We do not sell your personal data
        to third parties.

        {'\n\n'}

        User data is stored securely and
        used only for app functionality.

      </Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },

  text: {
    fontSize: 15,
    lineHeight: 28,
    color: '#444',
  },

});