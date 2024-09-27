import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { GENIUS, LETTERS, MIN_WORDS } from "../constants/constants";
import { totalMatchingWords } from "./totalMatchingWords";

dayjs.extend(utc);
dayjs.extend(timezone);

// consistent algorithm for generating today's letters
export const todaysLetters = (): string[] => {
  const timeInToronto = dayjs().tz("America/Toronto");
  // HBD dad
  if (timeInToronto.month() === 8 && timeInToronto.date() === 29) {
    return ["p", "c", "t"];
  }

  let iterOne = 0;
  let iterTwo = 0;
  let iterThree = 0;

  while (true) {
    const firstLetter =
      LETTERS[
        (timeInToronto.day() * timeInToronto.date() + iterOne) % LETTERS.length
      ].toLowerCase();
    const secondLetter =
      LETTERS[
        (timeInToronto.month() * timeInToronto.day() +
          iterTwo +
          timeInToronto.date()) %
          LETTERS.length
      ].toLowerCase();
    const thirdLetter =
      LETTERS[
        (timeInToronto.year() * timeInToronto.month() +
          iterThree +
          timeInToronto.day()) %
          LETTERS.length
      ].toLowerCase();
    const totalWords = totalMatchingWords([
      firstLetter,
      secondLetter,
      thirdLetter,
    ]);
    if (totalWords >= MIN_WORDS) {
      return [firstLetter, secondLetter, thirdLetter];
    }
    iterOne++;
    iterTwo++;
    iterThree++;
  }
};
