import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Main from './src/components/Main';

export default function App() {
  return (
    <SafeAreaProvider>
      <Main />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
