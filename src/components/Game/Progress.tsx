import { useContext } from "react";
import { GameContext } from "./contexts/GameContext";
import { ColourScheme, WORDS_GOAL } from "../../constants";
import { Box, Stack } from "@mui/material";

export const Progress = () => {
  const { words } = useContext(GameContext);

  if (words.length >= WORDS_GOAL) {
    return (
      <Stack
        width={1}
        direction="row"
        sx={{
          height: "10px",
          width: "100%",
          backgroundColor: ColourScheme.GOOD_GREEN,
          border: `0.5px solid ${ColourScheme.GOOD_GREEN}`,
          animation: "glowing 1300ms infinite",
          "@keyframes glowing": {
            "0%": {
              boxShadow: `0 0 3px ${ColourScheme.GOOD_GREEN}`,
            },
            "50%": {
              boxShadow: `0 0 10px ${ColourScheme.GOOD_GREEN}`,
            },
            "100%": {
              boxShadow: `0 0 3px ${ColourScheme.GOOD_GREEN}`,
            },
          },
        }}
      ></Stack>
    );
  }

  const bars = new Array(WORDS_GOAL).fill(0).map((_, i) => {
    const found = i < words.length;
    return found ? true : false;
  });

  return (
    <Stack
      width={1}
      direction="row"
      spacing={0.3}
      justifyContent="space-between"
    >
      {bars.map((bar) => (
        <Box
          sx={{
            height: "10px",
            width: "10px",
            backgroundColor: bar ? ColourScheme.GOOD_GREEN : ColourScheme.WHITE,
            border: bar
              ? `1px solid ${ColourScheme.GOOD_GREEN}`
              : `1px solid ${ColourScheme.GREY}`,
          }}
        ></Box>
      ))}
    </Stack>
  );
};
