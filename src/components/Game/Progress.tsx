import { useContext } from "react";
import { GameContext } from "../../App";
import { ColourScheme } from "../../constants";
import { Box, Stack } from "@mui/material";

export const Progress = () => {
  const { words, target } = useContext(GameContext);

  if (words.length >= target) {
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

  const bars = new Array(target).fill(0).map((_, i) => {
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
