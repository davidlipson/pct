import { Button, Drawer, Stack, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { useContext, useState } from "react";

import { ColourScheme } from "../../constants";
import { View } from "./Game";
import CloseIcon from "@mui/icons-material/Close";
import { GameContext, LeaderboardEntry } from "./contexts/GameContext";
import ordinal from "ordinal";

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

const HeaderText = styled(Typography)(({ theme }) => ({}));

const UsernameEnter = () => {
  const { setUsername } = useContext(GameContext);
  const [currentUsername, setCurrentUsername] = useState<string>();

  return (
    <Stack spacing={2} alignItems="center">
      <HeaderText textAlign="center">JOIN THE LEADERBOARD</HeaderText>
      <TextField
        sx={{
          width: "300px",
        }}
        onChange={(e) => {
          // must be alphabetical
          if (
            /^[a-zA-Z]*$/.test(e.target.value) &&
            e.target.value.length < 10
          ) {
            setCurrentUsername(e.target.value);
          }
        }}
        value={currentUsername}
        placeholder="Enter a username (only letters)"
      ></TextField>
      <Button onClick={async () => await setUsername(currentUsername)}>
        Join
      </Button>
    </Stack>
  );
};

export const Leaderboard = ({
  open,
  setView,
}: {
  open: boolean;
  setView: any;
}) => {
  const {
    leaderboard,
    user: { username, userid: myId },
  } = useContext(GameContext);
  return (
    <Drawer anchor="bottom" open={open} onClose={() => setView(View.GAME)}>
      <Stack alignItems="center" padding="24px">
        <InnerStack spacing={2} paddingBottom="24px">
          <Stack direction="row" width={1} justifyContent="end">
            <CloseIcon
              style={{ cursor: "pointer" }}
              onClick={() => setView(View.GAME)}
            />
          </Stack>

          {username ? (
            <>
              <Stack direction="column" spacing={1}>
                <HeaderText textAlign="center">
                  YESTERDAY'S LEADERBOARD
                </HeaderText>
              </Stack>

              <Stack spacing={0} alignItems="center">
                {leaderboard.map(
                  ({ username, userid, score }: LeaderboardEntry, index) => (
                    <Stack
                      padding="10px"
                      width={1}
                      justifyContent="space-between"
                      alignItems="center"
                      bgcolor={
                        myId === userid
                          ? ColourScheme.GOOD_GREEN
                          : ColourScheme.LIGHT_GREY
                      }
                      spacing={1}
                      direction="row"
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <HeaderText
                          fontSize="10px"
                          fontWeight={700}
                          fontStyle="italic"
                          width="20px"
                        >
                          {myId === userid || index + 1 <= 3
                            ? ordinal(index + 1)
                            : ""}
                        </HeaderText>
                        <HeaderText fontWeight={700}>
                          {username.toUpperCase()}
                        </HeaderText>
                      </Stack>
                      <HeaderText>{score}</HeaderText>
                    </Stack>
                  )
                )}
              </Stack>
            </>
          ) : (
            <UsernameEnter />
          )}
        </InnerStack>
      </Stack>
    </Drawer>
  );
};
