import { Stack, Typography } from "@mui/material";
import { ColourScheme } from "../../constants/colourScheme";
import { useContext } from "react";
import { GameContext } from "../../App";
import { styled } from "@mui/material/styles";
import "react-circular-progressbar/dist/styles.css";
import { BONUS_LIMIT } from "../../constants";
import { calculatePoints } from "../../utils";

type TextProps = {
  small?: boolean;
  superWord?: boolean;
};

const Text = styled(Typography)<TextProps>(({ theme, small, superWord }) => ({
  color: superWord ? ColourScheme.SUPER : ColourScheme.GREEN,
  fontSize: small ? "20px" : "100px",
  fontWeight: 700,
  lineHeight: small ? "20px" : "100px",
}));

export const Score = ({
  found,
  currentGuess,
}: {
  found: number;
  currentGuess: string;
}) => {
  const { points, words, target } = useContext(GameContext);
  return (
    <Stack direction="row" alignItems="baseline">
      <Stack direction="row">
        <Text>{points}</Text>
        <Text
          sx={{
            "@keyframes fadeCurrentIn": {
              "0%": {
                opacity: 0,
              },
              "100%": {
                opacity: 1,
              },
            },
            animation:
              currentGuess.length > 0 ? "fadeCurrentIn 0.3s forwards" : "none",
          }}
          small
          superWord={currentGuess.length > BONUS_LIMIT}
        >
          {currentGuess.length > 0 && `+${calculatePoints(currentGuess)}`}
        </Text>
      </Stack>
    </Stack>
  );
};
