import {Platform} from 'react-native';

export const productSkus = Platform.select({
  android: [
    '1000_diamonds',
    '1500_diamonds',
    '4500_diamonds',
    '7000_diamonds',
    '13000_diamonds',
    '27500_diamonds',
    '50000_diamonds',
    '75000_diamonds',
    '90000_diamonds',
    '150000_diamonds',
    '190000_diamonds',
    '250000_diamonds',
    '350000_diamonds',
  ],
  ios: [
    '1000_diamonds',
    '1500_diamonds',
    '4500_diamonds',
    '7000_diamonds',
    '13000_diamonds',
    '27500_diamonds',
    '50000_diamonds',
    '75000_diamonds',
    '90000_diamonds',
    '150000_diamonds',
    '190000_diamonds',
    '250000_diamonds',
    '350000_diamonds',
  ],
});
