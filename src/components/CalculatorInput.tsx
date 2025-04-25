import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text, HelperText, useTheme } from 'react-native-paper';

interface CalculatorInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  prefix?: string;
  suffix?: string;
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
  helperText?: string;
  error?: boolean;
}

const CalculatorInput: React.FC<CalculatorInputProps> = ({
  label,
  value,
  onChangeText,
  prefix = '',
  suffix = '',
  keyboardType = 'decimal-pad',
  helperText,
  error = false
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        label={label}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        left={prefix ? <TextInput.Affix text={prefix} /> : undefined}
        right={suffix ? <TextInput.Affix text={suffix} /> : undefined}
        error={error}
        style={styles.input}
        theme={{
          colors: {
            primary: theme.colors.primary,
          }
        }}
      />
      {helperText && (
        <HelperText type={error ? "error" : "info"} visible={true}>
          {helperText}
        </HelperText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
  },
  input: {
    width: '100%',
  },
});

export default CalculatorInput; 