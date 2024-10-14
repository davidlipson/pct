import { createContext, ReactNode, useEffect, useState } from "react";
import mixpanel from "mixpanel-browser";
import { WORDS_GOAL } from "../../../constants";
import { validateWord, ValidationResponse } from "../../../utils";
import { v4 as uuidv4 } from "uuid";

export interface Word {
  word: string;
  points: number;
}

export interface User {
  userid: string;
  username?: string;
  streak?: number;
  lastwondate?: string;
}

export type LettersOfTheDay = {
  letters: string[];
  totalWords: number;
  levels: number[];
  validExample: string;
  invalidExample: string;
  myWords: Word[];
};

export type LeaderboardEntry = {
  username: string;
  userid: string;
  score: number;
};

export type GameContextType = {
  letters: LettersOfTheDay;
  isLoading: boolean;
  failed: boolean;
  words: Word[];
  points: number;
  addWord: (word: string) => Promise<ValidationResponse>;
  leaderboard: LeaderboardEntry[];
  user: User;
  setUsername: (name: string) => Promise<void>;
};

export type StoredValues = {
  words: Word[];
  letters: LettersOfTheDay;
};

export const GameContext = createContext<GameContextType>({
  isLoading: true,
} as GameContextType);

export const pctUserId = "pct-user-id";

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User>(null);
  const [failed, setFailed] = useState<boolean>(false);
  const [letters, setLetters] = useState<LettersOfTheDay>();
  const [words, setWords] = useState<Word[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // move userId out of fetch req
  const fetchLettersOfTheDay = async (userid: string) => {
    const response = await fetch(
      `${process.env.REACT_APP_PCT_API}/today?userId=${userid}`,
      {
        method: "GET",
      }
    );
    if (response.ok) {
      const { todaysLetters, myWords } = await response.json();
      setLetters(todaysLetters);
      setWords(myWords);
      setIsLoading(false);
      setFailed(false);
    } else {
      setIsLoading(false);
      setFailed(true);
    }
  };

  const login = async (userid: string) => {
    const response = await fetch(
      `${process.env.REACT_APP_PCT_API}/login?userId=${userid}`,
      {
        method: "GET",
      }
    );
    if (response.ok) {
      const user: User = await response.json();
      setUser(user);
    } else {
      setUser({ userid });
    }
  };

  useEffect(() => {
    let userid = localStorage.getItem(pctUserId);
    if (!userid) {
      userid = uuidv4();
      localStorage.setItem(pctUserId, userid);
    }
    login(userid);
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchLettersOfTheDay(user.userid);
  }, [user]);

  const setUsernameHelper = async (name: string) => {
    setUser((prev) => ({
      ...prev,
      username: name,
    }));
    const data = JSON.stringify({ userId: user.userid, username: name });
    await fetch(`${process.env.REACT_APP_PCT_API}/setUsername`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: data,
    });
  };

  const getLeaderboard = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_PCT_API}/leaderboard`,
      {
        method: "GET",
      }
    );
    if (response.ok) {
      const leaderboard = await response.json();
      setLeaderboard(leaderboard);
    }
  };

  const addWord = async (word: string): Promise<ValidationResponse> => {
    const validation = await validateWord(
      word,
      words,
      letters.letters,
      user.userid
    );
    if (validation.valid && validation.myWords) {
      mixpanel.track("Someone is playing.", {
        totalWords: validation.myWords.length,
        letters,
        points: validation.myWords.reduce((acc, curr) => acc + curr.points, 0),
        beatGame: validation.myWords.length >= WORDS_GOAL,
        user,
      });
      setWords(validation.myWords);
    }
    return validation;
  };

  /*useEffect(() => {
    getLeaderboard();
  }, [words]);*/

  const points = words.reduce((acc, curr) => acc + curr.points, 0);

  return (
    <GameContext.Provider
      value={{
        letters,
        isLoading,
        failed,
        addWord,
        words,
        points,
        leaderboard,
        user,
        setUsername: setUsernameHelper,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
