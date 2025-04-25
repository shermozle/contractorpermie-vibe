import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Settings {
  annualLeave: number;
  sickLeave: number;
  publicHolidays: number;
  superRate: number;
  daysPerWeek: number;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  annualLeave: 20,
  sickLeave: 10,
  publicHolidays: 11,
  superRate: 11.5,
  daysPerWeek: 5,
};

const SETTINGS_STORAGE_KEY = 'contractorpermie_settings';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    // Initialize with default settings
    return { ...defaultSettings };
  });
  
  const [isInitialized, setIsInitialized] = useState(false);

  // Load settings from AsyncStorage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
        if (storedSettings) {
          const parsedSettings = JSON.parse(storedSettings);
          setSettings(parsedSettings);
        }
      } catch (error) {
        console.error('Error loading settings from storage:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadSettings();
  }, []);

  // Check superannuation rate after settings are loaded
  useEffect(() => {
    // Only run after settings are loaded from storage
    if (isInitialized) {
      // Check if date is on or after July 1st, 2025
      const currentDate = new Date();
      const july2025 = new Date(2025, 6, 1); // Month is 0-indexed, so 6 is July
      
      if (currentDate >= july2025 && settings.superRate < 12.0) {
        updateSettings({ superRate: 12.0 });
      }
    }
  }, [isInitialized]);

  const updateSettings = async (newSettings: Partial<Settings>) => {
    console.log('Updating settings:', newSettings);
    
    const updatedSettings = {
      ...settings,
      ...newSettings
    };
    
    setSettings(updatedSettings);
    
    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
      console.log('Settings saved to storage');
    } catch (error) {
      console.error('Error saving settings to storage:', error);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}; 