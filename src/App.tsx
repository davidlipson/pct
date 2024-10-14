import { useContext } from "react";
import { WORDS_GOAL } from "./constants";
import { Stack, Typography } from "@mui/material";
import { GameContext } from "./components/Game/contexts/GameContext";
import { Game } from "./components/Game/Game";

const App = () => {
  const { isLoading, failed } = useContext(GameContext);

  if (failed) {
    return (
      <Stack
        height={"100vh"}
        alignSelf="center"
        justifyContent="center"
        sx={(theme) => ({
          textAlign: "center",
          [theme.breakpoints.down("md")]: {
            width: "100%",
            padding: "0 20px",
          },
        })}
      >
        <Typography>
          There was an error loading the game. Please try again later.
        </Typography>
      </Stack>
    );
  }

  if (isLoading) {
    return (
      <Stack
        height={"100vh"}
        alignSelf="center"
        justifyContent="center"
        sx={(theme) => ({
          textAlign: "center",
          "@keyframes fadeIn": {
            "0%": {
              opacity: 0,
            },
            "50%": {
              opacity: 1,
            },
            "100%": {
              opacity: 1,
            },
          },
          animation: "fadeIn 2s ease-in-out",
          animationIterationCount: 1,
          animationFillMode: "forwards",
          [theme.breakpoints.down("md")]: {
            width: "100%",
            padding: "0 20px",
          },
        })}
      >
        <Typography>
          How many points can you get today in {WORDS_GOAL} words?
        </Typography>
      </Stack>
    );
  }
  return <Game />;
};

export default App;
