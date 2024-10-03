import {
  Button,
  FormControl,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { GameContext } from "../../App";
import { ColourScheme } from "../../constants";

export const Login = ({
  setAllowTyping,
}: {
  setAllowTyping: (toggle: boolean) => void;
}) => {
  const [currentUsername, setCurrentUsername] = useState("");
  const [error, setError] = useState(false);
  const { username, updateUsername, validUsername } = useContext(GameContext);
  if (validUsername(username)) {
    return (
      <Stack>
        <Typography>
          Hey {username}, check out{" "}
          <span
            style={{
              fontWeight: 700,
            }}
          >
            today's leaderboard!
          </span>
        </Typography>
      </Stack>
    );
  }
  return (
    <Stack direction="column" spacing={1}>
      <TextField
        sx={{
          "& > .MuiOutlinedInput-notchedOutline": {
            border: `1px solid ${ColourScheme.GREY}`,
            borderRadius: "4px",
            borderColor: ColourScheme.GREY,
          },
          "& > .MuiInputBase-root > .MuiInputBase-input": {
            height: "20px !important",
            padding: "10px",
            width: "200px",
          },
        }}
        value={currentUsername}
        placeholder="Enter your username"
        onFocus={() => setAllowTyping(false)}
        onBlur={() => setAllowTyping(true)}
        onChange={(e) => {
          setCurrentUsername(e.target.value);
          setError(!validUsername(e.target.value));
        }}
      ></TextField>
      <Button
        sx={{
          color: "black",
          border: `1px solid ${ColourScheme.GREY}`,
          borderRadius: "4px",
          backgroundColor: ColourScheme.GREY,
        }}
        onClick={() => updateUsername(currentUsername)}
      >
        Join the Leaderboard
      </Button>
      <Typography textAlign="center" fontSize="10px" sx={{ color: "red" }}>
        {error ? "Name must be 3-15 letters, alphanumeric." : ""}
      </Typography>
    </Stack>
  );
};
