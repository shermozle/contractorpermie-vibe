import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Divider, Switch, Text, Avatar, useTheme } from 'react-native-paper';
import CalculatorInput from './CalculatorInput';
import { dayRateToSalary, salaryToDayRate } from '../utils/calculatorUtils';
import { useSettings } from '../utils/SettingsContext';

const formatCurrency = (amount: number): string => {
  // Round to nearest dollar
  const roundedAmount = Math.round(amount);
  
  return roundedAmount.toLocaleString('en-AU');
};

const Calculator: React.FC = () => {
  const { settings } = useSettings();
  const theme = useTheme();
  const [dayRate, setDayRate] = useState('');
  const [baseSalary, setBaseSalary] = useState('');
  const [packageSalary, setPackageSalary] = useState('');
  const [isCalculatingFromDayRate, setIsCalculatingFromDayRate] = useState(true);
  const [isPackage, setIsPackage] = useState(false);
  const [calculatedDays, setCalculatedDays] = useState(0);
  const [workingDaysPerYear, setWorkingDaysPerYear] = useState(0);

  // Calculate working days and billable days when settings change
  useEffect(() => {
    // Calculate working days based on days per week (52 weeks in a year)
    const calculatedWorkingDays = 52 * settings.daysPerWeek;
    setWorkingDaysPerYear(calculatedWorkingDays);
    
    // Calculate billable days by subtracting leave and holidays
    const billableDays = calculatedWorkingDays - settings.annualLeave - settings.sickLeave - settings.publicHolidays;
    setCalculatedDays(billableDays);
    
    // Recalculate values when settings change
    if (dayRate && isCalculatingFromDayRate) {
      calculateFromDayRate(dayRate);
    } else if (isPackage && packageSalary) {
      calculateFromSalary(packageSalary, true);
    } else if (!isPackage && baseSalary) {
      calculateFromSalary(baseSalary, false);
    }
  }, [settings]);

  // Calculate salaries from day rate
  const calculateFromDayRate = (rateText: string) => {
    setDayRate(rateText);
    
    if (!rateText || isNaN(parseFloat(rateText))) {
      setBaseSalary('');
      setPackageSalary('');
      return;
    }
    
    const rate = parseFloat(rateText);
    const result = dayRateToSalary(rate, settings);
    
    setBaseSalary(formatCurrency(result.baseSalary));
    setPackageSalary(formatCurrency(result.packageAmount));
    
    setIsCalculatingFromDayRate(true);
  };

  // Calculate day rate from salary
  const calculateFromSalary = (salaryText: string, isPackageCalc: boolean) => {
    if (isPackageCalc) {
      setPackageSalary(salaryText);
    } else {
      setBaseSalary(salaryText);
    }
    
    if (!salaryText || isNaN(parseFloat(salaryText.replace(/,/g, '')))) {
      setDayRate('');
      if (isPackageCalc) {
        setBaseSalary('');
      } else {
        setPackageSalary('');
      }
      return;
    }
    
    const salary = parseFloat(salaryText.replace(/,/g, ''));
    const result = salaryToDayRate(salary, isPackageCalc, settings);
    
    setDayRate(formatCurrency(result.dayRate));
    
    if (isPackageCalc) {
      // Calculate base salary from package
      const baseSalaryValue = salary / (1 + settings.superRate / 100);
      setBaseSalary(formatCurrency(baseSalaryValue));
    } else {
      // Calculate package from base salary
      const packageValue = salary * (1 + settings.superRate / 100);
      setPackageSalary(formatCurrency(packageValue));
    }
    
    setIsCalculatingFromDayRate(false);
  };

  const handleBaseSalaryChange = (text: string) => {
    setIsPackage(false);
    calculateFromSalary(text, false);
  };

  const handlePackageSalaryChange = (text: string) => {
    setIsPackage(true);
    calculateFromSalary(text, true);
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      style={{backgroundColor: theme.colors.background}}
    >
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.titleContainer}>
            <Avatar.Icon size={40} icon="calculator" style={[styles.titleIcon, {backgroundColor: theme.colors.primary}]} />
            <View style={styles.titleTextContainer}>
              <Title style={styles.title}>Contract or Permie</Title>
            </View>
          </View>
          
          <Text style={styles.introText}>
            Contract or Permie is a calculator to help you compare "package" or "gross" salaries, daily contract rates and their equivalent standard salary number.
          </Text>
          
          <View style={styles.section}>
            <Title style={styles.sectionTitle}>Contractor Rate</Title>
            <CalculatorInput
              label="Day Rate"
              value={dayRate}
              onChangeText={calculateFromDayRate}
              prefix="$"
              suffix="per day"
              helperText={`Based on ${calculatedDays} billable days per year (${settings.daysPerWeek} days/week)`}
            />
          </View>
          
          <View style={styles.section}>
            <Title style={styles.sectionTitle}>Permanent Salary</Title>
            
            <CalculatorInput
              label="Base Salary (excl. super)"
              value={baseSalary}
              onChangeText={handleBaseSalaryChange}
              prefix="$"
              suffix="p.a."
            />
            
            <CalculatorInput
              label="Package (incl. super)"
              value={packageSalary}
              onChangeText={handlePackageSalaryChange}
              prefix="$"
              suffix="p.a."
              helperText={`Includes ${settings.superRate}% superannuation`}
            />
          </View>
        </Card.Content>
      </Card>
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
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 14,
  },
  titleIcon: {
    marginRight: 8,
  },
  introText: {
    marginBottom: 16,
    opacity: 0.8,
    textAlign: 'left',
  },
});

export default Calculator; 