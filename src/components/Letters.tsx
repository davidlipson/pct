import { useContext } from "react";
import { GameContext } from "../App";
import { Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const LetterContainer = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  gap: "128px",
  [theme.breakpoints.down("sm")]: {
    gap: "64px",
  },
}));

// add animation! jumbling letters
export const Letters = () => {
  const { letters } = useContext(GameContext);
  return (
    <LetterContainer>
      {letters.map((letter) => (
        <Typography variant="h1">{letter.toUpperCase()}</Typography>
      ))}
    </LetterContainer>
  );
};
