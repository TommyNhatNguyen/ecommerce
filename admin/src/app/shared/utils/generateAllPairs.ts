export const generateAllPairs = (data: { [key: string]: string[] }) => {
  const keys = Object.keys(data);
  const nonEmptyKeys = keys.filter((key) => data[key].length > 0);

  // If all arrays are empty, return [[]] as a fallback
  if (nonEmptyKeys.length === 0) {
    return [[]];
  }

  // If there are empty arrays but at least one non-empty array,
  // return each element of the first non-empty array wrapped in its own array.
  if (keys.some((key) => data[key].length === 0)) {
    const firstNonEmptyKey = nonEmptyKeys[0]; // Safely pick the first non-empty key
    return data[firstNonEmptyKey].map((value) => [value]);
  }

  const result: string[][] = [];

  function backtrack(index: number, current: string[]) {
    if (index === keys.length) {
      result.push([...current]); // Store a copy of the current combination
      return;
    }

    for (const value of data[keys[index]]) {
      current.push(value);
      backtrack(index + 1, current);
      current.pop(); // Backtrack
    }
  }

  backtrack(0, []);
  return result;
};
