import { ALL_WORDS } from "../constants/dictionary";
import { isSubSequence } from "./validateWord";

export const totalMatchingWords = (letters: string[]): number => {
  return ALL_WORDS.filter((word) => {
    return isSubSequence(letters, word, letters.length, word.length);
  }).length;
};

export const firstMatchingWord = (letters: string[]): string => {
  return ALL_WORDS.find((word) => {
    return isSubSequence(letters, word, letters.length, word.length);
  });
};

export const wordWithLettersNotInOrder = (letters: string[]): string => {
  return ALL_WORDS.find((word) => {
    return (
      !isSubSequence(letters, word, letters.length, word.length) &&
      word.includes(letters[0][0]) &&
      word.includes(letters[1][0]) &&
      word.includes(letters[2][0])
    );
  });
};
