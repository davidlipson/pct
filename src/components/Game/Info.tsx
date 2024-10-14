import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import { useContext } from "react";
import { GameContext, Word } from "./contexts/GameContext";
import CancelIcon from "@mui/icons-material/Cancel";
import HelpIcon from "@mui/icons-material/Help";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { View } from "./Game";
import mixpanel from "mixpanel-browser";
import { ColourScheme, WORDS_GOAL } from "../../constants";
import dayjs from "dayjs";

export const shareOnClick = async (
  points: number,
  letters: string[],
  words: Word[],
  setNotice: (notice: string) => void
) => {
  let firstLine = `I'm playing PCT!\n`;

  if (words.length >= WORDS_GOAL) {
    firstLine = `I beat ${letters
      .map((letter) => letter.toUpperCase())
      .join(".")}!\n`;
  }
  const secondLine =
    words.length > 0 ? `${points} points / ${words.length} words\n` : "";

  const text = `${firstLine}${secondLine}\nPlay now!`;
  try {
    const data = {
      url: `${url}?share=true`,
      text,
    };
    if (navigator.share) {
      await navigator.share(data);
    } else {
      setNotice("Can't share from this browser. Redirecting...");
      setTimeout(() => {
        window.location.href = url;
      }, 2000);
    }
    try {
      mixpanel.track("Share button clicked.", {
        words,
        letters,
        points,
        usedShare: navigator.canShare(data),
      });
    } catch (e) {
      console.error("Error sharing", e);
    }
  } catch (e) {
    console.error("Error sharing", e);
  }
};

const Button = styled(Box)(({ theme }) => ({
  zIndex: 10,
  position: "absolute",
  top: "20px",
  right: "40px",
  cursor: "pointer",
}));

const url = "https://www.pctgame.com";

export const Info = ({
  view,
  setView,
  setNotice,
}: {
  view: View;
  setView: any;
  setNotice: any;
}) => {
  const {
    words,
    user,
    letters: { letters },
    points,
  } = useContext(GameContext);
  let currentStreak = user.streak || 0;
  const dayjsLastWon = user.lastwondate
    ? dayjs(user.lastwondate).format("YYYY-MM-DD")
    : null;
  const today = dayjs().format("YYYY-MM-DD");
  const newlyWon = words.length >= WORDS_GOAL;
  if (newlyWon && dayjsLastWon !== today) {
    currentStreak++;
  }
  return (
    <>
      <Button
        key="how-to-play"
        onClick={() =>
          setView((prev) =>
            prev === View.HOW_TO_PLAY ? View.GAME : View.HOW_TO_PLAY
          )
        }
      >
        {view === View.HOW_TO_PLAY ? <CancelIcon /> : <HelpIcon />}
      </Button>
      {currentStreak > 0 && (
        <Button
          sx={{
            right: "calc(50% - 50px)",
          }}
        >
          <Box
            fontSize="10px"
            color={ColourScheme.SUPER}
            width="100px"
            height="15px"
            bgcolor={ColourScheme.WHITE}
            textAlign="center"
            lineHeight="15px"
            borderRadius="5px"
            marginTop="5px"
            sx={{
              "@keyframes onFire": {
                from: {
                  color: ColourScheme.SUPER,
                  backgroundColor: ColourScheme.WHITE,
                },
                to: {
                  color: ColourScheme.WHITE,
                  backgroundColor: ColourScheme.SUPER,
                },
              },
              animation: `${newlyWon ? "onFire 2s infinite" : ""}`,
              animationIterationCount: 1,
              animationFillMode: "forwards",
            }}
            style={{
              outline: `1px solid ${ColourScheme.SUPER}`,
              border: `0.5px solid ${ColourScheme.WHITE}`,
            }}
          >
            {currentStreak} {currentStreak < 999 ? "DAY" : ""} STREAK
          </Box>
        </Button>
      )}
      {false && (
        <Button
          key="leaderboard"
          onClick={() =>
            setView((prev) =>
              prev === View.LEADERBOARD ? View.GAME : View.LEADERBOARD
            )
          }
          sx={{
            right: "120px",
          }}
        >
          {view === View.LEADERBOARD ? <CancelIcon /> : <EmojiEventsIcon />}
        </Button>
      )}
      <Button
        key="share"
        sx={(theme) => ({
          right: "80px",
          [theme.breakpoints.down("md")]: {
            left: "40px",
          },
        })}
        onClick={async () => {
          shareOnClick(points, letters, words, setNotice);
        }}
      >
        <SendIcon />
      </Button>
    </>
  );
};
