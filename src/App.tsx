import { useEffect, useState, createContext } from "react";
import { Game } from "./components/Game";
import { todaysLetters } from "./utils";
import { Login } from "./components";
import { LEVELS } from "./constants";

export interface Word {
  word: string;
  points: number;
}

interface StoredValues {
  words: Word[];
  letters: string[];
  username: string;
}

interface GameContextType extends StoredValues {
  points: number;
  addWord: (word: string, points: number) => void;
  updateUsername: (name: string) => void;
  currentLevel: number;
}

export const GameContext = createContext<GameContextType>(
  {} as GameContextType
);

const localStorageId = "pct";

const App = () => {
  const [letters, _] = useState<string[]>(todaysLetters());
  const [words, setWords] = useState<Word[]>([]);
  const [username, setUsername] = useState<string>(null);

  const addWord = (word: string, points: number) => {
    setWords((prev) => [...prev, { word, points }]);
  };

  const validUsername = (name: string) => {
    return name && name.length > 2 && name.length < 15;
  };

  const updateUsername = (name: string) => {
    if (validUsername(name)) {
      setUsername(name);
      localStorage.setItem(
        localStorageId,
        JSON.stringify({ words, letters, username: name })
      );
    }
  };

  const getCurrentLevel = (points: number): number => {
    let current = 0;
    for (let i = 0; i < LEVELS.length; i++) {
      if (points >= LEVELS[i]) {
        current = i;
      }
    }
    return current;
  };

  useEffect(() => {
    document.title = `Today's Letters: ${letters.join(" ").toUpperCase()}`;
  }, [letters]);

  useEffect(() => {
    try {
      const {
        words: storedWords,
        letters: storedLetters,
        username: storedUsername,
      } = JSON.parse(
        localStorage.getItem(localStorageId) || "{}"
      ) as StoredValues;

      if (validUsername(storedUsername)) {
        setUsername(storedUsername);
      }

      // if letters changed on backend, reset words and storage
      if (letters.join("") !== storedLetters.join("")) {
        localStorage.setItem(
          localStorageId,
          JSON.stringify({ words: [], letters, username: storedUsername })
        );
      } else if (storedWords) {
        setWords(storedWords);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    if (words.length === 0) {
      return;
    }
    localStorage.setItem(
      localStorageId,
      JSON.stringify({ words, letters, username })
    );
  }, [words]);

  const points = words.reduce((acc, curr) => acc + curr.points, 0);
  const currentLevel = getCurrentLevel(points);
  return (
    <GameContext.Provider
      value={{
        points,
        letters,
        words,
        username,
        addWord,
        updateUsername,
        currentLevel,
      }}
    >
      {true || validUsername(username) ? <Game /> : <Login />}
    </GameContext.Provider>
  );
};

export default App;
