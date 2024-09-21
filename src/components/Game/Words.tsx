import { useContext } from "react";
import { GameContext } from "../../App";
import { styled } from "@mui/material/styles";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ColourScheme } from "../../constants/colourScheme";

const WordStack = styled(Stack)(({ theme }) => ({
  maxHeight: "300px",
  overflowY: "scroll",
}));

const Entry = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  padding: "2px",
  alignItems: "center",
}));

export const Words = (/*{ totalWords }: { totalWords: number }*/) => {
  const { words } = useContext(GameContext);
  /*const text = words.length
    ? totalWords > 0
      ? `${words.length} / ${totalWords} words found`
      : "Your words"
    : "No words found";*/
  const text = words.length ? `${words.length} words found` : "No words found";
  return (
    <Box width="100%">
      <Accordion
        sx={{
          paddingX: "20px",
          boxShadow: "none",
          border: `1.5px solid ${ColourScheme.GREY}`,
        }}
      >
        <AccordionSummary
          expandIcon={words.length ? <ExpandMoreIcon /> : <></>}
          aria-controls="panel1-content"
          id="panel1-header"
          disabled={words.length === 0}
        >
          <Typography color={ColourScheme.DARK_GREY}>{text}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <WordStack width={1} direction="column" spacing={3}>
            {words.map(({ word, points }, index) => (
              <Entry key={index}>
                <Typography fontWeight={200}>{word}</Typography>
                <Typography fontWeight={200} fontSize="12px">
                  ({points})
                </Typography>
              </Entry>
            ))}
          </WordStack>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
