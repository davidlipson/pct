import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import { useContext } from "react";
import { GameContext } from "../../App";
import * as Sentry from "@sentry/react";
import CancelIcon from "@mui/icons-material/Cancel";
import HelpIcon from "@mui/icons-material/Help";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { View } from "./Game";

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
          let firstLine = `I'm playing PCT!`;
          if (points > 0) {
            const sortedWords = words
              .sort((a, b) => b.word.length - a.word.length)
              .slice(0, 3);

            firstLine = `Check out my top words for ${letters
              .map((letter) => letter.toUpperCase())
              .join(".")}:\n(Total points: ${points})\n\n${sortedWords
              .map((word) => word.word[0].toUpperCase() + word.word.slice(1))
              .join("\n")}`;
          }

          const text = `${firstLine}\n\nPlay now!`;
          const copyText = `${firstLine}\n\nPlay now at ${url}!`;
          try {
            const data = {
              url,
              text,
            };
            if (navigator.canShare(data)) {
              await navigator.share(data);
            } else {
              await navigator.clipboard.writeText(copyText);
              setNotice("Copied to clipboard!");
            }
            Sentry.captureEvent({
              message: "Share button clicked.",
              extra: {
                words,
                letters,
                points,
                usedShare: navigator.canShare(data),
              },
              level: "info",
            });
          } catch (e) {
            console.error("Error sharing", e);
          }
        }}
      >
        <SendIcon />
      </Button>
    </>
  );
};
