import { Box, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ColourScheme } from "../../constants/colourScheme";
import { QWERTY } from "../../constants/constants";

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
  gap: "8px",
  "& .key": {
    border: `1px solid ${ColourScheme.GREY}`,
  },
}));

const KeyRow = styled(Stack)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  gap: "7px",
  justifyContent: "center",
}));

const Key = styled(Stack)(({ theme }) => ({
  backgroundColor: ColourScheme.BLACK,
  color: ColourScheme.WHITE,
  borderRadius: "4px",
  fontSize: "16px",
  textAlign: "center",
  justifyContent: "center",
  width: "100%",
  height: "50px",
  padding: "5px",
  lineHeight: "50px",
  alignContent: "center",
  cursor: "pointer",
  userSelect: "none",
  ":hover": {
    opacity: 0.6,
  },
}));

const Space = styled(Box)(({ theme }) => ({
  width: "50%",
  height: "50px",
}));

export const Keyboard = ({
  submitKey,
  startBackspaceTimer,
}: {
  submitKey: (key: string) => void;
  startBackspaceTimer: () => void;
}) => {
  return (
    <KeyboardStack>
      <KeyRow>
        {firstRow.map((c) => (
          <Key key={c} onClick={() => submitKey(c)}>
            {c.toUpperCase()}
          </Key>
        ))}
      </KeyRow>
      <KeyRow>
        <Space />
        {secondRow.map((c) => (
          <Key key={c} onClick={() => submitKey(c)}>
            {c.toUpperCase()}
          </Key>
        ))}
        <Space />
      </KeyRow>
      <KeyRow>
        <Key
          sx={{ fontSize: "10px", width: "150%" }}
          className="enter"
          onClick={() => submitKey("Enter")}
        >
          ENTER
        </Key>
        {thirdRow.map((c) => (
          <Key onClick={() => submitKey(c)} key={c}>
            {c.toUpperCase()}
          </Key>
        ))}

        <Key
          sx={{ fontSize: "12px", width: "150%" }}
          className="backspace"
          onMouseDown={startBackspaceTimer}
          onMouseUp={() => submitKey("Backspace")}
          //onClick={() => submitKey("Backspace")}
        >
          DEL
        </Key>
      </KeyRow>
    </KeyboardStack>
  );
};
