import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router'; // Slot permet de rendre les enfants de ce layout
import BottomNav from '@/components/navigation/BottomNav';

const HomeLayout = () => {
  return (
    <View style={styles.container}>
      {/* Cette vue va rendre les pages actuelles de la section "home" */}
      <View style={styles.content}>
        <Slot /> 
      </View>
      {/* La BottomNav sera toujours présente en bas */}
      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
});

export default HomeLayout;
