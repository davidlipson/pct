import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import { useContext } from "react";
import { GameContext, Word } from "../../App";
import CancelIcon from "@mui/icons-material/Cancel";
import HelpIcon from "@mui/icons-material/Help";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { View } from "./Game";
import mixpanel from "mixpanel-browser";
import { WORDS_GOAL } from "../../constants";

export const shareOnClick = async (
  points: number,
  letters: string[],
  words: Word[],
  setNotice: (notice: string) => void
) => {
  let firstLine = `I'm playing PCT!`;
  const sortedWords = words
    .sort((a, b) => b.word.length - a.word.length)
    .slice(0, 3);

  if (words.length >= WORDS_GOAL) {
    firstLine = `I beat ${letters
      .map((letter) => letter.toUpperCase())
      .join(
        "."
      )}!\nCheck my top words:\n(Total points: ${points})\n\n${sortedWords
      .map((word) => word.word[0].toUpperCase() + word.word.slice(1))
      .join("\n")}`;
  } else if (points > 0) {
    firstLine = `Check my top words for ${letters
      .map((letter) => letter.toUpperCase())
      .join(".")} so far:\n(Total points: ${points})\n\n${sortedWords
      .map((word) => word.word[0].toUpperCase() + word.word.slice(1))
      .join("\n")}`;
  }

  const text = `${firstLine}\n\nPlay now!`;
  try {
    const data = {
      url,
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
    mixpanel.track("Share button clicked.", {
      words,
      letters,
      points,
      usedShare: navigator.canShare(data),
    });
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
  const { words, letters, points } = useContext(GameContext);
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
