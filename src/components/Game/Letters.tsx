import { useContext, useEffect, useState } from "react";
import { GameContext } from "../../App";
import { Box, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { LETTERS } from "../../constants/constants";
import { ColourScheme } from "../../constants/colourScheme";

const LetterContainer = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  gap: "128px",
  [theme.breakpoints.down("sm")]: {
    gap: "32px",
  },
}));

const getRandomLetters = (count = 10) => {
  const shuffled = LETTERS.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// add animation! jumbling letters
export const Letters = () => {
  const [animate, setAnimate] = useState(true);
  const { letters } = useContext(GameContext);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimate(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  console.log(navigator);
  return (
    <LetterContainer>
      {letters.map((letter, index) => (
        <Box overflow="hidden" height="75px" width="75px">
          <Stack
            sx={{
              animation: animate
                ? `slotMachine ${
                    1 + index / 2
                  }s cubic-bezier(0.25, 0.1, 0.25, 1)`
                : "none",
              "@keyframes slotMachine": {
                "0%": {
                  transform: "translateY(0)",
                },
                "100%": {
                  transform: "translateY(-750px)",
                },
              },
              animationIterationCount: 1,
              animationFillMode: "forwards",
            }}
            alignItems="center"
            justifyContent="center"
            direction="column"
          >
            {animate &&
              getRandomLetters().map((letter) => (
                <Typography
                  color={ColourScheme.DARK_GREY}
                  height="75px"
                  width="75px"
                  variant="h2"
                  textAlign="center"
                >
                  {letter.toUpperCase()}
                </Typography>
              ))}
            <Typography
              color={ColourScheme.BLACK}
              height="75px"
              width="75px"
              variant="h2"
              textAlign="center"
            >
              {letter.toUpperCase()}
            </Typography>
          </Stack>
        </Box>
      ))}
    </LetterContainer>
  );
};
