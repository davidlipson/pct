import { useContext } from "react";
import { GameContext } from "../../App";
import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ColourScheme } from "../../constants/colourScheme";
import { BONUS_LIMIT, MAX_LENGTH, SHOW_CHARS } from "../../constants";

const Letter = styled(Stack)<{
  example: boolean;
  bonusLetter: boolean;
  specialLetter: boolean;
}>(({ theme, example, bonusLetter, specialLetter }) => ({
  textAlign: "center",
  alignContent: "center",
  height: "100%",
  cursor: "pointer",
  justifyContent: "center",
  width: example ? "30px" : "60px",
  fontSize: example ? "15px" : "30px",
  border: `1px solid ${
    bonusLetter
      ? ColourScheme.SUPER
      : specialLetter
      ? ColourScheme.GREEN
      : ColourScheme.GREY
  }`,
  backgroundColor: ColourScheme.WHITE,
  [theme.breakpoints.down("sm")]: {
    width: example ? "30px" : "100%",
    height: example ? "30px" : "40px",
    fontSize: example ? "15px" : "16px",
  },
}));

const GuessStack = styled(Stack)<{ example: boolean }>(
  ({ theme, example }) => ({
    display: "flex",
    height: example ? "30px" : "60px",
    width: "100%",
    gap: example ? "1px" : "3px",
    justifyContent: example ? "flex-start" : "space-between",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    [theme.breakpoints.down("sm")]: {
      height: example ? "30px" : "40px",
    },
  })
);

export const Guess = ({
  guess,
  found,
  guessIndex,
  setGuessIndex,
  example = false,
}: {
  guess: string;
  found?: number;
  guessIndex?: number;
  setGuessIndex?: (ind: number) => void;
  example?: boolean;
}) => {
  const {
    letters: { letters },
  } = useContext(GameContext);
  let paddedGuess = example ? guess : guess.padEnd(SHOW_CHARS, " ");
  if (!example && guess.length > SHOW_CHARS - 1 && guess.length < MAX_LENGTH) {
    paddedGuess = paddedGuess + " ";
  }
  return (
    <GuessStack example={example} direction="row">
      {paddedGuess.split("").map((letter, index) => (
        <Letter
          key={`${index}-${letter}-${example}`}
          example={example}
          onClick={() => index <= guess.length && setGuessIndex(index)}
          bonusLetter={index > BONUS_LIMIT && letter !== " "}
          specialLetter={letters.includes(letter.toLowerCase())}
          sx={{
            backgroundColor:
              index === guessIndex && !example
                ? ColourScheme.LIGHT_GREY
                : ColourScheme.WHITE,
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
                border: `1px solid ${ColourScheme.GREEN} !important`,
              },
            },
            "@keyframes wooSuper": {
              to: {
                backgroundColor: ColourScheme.SUPER,
                border: `1px solid ${ColourScheme.SUPER} !important`,
              },
            },
            "@keyframes rocking": {
              "0%": {
                transform: "rotate(0deg)",
              },
              "50%": {
                transform: "rotate(1deg)",
              },
              "100%": {
                transform: "rotate(-1deg)",
              },
            },
            animation: !example
              ? found === 0
                ? "nope 0.5s infinite"
                : found > 0 && letter !== " "
                ? guess.length > BONUS_LIMIT
                  ? `wooSuper 1s infinite `
                  : `woo 1s infinite`
                : index > BONUS_LIMIT && letter !== " "
                ? "rocking 0.5s infinite"
                : "none"
              : "none",
            animationIterationCount: found === null ? "infinite" : 1,
          }}
        >
          {letter.toUpperCase()}
        </Letter>
      ))}
    </GuessStack>
  );
};
