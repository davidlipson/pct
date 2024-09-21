import {
  Button,
  FormControl,
  FormLabel,
  Stack,
  TextField,
} from "@mui/material";
import { useContext, useState } from "react";
import { GameContext } from "../App";

export const Login = () => {
  const [currentUsername, setCurrentUsername] = useState("");
  const { updateUsername } = useContext(GameContext);
  return (
    <Stack>
      <FormControl>
        <FormLabel>Enter Name</FormLabel>
        <TextField
          onChange={(e) => setCurrentUsername(e.target.value)}
        ></TextField>
        <Button onClick={() => updateUsername(currentUsername)}>Submit</Button>
      </FormControl>
    </Stack>
  );
};
