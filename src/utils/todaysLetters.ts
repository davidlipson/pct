import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { LETTERS } from "../constants/constants";

dayjs.extend(utc);
dayjs.extend(timezone);

// consistent algorithm for generating today's letters
export const todaysLetters = (): string[] => {
  const timeInToronto = dayjs().tz("America/Toronto");
  // HBD dad
  if (timeInToronto.month() === 8 && timeInToronto.date() === 29) {
    return ["p", "c", "t"];
  }
  const firstLetter =
    LETTERS[
      (timeInToronto.day() * timeInToronto.date() + 3) % LETTERS.length
    ].toLowerCase();
  const secondLetter =
    LETTERS[
      (timeInToronto.month() * timeInToronto.day() + 1 + timeInToronto.date()) %
        LETTERS.length
    ].toLowerCase();
  const thirdLetter =
    LETTERS[
      (timeInToronto.year() * timeInToronto.month() + 5 + timeInToronto.day()) %
        LETTERS.length
    ].toLowerCase();
  return [firstLetter, secondLetter, thirdLetter];
};
