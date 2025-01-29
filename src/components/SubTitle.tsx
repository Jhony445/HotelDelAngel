import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

interface SubTitleProps {
  text: string;
}

const SubTitle: React.FC<SubTitleProps> = ({ text }) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    marginHorizontal: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
    marginHorizontal: 12,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Medium' : 'sans-serif-medium',
    letterSpacing: 0.8,
  },
  line: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
  },
});

export default SubTitle;