import { Box, Container, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { useContext } from "react";
import { GameContext } from "../../App";
import {
  calculatePoints,
  firstMatchingWord,
  wordWithLettersNotInOrder,
} from "../../utils";
import { ColourScheme } from "../../constants/colourScheme";

const InnerContainer = styled(Container)(({ theme }) => ({
  backgroundColor: "white",
  boxShadow: "0px 3px 5px 0px rgba(0,0,0,0.2)",
  width: "100%",
  maxWidth: "600px",
  borderRadius: "7px",
  padding: "20px 48px 48px 48px",
  gap: "20px",
  [theme.breakpoints.down("md")]: {
    maxWidth: "100%",
  },
}));

const DirectionText = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  fontWeight: 200,
}));

export const HowToPlay = () => {
  const { letters } = useContext(GameContext);
  const validWord = firstMatchingWord(letters).toUpperCase();
  const validPoints = calculatePoints(validWord);
  const invalidWord = wordWithLettersNotInOrder(letters).toUpperCase();
  return (
    <InnerContainer>
      <Typography
        fontSize="18px"
        variant="overline"
        textAlign="center"
        width={1}
      >
        How To Play PCT
      </Typography>
      <Stack direction="column" spacing={1}>
        <DirectionText>
          Everyday, you will see three new letters — for example, today's
          letters are{" "}
          <strong>
            {letters.map((letter) => letter.toUpperCase()).join(", ")}
          </strong>
          .
        </DirectionText>
        <DirectionText>
          You must create as many words as you can using these letters as a
          subsequence.
        </DirectionText>
        <DirectionText>
          The letters must remain in order, but do not need to be consecutive.
        </DirectionText>
        <DirectionText>
          For example,{" "}
          <strong style={{ color: ColourScheme.GREEN }}>{validWord}</strong> is
          a valid word today, but{" "}
          <strong style={{ color: ColourScheme.RED }}>{invalidWord}</strong> is
          not because {letters.map((letter) => letter.toUpperCase()).join(", ")}{" "}
          are not found in order.
        </DirectionText>
        <DirectionText>
          Words must be at least three letters long. Additional points will be
          rewarded for each additional letter.
        </DirectionText>
        <DirectionText>
          For example,{" "}
          <strong style={{ color: ColourScheme.GREEN }}>{validWord}</strong> is
          worth {validPoints} points (there's a freeby!)
        </DirectionText>
      </Stack>
    </InnerContainer>
  );
};
