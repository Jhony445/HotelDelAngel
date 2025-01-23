import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SubTitleProps {
  text: string;
}

const SubTitle: React.FC<SubTitleProps> = ({ text }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
});

export default SubTitle;
