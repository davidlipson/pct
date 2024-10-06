import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { LETTERS, MIN_WORDS } from "../constants/constants";
import { allMatchingWords } from "./totalMatchingWords";

dayjs.extend(utc);
dayjs.extend(timezone);

export type LettersOfTheDay = {
  letters: string[];
  totalWords: number;
};

const specialDays = {
  "09-29": ["p", "c", "t"],
  "10-08": ["j", "g", "l"],
  "10-19": ["t", "b", "l"],
  "12-03": ["j", "m", "l"],
  "05-11": ["m", "o", "m"],
  "06-15": ["d", "a", "d"],
};

// consistent algorithm for generating today's letters
export const todaysLetters = (): LettersOfTheDay => {
  const timeInToronto = dayjs().tz("America/Toronto");

  const specialDay = specialDays[timeInToronto.format("MM-DD")];
  if (specialDay) {
    const totalWords = allMatchingWords(specialDay).length;
    return { letters: specialDay, totalWords };
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
    const totalWords = allMatchingWords([
      firstLetter,
      secondLetter,
      thirdLetter,
    ]);
    if (totalWords.length >= MIN_WORDS) {
      return {
        letters: [firstLetter, secondLetter, thirdLetter],
        totalWords: totalWords.length,
      };
    }
    iterOne++;
    iterTwo++;
    iterThree++;
  }
};
