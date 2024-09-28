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
import {
  calculatePoints,
  isSubSequence,
  totalMatchingWords,
} from "../../utils";
import { GameContext } from "../../App";
import { MAX_LENGTH, MIN_LENGTH } from "../../constants";
import { ALL_WORDS } from "../../constants";

export enum View {
  GAME = "GAME",
  HOW_TO_PLAY = "HOW_TO_PLAY",
  LEADERBOARD = "LEADERBOARD",
}

const AppContainer = styled(Stack)(({ theme }) => ({
  outline: "none",
  width: "100%",
  flexDirection: "column",
  justifyContent: "center",
  display: "flex",
  alignSelf: "center",
  alignItems: "center",
  [theme.breakpoints.down("md")]: {
    height: "auto",
    padding: "0px 24px",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "0px 8px",
  },
}));

const InnerContainer = styled(Stack)(({ theme }) => ({
  width: "800px",
  outline: "none",
  flexDirection: "column",
  justifyContent: "center",
  display: "flex",
  alignSelf: "center",
  alignItems: "center",
  gap: "48px",
  [theme.breakpoints.down("md")]: {
    width: "100%",
    gap: "16px",
    justifyContent: "space-between",
    paddingTop: "48px",
  },
}));

const TopContainer = styled(Stack)(({ theme }) => ({
  flexDirection: "column",
  outline: "none",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "none !important",
  gap: "16px",
  [theme.breakpoints.down("sm")]: {
    gap: "8px",
  },
}));

const BottomContainer = styled(Stack)(({ theme }) => ({
  flexDirection: "column",
  outline: "none",
  gap: "16px",
  boxShadow: "none !important",
  [theme.breakpoints.down("md")]: {
    position: "absolute",
    bottom: "0",
    width: "95vw",
    padding: "10px 10px 10px 10px",
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
  const [found, setFound] = useState<number>(null);
  const [view, setView] = useState<View>(View.GAME);
  const [totalWords, setTotalWords] = useState<number>(0);

  useEffect(() => {
    setTotalWords(totalMatchingWords(letters));
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
    if (word.length < MIN_LENGTH) {
      return {
        status: false,
        notice: `${MIN_LENGTH} characters or longer!`,
      };
    }

    if (isRepeatWord(word)) {
      return {
        status: false,
        notice: "Already found!",
      };
    }

    /*const result = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
      {
        method: "GET",
      }
    );*/

    //if (result.status !== 200) {
    if (!ALL_WORDS.includes(word)) {
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
      setFound(0);
      return false;
    }

    // if valid, calculate points and update add points to total
    const points = calculatePoints(word);
    setFound(points);
    setNotice(null);
    addWord(word, points);
    return true;
  };

  useEffect(() => {
    ref.current.focus();
  }, [ref]);

  const updateCurrentGuess = async (key: string) => {
    if (found > 0) {
      setFound(null);
      setNotice(null);
      setCurrentGuess("");
    }
    if (key === "Enter") {
      await submitWord(currentGuess);
    } else if (key === "Backspace") {
      setCurrentGuess((prev) => prev.slice(0, prev.length - 1));
    } else if (
      key.length === 1 &&
      key.match(/[a-z]/i) &&
      currentGuess.length < MAX_LENGTH
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
      if (found > 0) {
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
      boxSizing="border-box"
      tabIndex={0}
      ref={ref}
      onKeyUp={(e) => updateCurrentGuess(e.key)}
    >
      {false && <Info view={view} setView={setView} />}

      {view === View.LEADERBOARD && <Leaderboard />}
      {view === View.HOW_TO_PLAY && <HowToPlay />}
      {view === View.GAME && (
        <InnerContainer>
          <TopContainer>
            <Score found={found} />

            <Letters />
            <Box
              sx={(theme) => ({
                [theme.breakpoints.up("md")]: {
                  display: "none",
                },
              })}
            >
              <Notice notice={notice} />
            </Box>
          </TopContainer>
          <BottomContainer>
            <Stack spacing={0.75}>
              <Guess found={found} guess={currentGuess} />
            </Stack>
            <Words totalWords={totalWords} />
            <Keyboard submitKey={updateCurrentGuess} />
            <Box
              sx={(theme) => ({
                height: "48px",
                [theme.breakpoints.down("md")]: {
                  display: "none",
                },
              })}
            >
              <Notice notice={notice} />
            </Box>
          </BottomContainer>
        </InnerContainer>
      )}
    </AppContainer>
  );
};
