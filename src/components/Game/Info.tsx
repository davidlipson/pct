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

export const shareOnClick = async (
  points: number,
  letters: string[],
  words: Word[],
  target: number,
  setNotice: (notice: string) => void
) => {
  let firstLine = `I'm playing PCT!\n`;

  if (words.length >= target) {
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
    letters: { letters },
    points,
    target,
  } = useContext(GameContext);
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
          shareOnClick(points, letters, words, target, setNotice);
        }}
      >
        <SendIcon />
      </Button>
    </>
  );
};
