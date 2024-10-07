import { Drawer, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { useContext } from "react";
import { GameContext } from "../../App";
import {
  calculatePoints,
  firstMatchingWord,
  wordWithLettersNotInOrder,
} from "../../utils";
import { Guess } from "./Guess";
import { BONUS_LIMIT, ColourScheme, LEVEL_NAMES } from "../../constants";
import { View } from "./Game";
import { PointsProgress } from "./PointsProgress";
import CloseIcon from "@mui/icons-material/Close";

const InnerStack = styled(Stack)(({ theme }) => ({
  backgroundColor: "white",
  width: "100%",
  maxWidth: "800px",
  maxHeight: "75vh",
  borderRadius: "7px",
  [theme.breakpoints.down("md")]: {
    maxWidth: "100%",
  },
}));

const DirectionText = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  fontWeight: 200,
}));

const HeaderText = styled(Typography)(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 400,
}));

export const HowToPlay = ({
  open,
  setView,
}: {
  open: boolean;
  setView: any;
}) => {
  const {
    letters: { letters },
    target,
  } = useContext(GameContext);
  const validWord = firstMatchingWord(letters).toUpperCase();
  const validPoints = calculatePoints(validWord);
  const invalidWord = wordWithLettersNotInOrder(letters).toUpperCase();
  return (
    <Drawer anchor="bottom" open={open} onClose={() => setView(View.GAME)}>
      <Stack alignItems="center" padding="24px">
        <InnerStack spacing={2}>
          <Stack direction="row" width={1} justifyContent="space-between">
            <Typography
              fontSize="12px"
              variant="overline"
              textAlign="left"
              onClick={() => {
                setView(View.FEEDBACK);
              }}
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              Send Feedback
            </Typography>
            <CloseIcon
              style={{ cursor: "pointer" }}
              onClick={() => setView(View.GAME)}
            />
          </Stack>

          <Stack spacing={3}>
            <Stack direction="column" spacing={1}>
              <HeaderText>Play PCT</HeaderText>
              <DirectionText>
                Everyday, you will see three new letters. Today's letters are{" "}
                <strong>
                  {letters.map((letter) => letter.toUpperCase()).join(", ")} .
                </strong>
              </DirectionText>
              <DirectionText>
                Your goal is to create the <strong>{target}</strong> longest
                words you can with these letters.
              </DirectionText>
              <DirectionText>
                <strong>
                  {letters
                    .slice(0, 2)
                    .map((letter) => letter.toUpperCase())
                    .join(", ")}{" "}
                  and {letters[2].toUpperCase()}
                </strong>{" "}
                do not need to appear back-to-back, however they must appear in
                the order provided.
              </DirectionText>
            </Stack>

            <Stack spacing={1}>
              <HeaderText>Scoring</HeaderText>
              <DirectionText>
                Each letter is worth one point, and words longer than{" "}
                {BONUS_LIMIT} letters will receive 2 points for every additional
                letter.
              </DirectionText>
              <DirectionText>
                There are three levels: {LEVEL_NAMES.slice(0, 2).join(", ")} and{" "}
                {LEVEL_NAMES[2]}.
              </DirectionText>
              <DirectionText>
                Every day these levels will change depending on the difficulty
                of the letters provided.
              </DirectionText>
              <DirectionText>
                Click on each square in the score bar to see how many points to
                the next level.
              </DirectionText>
              <PointsProgress filled />
            </Stack>

            <Stack spacing={1}>
              <HeaderText>For Example</HeaderText>
              <Stack
                sx={(theme) => ({
                  [theme.breakpoints.down("md")]: {
                    flexDirection: "column",
                    gap: "12px",
                  },
                  flexDirection: "row",
                })}
                justifyContent="space-between"
              >
                <Stack spacing={1}>
                  <Guess guess={validWord} example />
                  <DirectionText>
                    is a valid word worth <strong>{validPoints} points</strong>{" "}
                    (there's a freeby!)
                  </DirectionText>
                </Stack>
                <Stack spacing={1}>
                  <Guess guess={invalidWord} example />
                  <DirectionText>
                    is not because{" "}
                    <strong>
                      {letters.map((letter) => letter.toUpperCase()).join(", ")}
                    </strong>{" "}
                    are not found in the correct order.
                  </DirectionText>
                </Stack>
              </Stack>
            </Stack>

            <Stack spacing={1}>
              <HeaderText>Enjoy!</HeaderText>

              <DirectionText
                sx={{
                  fontSize: "12px",
                }}
              >
                PCT was created by Earl Lipson to play on long car rides with
                friends and family, and developed for the web by David Lipson.
              </DirectionText>
            </Stack>
          </Stack>
        </InnerStack>
      </Stack>
    </Drawer>
  );
};
