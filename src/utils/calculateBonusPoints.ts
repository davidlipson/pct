import { BONUS_LIMIT } from "../constants";

export const calculateBonusPoints = (score: number) => {
  return Math.max(0, score - BONUS_LIMIT);
};
