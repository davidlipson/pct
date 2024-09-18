import { ALL_WORDS } from "../constants/dictionary";
import { isSubSequence } from "./validateWord";

export const totalMatchingWords = (letters: string[]): number => {
  return ALL_WORDS.filter((word) => {
    return isSubSequence(letters, word, letters.length, word.length);
  }).length;
};
