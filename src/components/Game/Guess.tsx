import { useContext } from "react";
import { GameContext } from "../../App";
import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ColourScheme } from "../../constants/colourScheme";
import { MAX_LENGTH, SHOW_CHARS } from "../../constants";

const Letter = styled(Stack)(({ theme }) => ({
  textAlign: "center",
  alignContent: "center",
  height: "100%",
  cursor: "pointer",
  justifyContent: "center",
  width: "60px",
  fontSize: "30px",
  border: `1.5px solid ${ColourScheme.GREY}`,
  backgroundColor: ColourScheme.WHITE,
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    height: "40px",
    fontSize: "16px",
    border: `1px solid ${ColourScheme.GREY}`,
  },
}));

const GuessStack = styled(Stack)(({ theme }) => ({
  display: "flex",
  height: "60px",
  width: "100%",
  gap: "3px",
  justifyContent: "space-between",
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
  [theme.breakpoints.down("sm")]: {
    height: "40px",
  },
}));

export const Guess = ({
  guess,
  found,
  guessIndex,
  setGuessIndex,
}: {
  guess: string;
  found: number;
  guessIndex: number;
  setGuessIndex: (ind: number) => void;
}) => {
  const { letters } = useContext(GameContext);
  const paddedGuess = guess.padEnd(SHOW_CHARS, " ");

  const colour = () => {
    return ColourScheme.GREEN;
  };

  return (
    <GuessStack direction="row">
      {paddedGuess.split("").map((letter, index) => (
        <Letter
          onClick={() => index <= guess.length && setGuessIndex(index)}
          sx={{
            backgroundColor:
              index === guessIndex
                ? ColourScheme.LIGHT_GREY
                : ColourScheme.WHITE,
            borderColor:
              letters.includes(letter) &&
              `${found > 0 ? colour() : ColourScheme.GREEN} !important`,
            "@keyframes nope": {
              "0%": {
                transform: "translateX(0)",
              },
              "15%": {
                transform: "translateX(5px)",
              },
              "30%": {
                transform: "translateX(-5px)",
              },
              "45%": {
                transform: "translateX(0px)",
              },
              "100%": {
                transform: "translateX(0)",
              },
            },
            "@keyframes woo": {
              to: {
                backgroundColor: colour(),
                borderColor: colour(),
              },
            },
            animation:
              found === 0
                ? "nope 0.5s infinite"
                : found > 0 && letter !== " "
                ? `woo 1s infinite`
                : "none",
            animationIterationCount: 1,
          }}
          key={index}
        >
          {letter.toUpperCase()}
        </Letter>
      ))}
    </GuessStack>
  );
};
