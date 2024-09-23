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
      isSubSequence(letters, word, letters.length, word.length) &&
      (length ? word.length === length : true) &&
      (excludedWords ? !excludedWords.find((ew) => ew.word === word) : true)
    );
  });
};

export const totalMatchingWords = (
  letters: string[],
  length?: number,
  excludedWords?: Word[]
): number => {
  return allMatchingWords(letters, length, excludedWords).length;
};

export const remainingWordsByLength = (
  letters: string[],
  words: Word[]
): number[] => {
  const lengths = Array.from(
    { length: MAX_LENGTH - MIN_LENGTH + 1 },
    (_, i) => i + MIN_LENGTH
  );
  return lengths.map((length) => totalMatchingWords(letters, length, words));
};

export const firstMatchingWord = (letters: string[]): string => {
  return allMatchingWords(letters)[0];
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
