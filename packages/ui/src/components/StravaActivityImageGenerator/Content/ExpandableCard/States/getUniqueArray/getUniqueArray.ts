/**
 * Returns an array of unique strings from the input array.
 * @param {T[]} input - The array of strings to filter for uniqueness.
 * @returns {T[]} An array of unique strings.
 */
const getUniqueArray = <T extends string>(input: T[]): T[] =>
  input.filter((item, index, items) => items.indexOf(item) === index);

export default getUniqueArray;
