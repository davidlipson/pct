import { Box, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import CancelIcon from "@mui/icons-material/Cancel";
import HelpIcon from "@mui/icons-material/Help";

const Container = styled(Stack)(({ theme }) => ({
  zIndex: 5,
  position: "absolute",
  backgroundColor: "rgb(245,245,245, 0.9)",
  height: "85vh",
  width: "90vw",
  borderRadius: "7px",
  padding: "20px",
}));

const Toggle = styled(Box)(({ theme }) => ({
  zIndex: 10,
  position: "absolute",
  top: "20px",
  right: "20px",
  cursor: "pointer",
}));

const HowToPlayContainer = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

export const HowToPlay = ({
  howToPlay,
  setHowToPlay,
}: {
  howToPlay: boolean;
  setHowToPlay: any;
}) => {
  return (
    <HowToPlayContainer>
      <Toggle onClick={() => setHowToPlay(!howToPlay)}>
        {howToPlay ? <CancelIcon /> : <HelpIcon />}
      </Toggle>
      {howToPlay && (
        <Container>
          <Typography variant="h4">How to Play PCT</Typography>
        </Container>
      )}
    </HowToPlayContainer>
  );
};
