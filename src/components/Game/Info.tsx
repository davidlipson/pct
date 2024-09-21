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
  right: "20px",
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
      <Button
        key="leaderboard"
        onClick={() =>
          setView((prev) =>
            prev === View.LEADERBOARD ? View.GAME : View.LEADERBOARD
          )
        }
        sx={{
          right: "60px",
        }}
      >
        {view === View.LEADERBOARD ? <CancelIcon /> : <EmojiEventsIcon />}
      </Button>
      <Button
        key="share"
        sx={{
          right: "100px",
        }}
        onClick={async () => {
          let firstLine = `I'm playing PCT!`;
          if (points > 0) {
            firstLine = `Check out my words for ${letters
              .map((letter) => letter.toUpperCase())
              .join(".")}:\n(Total points: ${points})\n\n${words
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
