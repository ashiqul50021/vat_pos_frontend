/**
 * Converts a numeric amount to English words (e.g. 1540.50 -> "One Thousand Five Hundred Forty BDT and Fifty Poisha Only")
 */
const ones = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const tens = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertLessThanThousand(num: number): string {
  if (num === 0) return '';
  if (num < 20) return ones[num];
  if (num < 100) {
    const rem = num % 10;
    return tens[Math.floor(num / 10)] + (rem > 0 ? ' ' + ones[rem] : '');
  }
  const rem = num % 100;
  return ones[Math.floor(num / 100)] + ' Hundred' + (rem > 0 ? ' ' + convertLessThanThousand(rem) : '');
}

export const numberToEnglishWords = (amount: number): string => {
  if (!amount || amount === 0) return 'Zero BDT Only';

  const integerPart = Math.floor(amount);
  const decimalPart = Math.round((amount - integerPart) * 100);

  const crore = Math.floor(integerPart / 10000000);
  const lakh = Math.floor((integerPart % 10000000) / 100000);
  const thousand = Math.floor((integerPart % 100000) / 1000);
  const remaining = integerPart % 1000;

  let result = '';

  if (crore > 0) result += convertLessThanThousand(crore) + ' Crore ';
  if (lakh > 0) result += convertLessThanThousand(lakh) + ' Lakh ';
  if (thousand > 0) result += convertLessThanThousand(thousand) + ' Thousand ';
  if (remaining > 0) result += convertLessThanThousand(remaining);

  result = result.trim() + ' BDT';

  if (decimalPart > 0) {
    result += ' and ' + convertLessThanThousand(decimalPart) + ' Poisha';
  }

  return result + ' Only';
};
