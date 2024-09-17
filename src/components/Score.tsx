import { Box, Stack, Typography } from "@mui/material";
import { ColourScheme } from "../constants/colourScheme";
import { useContext } from "react";
import { GameContext } from "../App";
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
  fontSize: small ? "16px" : "100px",
  fontWeight: 700,
}));

export const Score = ({
  notice,
  found,
}: {
  notice: string;
  found: boolean;
}) => {
  const { points } = useContext(GameContext);
  return (
    <Container>
      <Text>{points}</Text>

      {found && notice && (
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
          <Text small>{notice}</Text>
        </Box>
      )}
    </Container>
  );
};
