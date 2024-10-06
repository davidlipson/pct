import { MAX_WORDS, WORDS_GOAL } from "../constants";

export const calculateTarget = (totalWords: number): number => {
  // Use an exponential function to calculate the target value
  //const target = Math.floor(totalWords / 1000) * 5;
  //return Math.min(100, Math.max(20, target));
  /*const totalWordsMax = Math.min(MAX_WORDS, totalWords);
  const target = Math.floor(Math.pow(totalWordsMax, 1.2) / 1000) * 2;
  console.log(totalWords, target);*/
  return WORDS_GOAL;
};
