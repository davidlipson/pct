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
import { BONUS_LIMIT } from "../../constants";
import { View } from "./Game";

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
              style={{ cursor: "pointer" }}
              sx={{
                ":hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Send Feedback
            </Typography>
            <Typography
              fontSize="12px"
              variant="overline"
              textAlign="right"
              onClick={() => setView(View.GAME)}
              style={{ cursor: "pointer" }}
              sx={{
                ":hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Close
            </Typography>
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
                Points are awarded based on the length of each word, and are
                doubled for words longer than {BONUS_LIMIT} letters.
              </DirectionText>
            </Stack>

            <Stack spacing={1}>
              <HeaderText>For Example</HeaderText>
              <Guess guess={validWord} example />
              <DirectionText>
                is a valid word worth <strong>{validPoints} points</strong>{" "}
                (there's a freeby!)
              </DirectionText>
              <Guess guess={invalidWord} example />
              <DirectionText>
                is not because{" "}
                <strong>
                  {letters.map((letter) => letter.toUpperCase()).join(", ")}
                </strong>{" "}
                are not found in the correct order.
              </DirectionText>
            </Stack>

            <Stack spacing={1}>
              <HeaderText>Enjoy!</HeaderText>

              <DirectionText>
                PCT was created by Earl Lipson to play on long car rides with
                friends and family.
              </DirectionText>
              <DirectionText>
                The digital version of the game is developed and maintained by
                David Lipson.
              </DirectionText>
            </Stack>
          </Stack>
        </InnerStack>
      </Stack>
    </Drawer>
  );
};
