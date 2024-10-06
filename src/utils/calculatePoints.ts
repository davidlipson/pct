import { BONUS_LIMIT } from "../constants";

export const calculatePoints = (word: string): number => {
  if (word.length <= BONUS_LIMIT) {
    return word.length;
  }
  return word.length * 2;
};
