import { useContext } from "react";
import { Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ColourScheme } from "../../constants/colourScheme";
import { BONUS_LIMIT, MAX_LENGTH, SHOW_CHARS } from "../../constants";
import { GameContext } from "./contexts/GameContext";

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
  },
}));

const LetterText = styled(Typography)<{
  example: boolean;
  bonusLetter: boolean;
}>(({ theme, example, bonusLetter }) => ({
  textAlign: "center",
  fontWeight: 400,
  fontSize: example ? "14px" : "30px",
  color: bonusLetter ? ColourScheme.SUPER : ColourScheme.BLACK,
  [theme.breakpoints.down("sm")]: {
    fontSize: "14px",
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
          onClick={() =>
            index <= guess.length && !example && setGuessIndex(index)
          }
          bonusLetter={index >= BONUS_LIMIT && letter !== " "}
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
                color: "black",
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
                : index >= BONUS_LIMIT && letter !== " "
                ? "rocking 0.5s infinite"
                : "none"
              : "none",
            animationIterationCount: found === null ? "infinite" : 1,
          }}
        >
          {found === null && index >= BONUS_LIMIT && letter !== " " && (
            <Typography
              sx={(theme) => ({
                display: "block",
                position: "fixed",
                fontSize: "10px",
                top: "0px",
                right: "4px",
                color: ColourScheme.SUPER,
                [theme.breakpoints.down("sm")]: {
                  top: "-12px",
                  right: "0px",
                  fontSize: "8px",
                },
              })}
            >
              x2
            </Typography>
          )}
          <LetterText
            example={example}
            bonusLetter={index >= BONUS_LIMIT && letter !== " "}
          >
            {letter.toUpperCase()}
          </LetterText>
        </Letter>
      ))}
    </GuessStack>
  );
};
