import { Word } from "../components/Game/contexts/GameContext";
import { MAX_LENGTH, MIN_LENGTH } from "../constants";

const isRepeatWord = (word: string, words: Word[]) => {
  const alreadyFound = words.find((w) => w.word === word);
  if (alreadyFound) {
    return true;
  }
  return false;
};

const isSubSequence = (word: string, letters: string[]) => {
  const pattern = letters.map((letter) => letter).join(".*");
  const regex = new RegExp(pattern);
  return regex.test(word);
};

export type ValidationResponse = {
  valid: boolean;
  points?: number;
  message?: string;
};

export const validateWord = async (
  word: string,
  words: Word[],
  letters: string[],
  userId: string
): Promise<ValidationResponse> => {
  if (word.length < MIN_LENGTH) {
    return {
      valid: false,
      message: `${MIN_LENGTH} characters or longer!`,
    };
  }

  if (word.length > MAX_LENGTH) {
    return {
      valid: false,
      message: `${MAX_LENGTH} characters or shorter`,
    };
  }

  if (isRepeatWord(word, words)) {
    return {
      valid: false,
      points: 0,
      message: "Already found!",
    };
  }

  if (!isSubSequence(word, letters)) {
    return {
      valid: false,
      points: 0,
      message: "Use today's letters in order!",
    };
  }

  const response = await fetch(`/validate?word=${word}&userId=${userId}`, {
    method: "GET",
  });
  const data: ValidationResponse = await response.json();
  return {
    ...data,
    message: data.valid ? "Valid!" : "Not found!",
  };
};
