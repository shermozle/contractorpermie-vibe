import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Button, Text, Snackbar, Avatar, useTheme } from 'react-native-paper';
import CalculatorInput from './CalculatorInput';
import { useSettings } from '../utils/SettingsContext';

const Settings: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const theme = useTheme();
  
  const [annualLeave, setAnnualLeave] = useState(settings.annualLeave.toString());
  const [sickLeave, setSickLeave] = useState(settings.sickLeave.toString());
  const [publicHolidays, setPublicHolidays] = useState(settings.publicHolidays.toString());
  const [superRate, setSuperRate] = useState(settings.superRate.toString());
  const [daysPerWeek, setDaysPerWeek] = useState(settings.daysPerWeek.toString());
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Update local state when context settings change
  useEffect(() => {
    setAnnualLeave(settings.annualLeave.toString());
    setSickLeave(settings.sickLeave.toString());
    setPublicHolidays(settings.publicHolidays.toString());
    setSuperRate(settings.superRate.toString());
    setDaysPerWeek(settings.daysPerWeek.toString());
  }, [settings]);
  
  const handleSave = async () => {
    try {
      await updateSettings({
        annualLeave: parseInt(annualLeave) || settings.annualLeave,
        sickLeave: parseInt(sickLeave) || settings.sickLeave,
        publicHolidays: parseInt(publicHolidays) || settings.publicHolidays,
        superRate: parseFloat(superRate) || settings.superRate,
        daysPerWeek: parseInt(daysPerWeek) || settings.daysPerWeek,
      });
      setSnackbarMessage('Settings saved successfully! Your preferences will be remembered next time you use the app.');
      setSnackbarVisible(true);
    } catch (error) {
      setSnackbarMessage('Error saving settings. Please try again.');
      setSnackbarVisible(true);
    }
  };
  
  const handleReset = () => {
    setAnnualLeave(settings.annualLeave.toString());
    setSickLeave(settings.sickLeave.toString());
    setPublicHolidays(settings.publicHolidays.toString());
    setSuperRate(settings.superRate.toString());
    setDaysPerWeek(settings.daysPerWeek.toString());
  };
  
  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      style={{backgroundColor: theme.colors.background}}
    >
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.titleContainer}>
            <Avatar.Icon size={40} icon="cog" style={[styles.titleIcon, {backgroundColor: theme.colors.primary}]} />
            <View style={styles.titleTextContainer}>
              <Title style={styles.title}>Calculator Settings</Title>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionDescription}>
              Adjust the default values used in the calculation.
            </Text>
          </View>
          
          <View style={styles.section}>
            <Title style={styles.sectionTitle}>Work Schedule</Title>
            
            <CalculatorInput
              label="Days Worked Per Week"
              value={daysPerWeek}
              onChangeText={setDaysPerWeek}
              suffix="days"
              keyboardType="numeric"
              helperText="Standard work week (typically 5 days)"
            />
          </View>
          
          <View style={styles.section}>
            <Title style={styles.sectionTitle}>Leave Entitlements</Title>
            
            <CalculatorInput
              label="Annual Leave"
              value={annualLeave}
              onChangeText={setAnnualLeave}
              suffix="days"
              keyboardType="numeric"
            />
            
            <CalculatorInput
              label="Sick Leave"
              value={sickLeave}
              onChangeText={setSickLeave}
              suffix="days"
              keyboardType="numeric"
            />
            
            <CalculatorInput
              label="Public Holidays"
              value={publicHolidays}
              onChangeText={setPublicHolidays}
              suffix="days"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.section}>
            <Title style={styles.sectionTitle}>Superannuation</Title>
            
            <CalculatorInput
              label="Super Rate"
              value={superRate}
              onChangeText={setSuperRate}
              suffix="%"
              keyboardType="decimal-pad"
              helperText="Standard superannuation contribution rate"
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <Button 
              mode="outlined" 
              onPress={handleReset}
              style={styles.button}
            >
              Reset
            </Button>
            <Button 
              mode="contained" 
              onPress={handleSave}
              style={styles.button}
              buttonColor={theme.colors.primary}
            >
              Save Settings
            </Button>
          </View>
        </Card.Content>
      </Card>
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  titleTextContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  sectionDescription: {
    marginBottom: 8,
    fontSize: 14,
    opacity: 0.8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  button: {
    minWidth: 120,
  },
  titleIcon: {
    marginRight: 8,
  },
});

export default Settings; 