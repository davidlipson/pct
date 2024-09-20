import { useContext } from "react";
import { GameContext } from "../App";
import { Box, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ColourScheme } from "../constants/colourScheme";
import { MAX_GUESS_LENGTH } from "../constants/constants";

const Letter = styled(Stack)(({ theme }) => ({
  textAlign: "center",
  alignContent: "center",
  height: "100%",
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

export const Guess = ({ guess, found }: { guess: string; found: boolean }) => {
  const { letters } = useContext(GameContext);
  const paddedGuess = guess.padEnd(MAX_GUESS_LENGTH, " ");
  return (
    <GuessStack direction="row">
      {paddedGuess.split("").map((letter, index) => (
        <Letter
          sx={{
            borderColor:
              letters.includes(letter) && `${ColourScheme.GREEN} !important`,
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
                backgroundColor: ColourScheme.GREEN,
                borderColor: ColourScheme.GREEN,
              },
            },
            animation:
              found === false
                ? "nope 0.5s infinite"
                : found && letter !== " "
                ? "woo 1s infinite"
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
