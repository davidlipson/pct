import { useEffect, useState, createContext } from "react";
import { Game } from "./components/Game";
import { LettersOfTheDay, todaysLetters } from "./utils";
import { WORDS_GOAL } from "./constants";
import mixpanel from "mixpanel-browser";
import { Stack, Typography } from "@mui/material";

export interface Word {
  word: string;
  points: number;
}

interface StoredValues {
  words: Word[];
  letters: LettersOfTheDay;
}

interface GameContextType extends StoredValues {
  points: number;
  addWord: (word: string, points: number) => void;
  updateUsername: (name: string) => void;
  validUsername: (name: string) => boolean;
  totalWords: number;
  username: string;
  target: number;
}

export const GameContext = createContext<GameContextType>(
  {} as GameContextType
);

const localStorageId = "pct";
const usernameStoreageId = "pct-username";

const App = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [showScreen, setShowScreen] = useState<boolean>(false);
  const [letters, setLetters] = useState<LettersOfTheDay>(todaysLetters());
  const [target, setTarget] = useState<number>(WORDS_GOAL);
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

  useEffect(() => {
    document.title = `Today's Letters: ${letters.letters
      .join(" ")
      .toUpperCase()}`;
  }, [letters]);

  useEffect(() => {
    try {
      const { words: storedWords, letters: storedLetters } = JSON.parse(
        localStorage.getItem(localStorageId) || "{}"
      ) as StoredValues;

      // if letters changed on backend, reset words and storage
      if (letters.letters.join("") !== storedLetters?.letters?.join("")) {
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
      }, 1500);
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
      beatGame: words.length >= target,
    });
  }, [words]);

  const points = words.reduce((acc, curr) => acc + curr.points, 0);

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
          How many points can you get today in {target} words?
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
          totalWords,
          target,
        }}
      >
        <Game />
      </GameContext.Provider>
    );
  }
};

export default App;
