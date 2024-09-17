import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import { useContext } from "react";
import { GameContext } from "../App";

const ShareButton = styled(Box)(({ theme }) => ({
  zIndex: 10,
  position: "absolute",
  top: "20px",
  right: "60px",
  cursor: "pointer",
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
          firstLine = `I scored ${points} points on today's letters (${letters
            .map((letter) => letter.toUpperCase())
            .join("")})!\n${words
            .map((word) => word.word[0].toUpperCase() + word.word.slice(1))
            .join(", ")}`;
        }
        navigator.clipboard.writeText(
          `${firstLine}.\n\nPlay now at https://pct.vercel.app`
        );
        setNotice("Copied to clipboard!");
      }}
    >
      <SendIcon />
    </ShareButton>
  );
};
