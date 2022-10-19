const alphabetArray = [
  'a', 'b', 'c', 'd',
  'e', 'f', 'g', 'h',
  'i', 'j', 'k', 'l',
  'm', 'n', 'o', 'p',
  'q', 'r', 's', 't',
  'u', 'v', 'w', 'x',
  'y', 'z',
];

export default function getLetterByAlphabetNumber(n = 1) {
  const res = alphabetArray[n % 26];
  return n >= 26 ? getLetterByAlphabetNumber(Math.floor(n / 26) - 1) + res : res;
}
