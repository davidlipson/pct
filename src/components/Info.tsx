import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import { useContext } from "react";
import { GameContext } from "../App";
import * as Sentry from "@sentry/react";
import CancelIcon from "@mui/icons-material/Cancel";
import HelpIcon from "@mui/icons-material/Help";

type ButtonProps = {
  howTo?: boolean;
};
const Button = styled(Box)<ButtonProps>(({ theme, howTo }) => ({
  zIndex: 10,
  position: "absolute",
  top: "20px",
  right: howTo ? "20px" : "60px",
  cursor: "pointer",
  [theme.breakpoints.down("sm")]: {
    left: !howTo && "20px",
    right: !howTo && "unset",
  },
}));

export const Info = ({
  howToPlay,
  setHowToPlay,
}: {
  howToPlay: boolean;
  setHowToPlay: any;
}) => {
  const { words, letters, points } = useContext(GameContext);
  return (
    <>
      <Button howTo onClick={() => setHowToPlay((prev) => !prev)}>
        {howToPlay ? <CancelIcon /> : <HelpIcon />}
      </Button>
      <Button
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
