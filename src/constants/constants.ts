export const QWERTY = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
export const LETTERS = QWERTY.join("").split("");
export const MIN_LENGTH = 3;
export const MAX_LENGTH = 12;

export const NONE = 0;
export const GOOD = 25;
export const GREAT = 50;
export const GENIUS = 100;
export const MIN_WORDS = 500;
export const LEVELS = [NONE, GOOD, GREAT, GENIUS];
export const LEVEL_TEXT = ["You've Practiced!", "Spectacular!", "Perfect!"];
