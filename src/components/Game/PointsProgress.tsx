import { useContext, useEffect, useState } from "react";
import { GameContext } from "../../App";
import { ColourScheme, LEVEL_NAMES } from "../../constants";
import { Box, Stack, Tooltip } from "@mui/material";
import { calculatePoints } from "../../utils";

const Section = ({
  colour,
  levelNumber,
  filled,
  currentGuess,
  found,
}: {
  levelNumber: number;
  colour: string;
  filled?: boolean;
  currentGuess: string;
  found: number;
}) => {
  const {
    words,
    points,
    letters: { levels },
  } = useContext(GameContext);
  const name = `colour-${levelNumber}`;

  const level = levels[levelNumber];
  const min = levelNumber === 0 ? 0 : levels[levelNumber - 1];
  const max = level;

  const bars = new Array(max - min).fill(0).map((_, i) => {
    return points > i + min
      ? 1
      : !found && points + calculatePoints(currentGuess || "") > i + min
      ? 2
      : 0;
  });

  return (
    <Stack width="100%" direction="row" spacing={0}>
      {bars.map((bar, index) => (
        <Box
          sx={{
            height: "2px",
            width: "100%",
            backgroundColor:
              bar === 2 ? ColourScheme.DARK_GREY : ColourScheme.GREY,
            [`@keyframes ${name}`]: {
              to: {
                backgroundColor: colour,
              },
            },
            animation:
              bar === 1 || filled
                ? `${name} 0.05s ${
                    0.05 *
                    (filled
                      ? 0
                      : index + min - (points - words[words.length - 1].points))
                  }s`
                : "none",
            animationFillMode: "forwards",
          }}
        ></Box>
      ))}
    </Stack>
  );
};

const LevelComplete = ({
  levelNumber,
  colour,
  filled,
  currentGuess,
  found,
}: {
  colour: string;
  levelNumber: number;
  filled?: boolean;
  currentGuess: string;
  found: number;
}) => {
  const {
    points,
    letters: { levels },
  } = useContext(GameContext);
  const [open, setOpen] = useState(false);
  const name = `glowing-${levelNumber}`;

  const level = levels[levelNumber];
  const max = level;

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setOpen(false);
      }, 1500);
    }
  }, [open]);

  return (
    <Tooltip
      open={open}
      title={
        points >= max
          ? `You're ${levelNumber === 0 ? "" : "a"} ${
              LEVEL_NAMES[levelNumber]
            }!`
          : `${max - points} pts to ${LEVEL_NAMES[levelNumber]}!`
      }
    >
      <Stack
        onClick={() => setOpen((prev) => !prev)}
        sx={{
          cursor: "pointer",
          width: "35px",
          height: "10px",
          backgroundColor:
            points >= max || filled
              ? colour
              : !found && points + calculatePoints(currentGuess) >= max
              ? ColourScheme.DARK_GREY
              : ColourScheme.GREY,
          border: `1px solid ${
            points >= max || filled
              ? colour
              : !found && points + calculatePoints(currentGuess) >= max
              ? ColourScheme.DARK_GREY
              : ColourScheme.GREY
          }`,
          animation:
            points >= max || filled ? `${name} 1300ms infinite` : "none",
          [`@keyframes ${name}`]: {
            "0%": {
              boxShadow: `0 0 3px ${colour}`,
            },
            "50%": {
              boxShadow: `0 0 10px ${colour}`,
            },
            "100%": {
              boxShadow: `0 0 3px ${colour}`,
            },
          },
        }}
      ></Stack>
    </Tooltip>
  );
};

export const PointsProgress = ({
  filled,
  currentGuess = "",
  found = 1,
}: {
  filled?: boolean;
  currentGuess?: string;
  found?: number;
}) => {
  return (
    <Stack direction="row" width={1} spacing={1} alignItems="center">
      <Section
        filled={filled}
        levelNumber={0}
        currentGuess={currentGuess}
        found={found}
        colour={ColourScheme.GOOD_GREEN}
      />
      <LevelComplete
        filled={filled}
        levelNumber={0}
        currentGuess={currentGuess}
        found={found}
        colour={ColourScheme.GOOD_GREEN}
      />
      <Section
        filled={filled}
        levelNumber={1}
        currentGuess={currentGuess}
        found={found}
        colour={ColourScheme.GREAT_GREEN}
      />
      <LevelComplete
        filled={filled}
        levelNumber={1}
        currentGuess={currentGuess}
        found={found}
        colour={ColourScheme.GREAT_GREEN}
      />
      <Section
        currentGuess={currentGuess}
        filled={filled}
        levelNumber={2}
        found={found}
        colour={ColourScheme.GREEN}
      />
      <LevelComplete
        currentGuess={currentGuess}
        filled={filled}
        levelNumber={2}
        found={found}
        colour={ColourScheme.GREEN}
      />
    </Stack>
  );
};
