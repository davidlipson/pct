import {
  Button,
  Drawer,
  Stack,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { ColourScheme } from "../../constants";
import CloseIcon from "@mui/icons-material/Close";

import mixpanel from "mixpanel-browser";

const InnerStack = styled(Stack)(({ theme }) => ({
  backgroundColor: "white",
  width: "100%",
  maxWidth: "800px",
  maxHeight: "75vh",
  borderRadius: "7px",
  [theme.breakpoints.down("md")]: {
    maxWidth: "100%",
  },
}));

const DirectionText = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  fontWeight: 200,
}));

const HeaderText = styled(Typography)(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 400,
}));

export const Feedback = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: any;
}) => {
  const [feedback, setFeedback] = useState("");
  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <Stack alignItems="center" padding="20px 24px 48px 24px">
        <InnerStack spacing={2}>
          <Stack>
            <Stack direction="row" width={1} justifyContent="end">
              <CloseIcon style={{ cursor: "pointer" }} onClick={onClose} />
            </Stack>
            <Typography
              fontSize="18px"
              variant="overline"
              textAlign="center"
              width={1}
            >
              Send Feedback
            </Typography>
          </Stack>
          <TextareaAutosize
            style={{
              padding: "10px",
            }}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter your feedback here..."
            maxLength={200}
            maxRows={5}
          />
          <Button
            onClick={() => {
              if (feedback.length > 0) {
                mixpanel.track("Feedback sent.", {
                  feedback,
                });
                onClose();
              }
            }}
            sx={{ color: ColourScheme.BLACK }}
          >
            Submit
          </Button>
        </InnerStack>
      </Stack>
    </Drawer>
  );
};
