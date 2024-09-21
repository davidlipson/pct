import { Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const Container = styled(Stack)(({ theme }) => ({
  backgroundColor: "white",
  boxShadow: "0px 3px 5px 0px rgba(0,0,0,0.2)",
  width: "100%",
  borderRadius: "7px",
  padding: "20px 48px 48px 48px",
  gap: "20px",
  [theme.breakpoints.down("md")]: {
    padding: "48px 48px",
    height: "100%",
  },
}));

const HowToPlayContainer = styled(Stack)(({ theme }) => ({
  width: "400px",
  flexDirection: "column",
  justifyContent: "center",
  display: "flex",
  alignSelf: "center",
  alignItems: "center",
  height: "100%",
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
}));

export const Leaderboard = () => {
  return (
    <HowToPlayContainer>
      <Container>
        <Typography
          fontSize="18px"
          variant="overline"
          textAlign="center"
          width={1}
        >
          Leaderboard
        </Typography>
      </Container>
    </HowToPlayContainer>
  );
};
