import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import { useContext } from "react";
import { GameContext } from "../App";
import * as Sentry from "@sentry/react";

const ShareButton = styled(Box)(({ theme }) => ({
  zIndex: 10,
  position: "absolute",
  top: "20px",
  right: "60px",
  cursor: "pointer",
  [theme.breakpoints.down("sm")]: {
    left: "20px",
    right: "unset",
  },
}));

export const Share = ({
  setNotice,
}: {
  setNotice: (notice: string) => void;
}) => {
  const { words, letters, points } = useContext(GameContext);
  return (
    <ShareButton
      onClick={() => {
        let firstLine = `I'm playing PCT!`;
        if (points > 0) {
          firstLine = `Check out my words for ${letters
            .map((letter) => letter.toUpperCase())
            .join(".")}:\n(Total points: ${points})\n\n${words
            .map((word) => word.word[0].toUpperCase() + word.word.slice(1))
            .join("\n")}`;
        }
        navigator.clipboard.writeText(
          `${firstLine}\n\nPlay now at https://pctgame.com`
        );
        Sentry.captureEvent({
          message: "Share button clicked.",
          extra: { words, letters, points },
        });
        setNotice("Copied to clipboard!");
      }}
    >
      <SendIcon />
    </ShareButton>
  );
};
