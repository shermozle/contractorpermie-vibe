import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar, TouchableOpacity, Text } from 'react-native';
import { Provider as PaperProvider, MD3DarkTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Calculator from './Calculator';
import Settings from './Settings';
import { SettingsProvider } from '../utils/SettingsContext';

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#0A84FF',
    accent: '#FF9F0A',
    background: '#1C1C1E',
    surface: '#2C2C2E',
    text: '#FFFFFF',
    disabled: '#636366',
    placeholder: '#8E8E93',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: '#FF453A',
  },
};

interface TabButtonProps {
  title: string;
  icon: string;
  active: boolean;
  onPress: () => void;
}

// Create a simple custom tab navigation
const Main: React.FC = () => {
  const [index, setIndex] = useState(0);

  // Touchable tab button with icon and text
  const TabButton: React.FC<TabButtonProps> = ({ title, icon, active, onPress }) => {
    return (
      <TouchableOpacity 
        style={styles.tabButtonContainer}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={[styles.tabButton, active ? styles.activeTab : null]}>
          <MaterialCommunityIcons 
            name={icon} 
            size={24} 
            color={active ? '#0A84FF' : '#8E8E93'} 
          />
          <Text style={[
            styles.tabText, 
            { color: active ? '#0A84FF' : '#8E8E93' }
          ]}>
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <PaperProvider theme={theme}>
      <SettingsProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#1C1C1E" />
          
          {/* Main content */}
          <View style={styles.content}>
            {index === 0 ? <Calculator /> : <Settings />}
          </View>
          
          {/* Custom tab bar */}
          <View style={styles.tabContainer}>
            <View style={styles.tabBar}>
              <TabButton 
                title="Calculator" 
                icon="calculator" 
                active={index === 0} 
                onPress={() => setIndex(0)} 
              />
              <TabButton 
                title="Settings" 
                icon="cog" 
                active={index === 1} 
                onPress={() => setIndex(1)} 
              />
            </View>
          </View>
        </SafeAreaView>
      </SettingsProvider>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#1C1C1E',
  },
  content: {
    flex: 1,
  },
  tabContainer: {
    borderTopWidth: 1,
    borderTopColor: '#38383A',
    backgroundColor: '#2C2C2E',
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
  },
  tabButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    width: '100%',
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#0A84FF',
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default Main; 