export const isSubSequence = (
  letters: string[],
  word: string,
  m: number,
  n: number
) => {
  // Base Cases
  if (m == 0) return true;
  if (n == 0) return false;

  // If last characters of two strings
  // are matching
  if (letters[m - 1] == word[n - 1])
    return isSubSequence(letters, word, m - 1, n - 1);

  // If last characters are not matching
  return isSubSequence(letters, word, m, n - 1);
};
