import { WORDS_GOAL } from "../constants";
import { calculatePoints } from "./calculatePoints";
import { allMatchingWords } from "./totalMatchingWords";

export const todaysMax = (letters: string[]): number => {
  const dict = allMatchingWords(letters);
  const longestWords = dict.sort((a, b) => b.length - a.length);
  const firstNWords = longestWords.slice(0, WORDS_GOAL);
  const totalScore = firstNWords.reduce(
    (acc, word) => acc + calculatePoints(word),
    0
  );
  return totalScore;
};
