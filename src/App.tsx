import { useEffect, useState, createContext } from "react";
import "./App.css";
import { Game } from "./components/Game";
import { remainingWordsByLength, todaysLetters } from "./utils";
import { Login } from "./components";
import { MIN_LENGTH } from "./constants";

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
    localStorage.setItem(
      localStorageId,
      JSON.stringify({ words, letters, username })
    );
  }, [words]);

  const points = words.reduce((acc, curr) => acc + curr.points, 0);

  return (
    <GameContext.Provider
      value={{
        points,
        letters,
        words,
        username,
        addWord,
        updateUsername,
      }}
    >
      {true || validUsername(username) ? <Game /> : <Login />}
    </GameContext.Provider>
  );
};

export default App;
