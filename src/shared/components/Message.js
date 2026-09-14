import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Message({ message, type }) {
  if (!message) return null;
  return (
    <View style={[styles.container, { backgroundColor: type === 'error' ? '#FF4D4D' : '#4CAF50' }]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, borderRadius: 8, marginHorizontal: 20, marginBottom: 15 },
  text: { color: '#fff', textAlign: 'center', fontWeight: '600' }
});
