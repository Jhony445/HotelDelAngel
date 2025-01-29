import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenTitleProps {
  title: string;
}

const ScreenTitle: React.FC<ScreenTitleProps> = ({ title }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 15 }]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.bottomBorder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1976d2',
    paddingBottom: 18,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
        borderBottomWidth: 1,
        borderBottomColor: '#1565c0',
      },
    }),
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    letterSpacing: 0.5,
    position: 'relative',
    paddingBottom: 8,
  },
  bottomBorder: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
    width: '40%',
    alignSelf: 'center',
    marginTop: 8,
    borderRadius: 2,
  }
});

export default ScreenTitle;