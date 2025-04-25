export interface CalculatorSettings {
  annualLeave: number;
  sickLeave: number;
  publicHolidays: number;
  superRate: number;
  daysPerWeek: number;
}

/**
 * Calculate annual salary from contractor day rate
 * @param dayRate Daily contractor rate in AUD
 * @param settings Calculator settings
 * @returns Object containing different salary values
 */
export const dayRateToSalary = (
  dayRate: number, 
  settings: CalculatorSettings
) => {
  const { annualLeave, sickLeave, publicHolidays, superRate, daysPerWeek } = settings;
  
  // Working days in a year (52 weeks × days per week)
  const workingDaysInYear = 52 * daysPerWeek;
  
  // Billable days (working days minus leave, holidays, and sick days)
  const billableDays = workingDaysInYear - annualLeave - sickLeave - publicHolidays;
  
  // Calculate annual billable amount
  const annualBillable = dayRate * billableDays;
  
  // Calculate superannuation amount
  const superAmount = (annualBillable * superRate) / 100;
  
  // Calculate package (salary plus super)
  const packageAmount = annualBillable + superAmount;
  
  return {
    baseSalary: Math.round(annualBillable),
    superAmount: Math.round(superAmount),
    packageAmount: Math.round(packageAmount)
  };
};

/**
 * Calculate contractor day rate from annual salary
 * @param annualSalary Annual salary in AUD
 * @param isPackage Whether the salary is a package including super
 * @param settings Calculator settings
 * @returns Contractor day rate
 */
export const salaryToDayRate = (
  annualSalary: number,
  isPackage: boolean,
  settings: CalculatorSettings
) => {
  const { annualLeave, sickLeave, publicHolidays, superRate, daysPerWeek } = settings;
  
  // Working days in a year (52 weeks × days per week)
  const workingDaysInYear = 52 * daysPerWeek;
  
  // Billable days (working days minus leave, holidays, and sick days)
  const billableDays = workingDaysInYear - annualLeave - sickLeave - publicHolidays;
  
  let baseSalary = annualSalary;
  
  // If it's a package, we need to extract the base salary
  if (isPackage) {
    baseSalary = annualSalary / (1 + superRate / 100);
  }
  
  // Calculate day rate
  const dayRate = baseSalary / billableDays;
  
  return {
    dayRate: Math.round(dayRate),
    billableDays
  };
}; 