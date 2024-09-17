import { Box, Stack, Typography } from "@mui/material";
import { ColourScheme } from "../constants/colourScheme";
import { useContext } from "react";
import { GameContext } from "../App";
import { styled } from "@mui/material/styles";

type TextProps = {
  points?: boolean;
  small?: boolean;
};

const Container = styled(Stack)(({ theme }) => ({
  height: "48px",
  flexDirection: "row",
  gap: "5px",
  width: "100%",
  justifyContent: "center",
}));

const Text = styled(Typography)<TextProps>(({ theme, points, small }) => ({
  color: points ? ColourScheme.GREEN : "black",
  fontSize: small ? "16px" : "40px",
  fontWeight: 700,
  [theme.breakpoints.down("sm")]: {
    fontSize: small ? "16px" : "100px",
  },
}));

export const Notice = ({
  notice,
  found,
}: {
  notice: string;
  found: boolean;
}) => {
  const { points } = useContext(GameContext);

  if (notice && !found) {
    return (
      <Container
        sx={{
          "@keyframes jolt": {
            "0%": {
              transform: "translateX(0)",
            },
            "15%": {
              transform: "translateX(5px)",
            },
            "30%": {
              transform: "translateX(-5px)",
            },
            "45%": {
              transform: "translateX(0px)",
            },
            "100%": {
              transform: "translateX(0)",
            },
          },
          animation: found === false ? "jolt 0.5s infinite" : "none",
          animationIterationCount: 1,
        }}
      >
        <Text small>{notice}</Text>
      </Container>
    );
  }

  return (
    <Container>
      <Text points>{points}</Text>

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
          animation: found ? "nice 0.5s infinite" : "none",
          animationIterationCount: 1,
        }}
      >
        <Text small points>
          {notice}
        </Text>
      </Box>
    </Container>
  );
};
