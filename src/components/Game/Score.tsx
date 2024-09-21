import { Box, Stack, Typography } from "@mui/material";
import { ColourScheme } from "../../constants/colourScheme";
import { useContext } from "react";
import { GameContext } from "../../App";
import { styled } from "@mui/material/styles";

const Container = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  gap: "5px",
  width: "100%",
  justifyContent: "center",
}));

type TextProps = {
  small?: boolean;
};

// make text not move when scoring

const Text = styled(Typography)<TextProps>(({ theme, small }) => ({
  color: ColourScheme.GREEN,
  fontSize: small ? "24px" : "100px",
  fontWeight: 700,
}));

export const Score = ({ found }: { found: number }) => {
  const { points } = useContext(GameContext);
  return (
    <Container>
      <Text>{points}</Text>

      {found > 0 && (
        <Box
          sx={{
            "@keyframes nice": {
              "0%": {
                opacity: 0,
              },
              "50%": {
                opacity: 1,
              },
            },
            animation: "nice 0.5s infinite",
            animationIterationCount: 1,
          }}
        >
          <Text small>+ {found}</Text>
        </Box>
      )}
    </Container>
  );
};
