import { useEffect, useState, createContext, useRef } from "react";
import { Game } from "./components/Game";
import { todaysLetters, totalMatchingWords } from "./utils";
import { LEVELS, WORDS_GOAL } from "./constants";
import mixpanel from "mixpanel-browser";
import { Stack, Typography } from "@mui/material";

export interface Word {
  word: string;
  points: number;
}

interface StoredValues {
  words: Word[];
  letters: string[];
}

interface GameContextType extends StoredValues {
  points: number;
  addWord: (word: string, points: number) => void;
  updateUsername: (name: string) => void;
  validUsername: (name: string) => boolean;
  currentLevel: number;
  totalWords: number;
  username: string;
}

export const GameContext = createContext<GameContextType>(
  {} as GameContextType
);

const localStorageId = "pct";
const usernameStoreageId = "pct-username";

const App = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showScreen, setShowScreen] = useState<boolean>(false);
  const [letters, setLetters] = useState<string[]>(todaysLetters());
  const [words, setWords] = useState<Word[]>([]);
  const [username, setUsername] = useState<string>(
    localStorage.getItem(usernameStoreageId)
  );
  const [totalWords, setTotalWords] = useState<number>(0);

  const addWord = (word: string, points: number) => {
    setWords((prev) => [...prev, { word, points }]);
  };

  const validUsername = (name: string) => {
    // regex only allows letters, numbers
    return (
      name && name.length > 2 && name.length < 15 && /^[a-zA-Z0-9]+$/.test(name)
    );
  };

  const updateUsername = (name: string) => {
    if (validUsername(name)) {
      setUsername(name);
      // also set a UUID!
      localStorage.setItem(usernameStoreageId, name);
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
    setTotalWords(totalMatchingWords(letters));
  }, [letters]);

  useEffect(() => {
    try {
      const { words: storedWords, letters: storedLetters } = JSON.parse(
        localStorage.getItem(localStorageId) || "{}"
      ) as StoredValues;

      // if letters changed on backend, reset words and storage
      if (letters?.join("") !== storedLetters?.join("")) {
        setLoading(true);
        localStorage.setItem(
          localStorageId,
          JSON.stringify({ words: [], letters })
        );
      } else if (storedWords) {
        setWords(storedWords);
        setShowScreen(true);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    // if loading is set to to, turn it to false after 2 seconds
    if (loading) {
      setTimeout(() => {
        setShowScreen(true);
        setLoading(false);
      }, 2000);
    }
  }, [loading]);

  useEffect(() => {
    if (words.length === 0) {
      return;
    }
    localStorage.setItem(localStorageId, JSON.stringify({ words, letters }));
    mixpanel.track("Someone is playing.", {
      totalWords: words.length,
      letters,
      points: words.reduce((acc, curr) => acc + curr.points, 0),
      beatGame: words.length >= WORDS_GOAL,
    });
  }, [words]);

  const points = words.reduce((acc, curr) => acc + curr.points, 0);
  const currentLevel = getCurrentLevel(points);

  if (loading) {
    return (
      <Stack
        height={"100vh"}
        alignSelf="center"
        justifyContent="center"
        sx={(theme) => ({
          textAlign: "center",
          "@keyframes fadeIn": {
            "0%": {
              opacity: 0,
            },
            "50%": {
              opacity: 1,
            },
            "100%": {
              opacity: 1,
            },
          },
          animation: "fadeIn 2s ease-in-out",
          animationIterationCount: 1,
          animationFillMode: "forwards",
          [theme.breakpoints.down("md")]: {
            width: "100%",
            padding: "0 20px",
          },
        })}
      >
        <Typography>
          How many points can you get today in {WORDS_GOAL} words?
        </Typography>
      </Stack>
    );
  }
  if (showScreen) {
    return (
      <GameContext.Provider
        value={{
          points,
          letters,
          words,
          username,
          addWord,
          updateUsername,
          validUsername,
          currentLevel,
          totalWords,
        }}
      >
        <Game />
      </GameContext.Provider>
    );
  }
};

export default App;
