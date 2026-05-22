import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function FAQScreen() {

  const faqs = [
    {
      q: 'How can I track my order?',
      a: 'Go to My Orders to track delivery status.',
    },

    {
      q: 'Can I cancel my order?',
      a: 'Orders can be cancelled before preparation starts.',
    },

    {
      q: 'Which payment methods are supported?',
      a: 'UPI, Card and Cash on Delivery are supported.',
    },

    {
      q: 'How do I contact support?',
      a: 'Use the AI chat support section in Profile.',
    },

    {
      q: 'What if payment fails?',
      a: 'No money will be deducted for failed transactions.',
    },
  ];

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>
        FAQs ❓
      </Text>

      {faqs.map((item, index) => (

        <View
          key={index}
          style={styles.card}
        >

          <Text style={styles.question}>
            {item.q}
          </Text>

          <Text style={styles.answer}>
            {item.a}
          </Text>

        </View>

      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
  },

  question: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },

  answer: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },

});