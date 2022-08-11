const alphabetArray = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];

export default function getLetterByAlphabetNumber (number = 1) {
  // TODO: Fix out of range
  return alphabetArray[number - 1] || Math.floor(Math.random() * 1000).toString();
};
