import { useContext, useEffect, useState } from "react";
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
import { WORDS_GOAL } from "../../constants";

const WordStack = styled(Stack)(({ theme }) => ({
  maxHeight: "300px",
  overflowY: "scroll",
}));

const Entry = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingRight: "2px",
}));

export const Words = ({
  expanded,
  setExpanded,
}: {
  expanded: boolean;
  setExpanded: (val: boolean) => void;
}) => {
  const { words, totalWords } = useContext(GameContext);
  const alphabeticallySorted = words.sort((a, b) => {
    if (a.word < b.word) {
      return -1;
    }
    if (a.word > b.word) {
      return 1;
    }
    return 0;
  });
  const [text, setText] = useState<string>("");
  const longestWord = alphabeticallySorted.reduce(
    (acc, { word }) => (word.length > acc ? word.length : acc),
    0
  );
  const firstWordWithMaxLetters = alphabeticallySorted.find(
    ({ word }) => word.length === longestWord
  );

  useEffect(() => {
    let total = totalWords === 0 ? "" : `You hit today's goal! Now go outside.`;
    if (words.length < WORDS_GOAL) {
      total = `${words.length} / ${WORDS_GOAL} words found`;
    }
    setText(total);
  }, [words, totalWords]);

  const handleAccordionChange = (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded);
    console.log(`Accordion is now ${isExpanded ? "open" : "closed"}`);
  };

  return (
    <Box width="100%">
      <Accordion
        sx={{
          paddingX: "15px",
          boxShadow: "none",
          margin: 0,
          "&& .Mui-expanded": {
            margin: "10px 0 0 0",
            minHeight: "20px",
          },
          border: `1.5px solid ${ColourScheme.GREY}`,
        }}
        onChange={handleAccordionChange}
        expanded={expanded}
      >
        <AccordionSummary
          sx={{
            margin: 0,
          }}
          expandIcon={
            words.length && words.length < WORDS_GOAL ? (
              <ExpandMoreIcon />
            ) : (
              <></>
            )
          }
          aria-controls="panel1-content"
          id="panel1-header"
          disabled={words.length === 0}
        >
          <Typography color={ColourScheme.DARK_GREY}>{text}</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            paddingX: 0,
          }}
        >
          <WordStack width={1} direction="column">
            {alphabeticallySorted.map(({ word, points }, index) => (
              <Entry key={index}>
                <Stack direction="row" spacing={1} alignItems="baseline">
                  <Typography fontWeight={200}>{word}</Typography>
                  {word === firstWordWithMaxLetters?.word && (
                    <Typography
                      fontWeight={500}
                      fontSize="12px"
                      lineHeight={1.5}
                      fontStyle="italic"
                      color={ColourScheme.GREEN}
                    >
                      Best word!
                    </Typography>
                  )}
                </Stack>
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
