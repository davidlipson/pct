import { Box, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ColourScheme } from "../constants/colourScheme";
import { QWERTY } from "../constants/constants";

const firstRow = QWERTY[0].toLowerCase().split("");
const secondRow = QWERTY[1].toLowerCase().split("");
const thirdRow = QWERTY[2].toLowerCase().split("");
const GAP = "7px";

const KeyboardStack = styled(Stack)(({ theme }) => ({
  "& .key:hover": {
    border: "1px solid white",
  },
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: GAP,
  "& .key": {
    border: `1px solid ${ColourScheme.GREY}`,
  },
}));

const KeyRow = styled(Stack)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  gap: GAP,
  justifyContent: "center",
}));

const Key = styled(Box)(({ theme }) => ({
  backgroundColor: ColourScheme.GREY,
  borderRadius: "4px",
  fontSize: "20px",
  textAlign: "center",
  width: "100%",
  height: "50px",
  padding: "5px",
  alignContent: "center",
  cursor: "pointer",
  ":hover": {
    opacity: 0.6,
  },
}));

export const Keyboard = ({
  submitKey,
}: {
  submitKey: (key: string) => void;
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
        {secondRow.map((c) => (
          <Key key={c} onClick={() => submitKey(c)}>
            {c.toUpperCase()}
          </Key>
        ))}
      </KeyRow>
      <KeyRow>
        <Key
          sx={{ fontSize: "12px" }}
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
          sx={{ fontSize: "12px" }}
          className="backspace"
          onClick={() => submitKey("Backspace")}
        >
          DEL
        </Key>
      </KeyRow>
    </KeyboardStack>
  );
};
