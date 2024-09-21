import { useEffect, useRef, useState, useContext } from "react";
import {
  Guess,
  HowToPlay,
  Keyboard,
  Letters,
  Notice,
  Score,
  Info,
  Words,
  Leaderboard,
} from ".";
import { styled } from "@mui/material/styles";
import { Box, Stack } from "@mui/material";
import { MAX_GUESS_LENGTH } from "../../constants/constants";
import {
  calculatePoints,
  isSubSequence,
  totalMatchingWords,
} from "../../utils";
import { GameContext } from "../../App";

export enum View {
  GAME = "GAME",
  HOW_TO_PLAY = "HOW_TO_PLAY",
  LEADERBOARD = "LEADERBOARD",
}

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
  [theme.breakpoints.down("md")]: {
    width: "100%",
    justifyContent: "space-between",
    paddingTop: "48px",
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

export const Game = () => {
  const ref = useRef(null);
  const { words, letters, addWord } = useContext(GameContext);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [notice, setNotice] = useState<string>(null);
  const [found, setFound] = useState<boolean>(null);
  const [view, setView] = useState<View>(View.GAME);
  const [height, setHeight] = useState(window.innerHeight);
  const [totalMatching, setTotalMatching] = useState<number>(0);

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
    setTotalMatching(totalMatchingWords(letters));
  }, [letters]);

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
    const isSub = isSubSequence(letters, word, letters.length, word.length);
    return {
      status: isSub,
      notice: isSub ? "" : "Use today's letters in order!",
    };
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
    addWord(word, points);
    return true;
  };

  useEffect(() => {
    ref.current.focus();
  }, [ref]);

  const updateCurrentGuess = async (key: string) => {
    if (found) {
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
    <AppContainer
      sx={{ height: `${height}px` }}
      tabIndex={0}
      ref={ref}
      onKeyUp={(e) => updateCurrentGuess(e.key)}
    >
      <Info view={view} setView={setView} />

      {view === View.LEADERBOARD && <Leaderboard />}
      {view === View.HOW_TO_PLAY && <HowToPlay />}
      {view === View.GAME && (
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
            <Words totalWords={totalMatching} />
            <Keyboard submitKey={updateCurrentGuess} />
            <Box
              sx={(theme) => ({
                height: "48px",
                marginTop: "16px",
                [theme.breakpoints.down("md")]: {
                  display: "none",
                },
              })}
            >
              <Notice found={found} notice={notice} />
            </Box>
          </BottomContainer>
        </InnerContainer>
      )}
    </AppContainer>
  );
};
