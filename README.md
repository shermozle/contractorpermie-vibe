# ContractorPermie Vibe

A cross-platform calculator app for converting between contractor day rates and permanent salary packages in Australia.

## Features

- Calculate the equivalent annual salary from a contractor day rate
- Calculate the equivalent contractor day rate from an annual salary
- Support for both base salary and package (including superannuation) calculations
- Customizable settings for:
  - Days worked per week
  - Annual leave days
  - Sick leave days
  - Public holidays
  - Superannuation rate
- Settings are saved to device storage and persist between sessions
- Automatic adjustment of superannuation rate to 12% after July 1st, 2025

## Running the App

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
2. Install dependencies:

```
npm install
```

### Running in Development

```
# For web:
npm run web

# For iOS:
npm run ios

# For Android:
npm run android
```

## Building for Production

### Web

```
npx expo export:web
```

The web build will be created in the `web-build` directory. You can deploy this to any static hosting service.

### iOS / Android

For building native apps for app stores, refer to the Expo documentation:
- [Building iOS Apps](https://docs.expo.dev/build/setup/)
- [Building Android Apps](https://docs.expo.dev/build-reference/apk/)

## Technology Stack

- React Native
- Expo
- TypeScript
- React Native Paper (UI components)

## How It Works

The app uses the following formula to convert between contractor day rates and permanent salaries:

- Working days in a year: 260 (52 weeks × 5 days)
- Billable days: Working days - Annual Leave - Sick Leave - Public Holidays
- Annual Salary = Day Rate × Billable Days
- Package = Annual Salary + Superannuation
- Day Rate = Annual Salary ÷ Billable Days

The default values are:
- Annual Leave: 20 days
- Sick Leave: 10 days
- Public Holidays: 11 days
- Superannuation Rate: 11.5% (12% after July 1st, 2025) 