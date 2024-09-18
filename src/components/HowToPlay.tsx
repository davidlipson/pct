import { Box, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import CancelIcon from "@mui/icons-material/Cancel";
import HelpIcon from "@mui/icons-material/Help";
import { useContext } from "react";
import { GameContext } from "../App";

const Container = styled(Stack)(({ theme }) => ({
  zIndex: 5,
  position: "absolute",
  backgroundColor: "white",
  boxShadow: "0px 3px 5px 0px rgba(0,0,0,0.2)",
  height: "300px",
  top: "calc(50% - 150px)",
  left: "calc(50% - 400px)",
  width: "800px",
  borderRadius: "7px",
  padding: "20px 48px",
}));

const Toggle = styled(Box)(({ theme }) => ({
  zIndex: 10,
  position: "absolute",
  top: "20px",
  right: "20px",
  cursor: "pointer",
}));

const Letter = styled(Typography)(({ theme }) => ({
  color: "black",
  fontWeight: 700,
}));

const HowToPlayContainer = styled(Box)(({ theme }) => ({}));

const DirectionText = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  fontWeight: 200,
}));

export const HowToPlay = ({
  howToPlay,
  setHowToPlay,
}: {
  howToPlay: boolean;
  setHowToPlay: any;
}) => {
  const { letters } = useContext(GameContext);
  return (
    <HowToPlayContainer>
      <Toggle onClick={() => setHowToPlay(!howToPlay)}>
        {howToPlay ? <CancelIcon /> : <HelpIcon />}
      </Toggle>
      {howToPlay && (
        <Container>
          <Typography
            fontSize="18px"
            variant="overline"
            textAlign="center"
            width={1}
          >
            How To Play PCT
          </Typography>
          <Stack direction="column" spacing={1}>
            <Stack alignItems="cente" direction="row" spacing={1}>
              <DirectionText>
                Everyday, you will be given three new letters (for example,
                today's letters are{" "}
              </DirectionText>
              <Letter>
                {letters.map((letter) => letter.toUpperCase()).join(", ")}.)
              </Letter>
            </Stack>
            <DirectionText></DirectionText>
          </Stack>
        </Container>
      )}
    </HowToPlayContainer>
  );
};
