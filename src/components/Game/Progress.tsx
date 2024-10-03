import { useContext } from "react";
import { GameContext } from "../../App";
import { ColourScheme, WORDS_GOAL } from "../../constants";
import { Box, Stack } from "@mui/material";

export const Progress = () => {
  const { words } = useContext(GameContext);
  const bars = new Array(WORDS_GOAL).fill(0).map((_, i) => {
    const found = i < words.length;
    return found ? true : false;
  });

  return (
    <Stack width={1} direction="row" spacing={0.3}>
      {bars.map((bar) => (
        <Box
          sx={{
            height: "10px",
            width: "100%",
            backgroundColor: bar ? ColourScheme.GOOD_GREEN : ColourScheme.WHITE,
            border: bar
              ? `0.5px solid ${ColourScheme.GOOD_GREEN}`
              : `0.5px solid ${ColourScheme.GREY}`,
          }}
        ></Box>
      ))}
    </Stack>
  );
};
