import CheckIcon from "@mui/icons-material/Check";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Box, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ColourScheme } from "../constants/colourScheme";
import { QWERTY } from "../constants/constants";

const firstRow = QWERTY[0].toLowerCase().split("");
const secondRow = QWERTY[1].toLowerCase().split("");
const thirdRow = QWERTY[2].toLowerCase().split("");

const KeyboardStack = styled(Stack)(({ theme }) => ({
  "& .key:hover": {
    border: "1px solid white",
  },
  display: "flex",
  flexDirection: "column",
  width: "100%",
  "& .key": {
    border: `1px solid ${ColourScheme.GREY}`,
  },
  backgroundColor: ColourScheme.GREY,
}));

const Key = styled(Box)(({ theme }) => ({
  backgroundColor: ColourScheme.GREY,
  fontSize: "20px",
  textAlign: "center",
  width: "50px",
  height: "50px",
  padding: "10px",
  alignContent: "center",
  cursor: "pointer",
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
}));

export const Keyboard = ({
  submitKey,
}: {
  submitKey: (key: string) => void;
}) => {
  return (
    <KeyboardStack>
      <div className="row">
        {firstRow.map((c) => (
          <Key key={c} onClick={() => submitKey(c)}>
            {c.toUpperCase()}
          </Key>
        ))}
      </div>
      <div className="row">
        <Key className="backspace" onClick={() => submitKey("Backspace")}>
          <KeyboardBackspaceIcon id="delete" />
        </Key>
        {secondRow.map((c) => (
          <Key key={c} onClick={() => submitKey(c)}>
            {c.toUpperCase()}
          </Key>
        ))}
        <Key className="enter" onClick={() => submitKey("Enter")}>
          <CheckIcon id="checkmark" fontSize="large" />
        </Key>
      </div>
      <div className="row">
        <Key className=" spacer" />
        {thirdRow.map((c) => (
          <Key onClick={() => submitKey(c)} key={c}>
            {c.toUpperCase()}
          </Key>
        ))}
        <Key className="spacer" />
      </div>
    </KeyboardStack>
  );
};
