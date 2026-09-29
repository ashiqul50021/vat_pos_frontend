import { numberToEnglishWords } from './numberToEnglishWords';

/**
 * Fallback converter for word representations (returns English words).
 */
export const numberToBengaliWords = (amount: number): string => {
  return numberToEnglishWords(amount);
};
