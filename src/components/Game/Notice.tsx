import { Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const Container = styled(Stack)(({ theme }) => ({
  height: "48px",
  flexDirection: "row",
  gap: "5px",
  width: "100%",
  justifyContent: "center",
}));

const Text = styled(Typography)(() => ({
  color: "black",
  fontSize: "16px",
  fontWeight: 700,
  height: "48px",
}));

export const Notice = ({ notice }: { notice: string }) => {
  return (
    <Container
      sx={{
        "@keyframes jolt": {
          "0%": {
            transform: "translateX(0)",
          },
          "15%": {
            transform: "translateX(5px)",
          },
          "30%": {
            transform: "translateX(-5px)",
          },
          "45%": {
            transform: "translateX(0px)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
        animation: "jolt 0.5s infinite",
        animationIterationCount: 1,
      }}
    >
      <Text>{notice}</Text>
    </Container>
  );
};
