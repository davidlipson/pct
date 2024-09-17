import { useEffect, useRef, useState, createContext } from "react";
import "./App.css";
import {
  Guess,
  HowToPlay,
  Keyboard,
  Letters,
  Notice,
  Score,
  Share,
  Words,
} from "./components";
import { styled } from "@mui/material/styles";
import { Box, Stack } from "@mui/material";
import { MAX_GUESS_LENGTH } from "./constants/constants";
import { todaysLetters } from "./utils";

type Word = {
  word: string;
  points: number;
};

type GameContextType = {
  letters: string[]; // 3 letter array, lowercase
  words: Word[]; // list of words found
  points: number; // daily points for all words found
  submitWord: (word: string) => Promise<boolean>;
};

const AppContainer = styled(Stack)(({ theme }) => ({
  width: "100%",
  flexDirection: "column",
  justifyContent: "center",
  display: "flex",
  alignSelf: "center",
  alignItems: "center",
  [theme.breakpoints.down("md")]: {
    padding: "0px 24px",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "0px 8px",
  },
}));

const InnerContainer = styled(Stack)(({ theme }) => ({
  width: "800px",
  flexDirection: "column",
  justifyContent: "center",
  display: "flex",
  alignSelf: "center",
  alignItems: "center",
  height: "100%",
  gap: "16px",
  [theme.breakpoints.down("md")]: {
    width: "100%",
    justifyContent: "space-between",
    paddingTop: "48px",
    gap: "8px",
  },
}));

const TopContainer = styled(Stack)(({ theme }) => ({
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "16px",
  [theme.breakpoints.down("sm")]: {
    gap: "8px",
  },
}));

const BottomContainer = styled(Stack)(({ theme }) => ({
  flexDirection: "column",
  gap: "16px",
  [theme.breakpoints.down("md")]: {
    width: "95vw",
    padding: "10px 10px 15px 10px",
  },
  [theme.breakpoints.down("sm")]: {
    gap: "8px",
  },
}));

export const GameContext = createContext<GameContextType>(
  {} as GameContextType
);

type StoredValues = {
  letters: string[];
  words: Word[];
};

const localStorageId = "pct";

const App = () => {
  const ref = useRef(null);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [letters, _] = useState<string[]>(todaysLetters());
  const [words, setWords] = useState<Word[]>([]);
  const [notice, setNotice] = useState<string>(null);
  const [found, setFound] = useState<boolean>(null);
  const [howToPlay, setHowToPlay] = useState<boolean>(false);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    try {
      const { words: storedWords, letters: storedLetters } = JSON.parse(
        localStorage.getItem(localStorageId) || "{}"
      ) as StoredValues;

      // if letters changed on backend, reset words and storage
      if (letters.join("") !== storedLetters.join("")) {
        localStorage.setItem(
          localStorageId,
          JSON.stringify({ words: [], letters })
        );
      } else if (storedWords) {
        setWords(storedWords);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(localStorageId, JSON.stringify({ words, letters }));
  }, [words]);

  const isSubSequence = (word: string, m: number, n: number) => {
    // Base Cases
    if (m == 0) return true;
    if (n == 0) return false;

    // If last characters of two strings
    // are matching
    if (letters[m - 1] == word[n - 1]) return isSubSequence(word, m - 1, n - 1);

    // If last characters are not matching
    return isSubSequence(word, m, n - 1);
  };

  const isRepeatWord = (word: string) => {
    // can't be a repeat word!
    const alreadyFound = words.find((w) => w.word === word);
    if (alreadyFound) {
      return true;
    }
    return false;
  };

  const validateWord = async (
    word: string
  ): Promise<{ status: boolean; notice: string }> => {
    if (isRepeatWord(word)) {
      return {
        status: false,
        notice: "Already found!",
      };
    }

    // def a better way than this...
    // populate a list of correct answers over night?...
    const result = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
      {
        method: "GET",
      }
    );

    if (result.status !== 200) {
      return {
        status: false,
        notice: "Not a word!",
      };
    }

    // check if word has letters in order
    const isSub = isSubSequence(word, letters.length, word.length);
    return {
      status: isSub,
      notice: isSub ? "" : "Use today's letters in order!",
    };
  };

  const calculatePoints = (word: string): number => {
    return word.length - 3;
  };

  const submitWord = async (word: string): Promise<boolean> => {
    // check if word is valid
    const { status: isValid, notice } = await validateWord(word);

    // if invalid return early
    if (!isValid) {
      setNotice(notice);
      setFound(false);
      return false;
    }

    // if valid, calculate points and update add points to total
    setFound(true);
    const points = calculatePoints(word);
    setNotice(`+${points}`);

    setWords((prev) => [...prev, { word, points }]);
    return true;
  };

  const points = words.reduce((acc, curr) => acc + curr.points, 0);

  useEffect(() => {
    ref.current.focus();
  }, [ref]);

  const updateCurrentGuess = async (key: string) => {
    if (found !== null) {
      setFound(null);
      setNotice(null);
      setCurrentGuess("");
    }
    if (key === "Enter") {
      if (currentGuess.length >= 3) {
        await submitWord(currentGuess);
      } else {
        setNotice("Word must be at least 3 characters long!");
        setFound(false);
      }
    } else if (key === "Backspace") {
      setCurrentGuess((prev) => prev.slice(0, prev.length - 1));
    } else if (
      key.length === 1 &&
      key.match(/[a-z]/i) &&
      currentGuess.length < MAX_GUESS_LENGTH
    ) {
      setCurrentGuess((prev) => prev + key.toLowerCase());
    }
  };

  useEffect(() => {
    if (found === null) {
      return;
    }

    const timer = setTimeout(() => {
      setFound(null);
      if (found) {
        setCurrentGuess("");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [found]);

  useEffect(() => {
    if (notice === null) {
      return;
    }

    const timer = setTimeout(() => {
      setNotice(null);
    }, 1000);

    return () => clearTimeout(timer);
  }, [notice]);

  return (
    <GameContext.Provider value={{ letters, submitWord, points, words }}>
      <HowToPlay howToPlay={howToPlay} setHowToPlay={setHowToPlay} />
      <Share setNotice={setNotice} />

      <AppContainer
        sx={{ height: `${height}px` }}
        tabIndex={0}
        ref={ref}
        onKeyUp={(e) => updateCurrentGuess(e.key)}
      >
        <InnerContainer>
          <TopContainer>
            <Score found={found} notice={notice} />
            <Letters />
            <Box
              sx={(theme) => ({
                [theme.breakpoints.up("md")]: {
                  display: "none",
                },
              })}
            >
              <Notice found={found} notice={notice} />
            </Box>
          </TopContainer>
          <BottomContainer>
            <Guess found={found} guess={currentGuess} />
            <Words />
            <Keyboard submitKey={updateCurrentGuess} />
            <Box
              sx={(theme) => ({
                height: "48px",
                [theme.breakpoints.down("md")]: {
                  display: "none",
                },
              })}
            >
              <Notice found={found} notice={notice} />
            </Box>
          </BottomContainer>
        </InnerContainer>
      </AppContainer>
    </GameContext.Provider>
  );
};

export default App;
