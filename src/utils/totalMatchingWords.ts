import { Word } from "../App";
import { MAX_LENGTH, MIN_LENGTH } from "../constants";
import { ALL_WORDS } from "../constants";
import { isSubSequence } from "./validateWord";

export const allMatchingWords = (
  letters: string[],
  length?: number,
  excludedWords?: Word[]
): string[] => {
  return ALL_WORDS.filter((word) => {
    return (
      word.length >= MIN_LENGTH &&
      word.length <= MAX_LENGTH &&
      isSubSequence(letters, word) &&
      (length ? word.length === length : true) &&
      (excludedWords ? !excludedWords.find((ew) => ew.word === word) : true)
    );
  });
};

export const firstMatchingWord = (letters: string[]): string => {
  return allMatchingWords(letters).find((word) => {
    return word.length >= MIN_LENGTH && word.length <= 7;
  });
};

export const wordWithLettersNotInOrder = (letters: string[]): string => {
  return ALL_WORDS.find((word) => {
    return (
      word.length >= MIN_LENGTH &&
      word.length <= 7 &&
      !isSubSequence(letters, word) &&
      word.includes(letters[0][0]) &&
      word.includes(letters[1][0]) &&
      word.includes(letters[2][0])
    );
  });
};
