import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { LETTERS } from "../constants/constants";

dayjs.extend(utc);
dayjs.extend(timezone);

// consistent algorithm for generating today's letters
export const todaysLetters = (): string[] => {
  const timeInToronto = dayjs().tz("America/Toronto");
  const firstLetter =
    LETTERS[
      (timeInToronto.day() * timeInToronto.date() + 2) % LETTERS.length
    ].toLowerCase();
  const secondLetter =
    LETTERS[
      (timeInToronto.month() * timeInToronto.day() + timeInToronto.date()) %
        LETTERS.length
    ].toLowerCase();
  const thirdLetter =
    LETTERS[
      (timeInToronto.year() * timeInToronto.month() + timeInToronto.day()) %
        LETTERS.length
    ].toLowerCase();
  return [firstLetter, secondLetter, thirdLetter];
};
