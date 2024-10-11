import { createContext, ReactNode, useEffect, useState } from "react";
import mixpanel from "mixpanel-browser";
import { WORDS_GOAL } from "../../../constants";
import { validateWord, ValidationResponse } from "../../../utils";
import { v4 as uuidv4 } from "uuid";

export type LettersOfTheDay = {
  letters: string[];
  totalWords: number;
  levels: number[];
  validExample: string;
  invalidExample: string;
};

export interface Word {
  word: string;
  points: number;
}

export type GameContextType = {
  letters: LettersOfTheDay;
  isLoading: boolean;
  failed: boolean;
  words: Word[];
  points: number;
  addWord: (word: string) => Promise<ValidationResponse>;
};

export type StoredValues = {
  words: Word[];
  letters: LettersOfTheDay;
};

export const GameContext = createContext<GameContextType>({
  isLoading: true,
} as GameContextType);

export const localStorageId = "pct";
export const uniqueBrowserId = "pct-id";

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string>(null);
  const [failed, setFailed] = useState<boolean>(false);
  const [letters, setLetters] = useState<LettersOfTheDay>();
  const [words, setWords] = useState<Word[]>([]);
  console.log(userId);

  const initializeStorage = (fetchedLetters: LettersOfTheDay) => {
    try {
      // setup user id
      let id = localStorage.getItem(uniqueBrowserId);
      if (!id) {
        id = uuidv4();
        localStorage.setItem(uniqueBrowserId, id);
      }
      setUserId(id);

      // setup words and letters
      const { words: storedWords, letters: storedLetters } = JSON.parse(
        localStorage.getItem(localStorageId) || "{}"
      ) as StoredValues;

      // if letters changed on backend, reset words and storage
      if (
        fetchedLetters?.letters?.join("") !== storedLetters?.letters?.join("")
      ) {
        localStorage.setItem(
          localStorageId,
          JSON.stringify({ words: [], letters: fetchedLetters })
        );
      } else if (storedWords) {
        setWords(storedWords);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchLettersOfTheDay = async () => {
    const response = await fetch(`/today`, {
      method: "GET",
    });
    if (response.ok) {
      const data = await response.json();
      setLetters(data);
      initializeStorage(data);
      setIsLoading(false);
      setFailed(false);
    } else {
      setIsLoading(false);
      setFailed(true);
    }
  };

  useEffect(() => {
    fetchLettersOfTheDay();
  }, []);

  // update local storage when a new word if found
  useEffect(() => {
    if (words.length === 0) {
      return;
    }
    // remove this once we store on backend
    localStorage.setItem(localStorageId, JSON.stringify({ words, letters }));
    try {
      mixpanel.track("Someone is playing.", {
        totalWords: words.length,
        letters,
        points: words.reduce((acc, curr) => acc + curr.points, 0),
        beatGame: words.length >= WORDS_GOAL,
      });
    } catch (e) {
      console.log(e);
    }
  }, [words]);

  const addWord = async (word: string): Promise<ValidationResponse> => {
    const validation = await validateWord(word, words, letters.letters, userId);
    if (validation.valid) {
      setWords([...words, { word, points: validation.points }]);
    }
    return validation;
  };

  const points = words.reduce((acc, curr) => acc + curr.points, 0);

  return (
    <GameContext.Provider
      value={{ letters, isLoading, failed, addWord, words, points }}
    >
      {children}
    </GameContext.Provider>
  );
};
