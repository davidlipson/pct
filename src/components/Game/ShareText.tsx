import { Box, Stack, Typography } from "@mui/material";
import { useContext } from "react";
import { GameContext } from "../../App";
import { shareOnClick } from "./Info";
import { ColourScheme } from "../../constants";

export const ShareText = ({
  setNotice,
}: {
  setNotice: (notice: string) => void;
}) => {
  const { points, letters, words } = useContext(GameContext);
  return (
    <Stack width={1} alignItems="center">
      <Box
        width="200px"
        border={`1px solid ${ColourScheme.GOOD_GREEN}`}
        p="8px"
        borderRadius="4px"
        sx={{
          cursor: "pointer",
          ":hover": {
            backgroundColor: ColourScheme.GOOD_GREEN,
          },
        }}
        onClick={() => {
          shareOnClick(points, letters, words, setNotice);
        }}
      >
        <Typography textAlign="center" fontWeight={500}>
          Share your score!
        </Typography>
      </Box>
    </Stack>
  );
};
