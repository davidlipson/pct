import { Stack, Typography } from "@mui/material";
import { ColourScheme } from "../../constants/colourScheme";
import { useContext } from "react";
import { GameContext } from "../../App";
import { styled } from "@mui/material/styles";
import "react-circular-progressbar/dist/styles.css";
import { WORDS_GOAL } from "../../constants";

type TextProps = {
  small?: boolean;
};

const Text = styled(Typography)<TextProps>(({ theme, small }) => ({
  color: ColourScheme.GREEN,
  fontSize: small ? "24px" : "100px",
  fontWeight: 700,
  lineHeight: small ? "24px" : "100px",
}));

export const Score = ({ found }: { found: number }) => {
  const { points, max, words } = useContext(GameContext);
  /* const [level, setLevel] = useState(0);
  const [percent, setPercent] = useState(0);
   const [hideBar, setHideBar] = useState(false);
  const [animateText, setAnimateText] = useState(false);

  const getPercent = (lvl: number, pts: number) => {
    let percent = 100;
    if (lvl < LEVELS.length - 1) {
      percent = ((pts - LEVELS[lvl]) / (LEVELS[lvl + 1] - LEVELS[lvl])) * 100;
    }
    return Math.max(1, percent);
  };

  useEffect(() => {
    // find highest level less than points
    const nextPercent = getPercent(currentLevel, points);
    if (
      points > 0 &&
      currentLevel > level &&
      currentLevel < LEVELS.length - 1
    ) {
      // set showPoints to the level points briefly and then to the actual points
      setPercent(100);
      setTimeout(() => {
        setHideBar(true);
        setPercent(nextPercent);
        setLevel(currentLevel);
      }, 1000);
      setTimeout(() => {
        setHideBar(false);
      }, 1000);
    } else {
      setLevel(currentLevel);
      setPercent(nextPercent);
    }
  }, [points]);

  useEffect(() => {
    if (percent === 100) {
      setAnimateText(true);
      setTimeout(() => {
        setAnimateText(false);
      }, 1000);
    }
  }, [percent]);*/

  return (
    <Stack direction="row" alignItems="baseline">
      <Stack direction="row">
        <Text>{points}</Text>
        <Text small>{found ? `+ ${found}` : ""}</Text>
      </Stack>
      {false && words.length >= WORDS_GOAL && max >= 0 && (
        <Text small>{`/ ${max}`}</Text>
      )}
    </Stack>
  );

  /*
  return (
    <Container
      sx={{
        // fade in on load
        animation: "fadeIn 2s forwards",
        "@keyframes fadeIn": {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
      }}
    >
      <CircularProgressbar
        background={currentLevel === LEVELS.length - 1}
        styles={{
          root: { width: "200px" },
          text: {
            fontSize: "20px",
            fontWeight: 700,
            fill: ColourScheme.GREEN,
            textAnchor: "middle",
            dominantBaseline: "central",
          },
          trail: {
            display: "none",
          },
          path: {
            display: hideBar ? "none" : "block",
            strokeLinecap: "butt",
            strokeWidth: "3px",
            transition: "stroke-dashoffset 0.5s ease 0s",
            stroke:
              percent < 33
                ? ColourScheme.GOOD_GREEN
                : percent < 66
                ? ColourScheme.GREAT_GREEN
                : ColourScheme.GREEN,
          },
          background: {
            fill: ColourScheme.GOOD_GREEN,
          },
        }}
        value={percent}
        text={`${points}`}
      />
    </Container>
  );*/
};
