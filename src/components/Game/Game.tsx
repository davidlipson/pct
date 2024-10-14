import { useEffect, useRef, useState, useContext } from "react";
import { styled } from "@mui/material/styles";
import { Box, Stack } from "@mui/material";
import { MAX_LENGTH, WORDS_GOAL } from "../../constants";
import { GameContext } from "./contexts/GameContext";
import { HowToPlay } from "./HowToPlay";
import { Info } from "./Info";
import { Feedback } from "./Feedback";
import { Score } from "./Score";
import { PointsProgress } from "./PointsProgress";
import { Letters } from "./Letters";
import { Notice } from "./Notice";
import { ShareText } from "./ShareText";
import { Keyboard } from "./Keyboard";
import { Words } from "./Words";
import { Guess } from "./Guess";
import { Leaderboard } from "./Leaderboard";

export enum View {
  GAME = "GAME",
  HOW_TO_PLAY = "HOW_TO_PLAY",
  LEADERBOARD = "LEADERBOARD",
  FEEDBACK = "FEEDBACK",
}

const AppContainer = styled(Stack)(({ theme }) => ({
  outline: "none",
  width: "100%",
  flexDirection: "column",
  justifyContent: "center",
  display: "flex",
  alignSelf: "center",
  alignItems: "center",
  padding: "48px 0px",
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
  width: "100%",
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
  const { addWord, words } = useContext(GameContext);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [notice, setNotice] = useState<string>(null);
  const [found, setFound] = useState<number>(null);
  const [view, setView] = useState<View>(
    words.length >= 0 ? View.GAME : View.HOW_TO_PLAY
  );
  const [wordsExpanded, setExpanded] = useState<boolean>(false);
  const [guessIndex, setGuessIndex] = useState<number>(0);
  const [allowTyping, setAllowTyping] = useState<boolean>(true);
  const [backspaceTimer, setBackspaceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const submitWord = async (word: string): Promise<boolean> => {
    const { valid, message, points } = await addWord(word);

    if (!valid) {
      setNotice(message);
      setFound(0);
      return false;
    }

    setFound(points);
    setNotice(null);
    return true;
  };

  useEffect(() => {
    ref.current.focus();
  }, [ref]);

  const updateCurrentGuess = async (key: string) => {
    if (!allowTyping || words.length >= WORDS_GOAL || View.GAME !== view) {
      return;
    }
    if (backspaceTimer) {
      clearTimeout(backspaceTimer);
      setBackspaceTimer(null);
    }
    if (found > 0) {
      setFound(null);
      setNotice(null);
      setCurrentGuess("");
    }
    if (key === "Enter") {
      await submitWord(currentGuess);
    } else if (key === "Backspace") {
      setCurrentGuess((prev) => {
        if (guessIndex >= prev.length) {
          return prev.slice(0, -1);
        }
        const beforeCurrentGuess = prev.slice(0, guessIndex);
        const afterCurrentGuess = prev.slice(guessIndex + 1, prev.length);
        return beforeCurrentGuess + afterCurrentGuess;
      });
    } else if (
      key.length === 1 &&
      key.match(/[a-z]/i) &&
      (currentGuess.length < MAX_LENGTH || guessIndex < currentGuess.length)
    ) {
      setCurrentGuess((prev) => {
        if (guessIndex >= prev.length) {
          return prev + key.toLowerCase();
        }
        const beforeCurrentGuess = prev.slice(0, guessIndex);
        const afterCurrentGuess = prev.slice(guessIndex + 1, prev.length);
        return beforeCurrentGuess + key.toLowerCase() + afterCurrentGuess;
      });
    }
  };

  useEffect(() => {
    setGuessIndex(currentGuess.length);
  }, [currentGuess]);

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

  const startBackspaceTimer = () => {
    if (!backspaceTimer) {
      setBackspaceTimer(
        setTimeout(() => {
          setCurrentGuess("");
        }, 500)
      );
    }
  };

  return (
    <AppContainer
      boxSizing="border-box"
      tabIndex={0}
      ref={ref}
      onKeyDown={(e) => {
        if (e.key === "Backspace") {
          startBackspaceTimer();
        }
      }}
      onKeyUp={(e) => updateCurrentGuess(e.key)}
    >
      <Info view={view} setView={setView} setNotice={setNotice} />
      <HowToPlay open={view === View.HOW_TO_PLAY} setView={setView} />
      <Leaderboard open={view === View.LEADERBOARD} setView={setView} />
      <Feedback
        open={view === View.FEEDBACK}
        onClose={() => setView(View.GAME)}
      />
      <InnerContainer>
        <TopContainer>
          <Score found={found} currentGuess={currentGuess} />
          <PointsProgress found={found} currentGuess={currentGuess} />
          <Letters />
          <Box
            sx={(theme) => ({
              [theme.breakpoints.up("md")]: {
                display: "none",
              },
            })}
          >
            {words.length < WORDS_GOAL ? (
              <Notice notice={notice} />
            ) : (
              <ShareText setNotice={setNotice} />
            )}
          </Box>
        </TopContainer>
        <BottomContainer>
          {!wordsExpanded && words.length < WORDS_GOAL && (
            <Stack spacing={0.75}>
              <Guess
                guessIndex={guessIndex}
                setGuessIndex={setGuessIndex}
                found={found}
                guess={currentGuess}
              />
            </Stack>
          )}
          <Stack spacing={1}>
            <Words
              expanded={wordsExpanded || words.length >= WORDS_GOAL}
              setExpanded={setExpanded}
            />
          </Stack>
          {!wordsExpanded && words.length < WORDS_GOAL && (
            <Keyboard
              startBackspaceTimer={startBackspaceTimer}
              submitKey={updateCurrentGuess}
            />
          )}
          <Box
            sx={(theme) => ({
              height: "48px",
              [theme.breakpoints.down("md")]: {
                display: "none",
              },
            })}
          >
            {words.length >= WORDS_GOAL && <ShareText setNotice={setNotice} />}
            <Notice notice={notice} />
          </Box>
        </BottomContainer>
      </InnerContainer>
    </AppContainer>
  );
};
