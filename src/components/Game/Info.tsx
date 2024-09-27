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
  top: "30px",
  right: "40px",
  cursor: "pointer",
}));

export const Info = ({ view, setView }: { view: View; setView: any }) => {
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

          try {
            await navigator.share({
              url: "www.pctgame.com",
              text,
            });
            Sentry.captureEvent({
              message: "Share button clicked.",
              extra: { words, letters, points },
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
