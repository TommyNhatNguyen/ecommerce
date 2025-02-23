export const timeLogger = async <T>(
  message: string,
  fn: () => Promise<T>
): Promise<T> => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  const duration = end - start;

  // Format duration to be human readable
  let formattedTime: string;
  if (duration < 1000) {
    formattedTime = `${duration.toFixed(2)}ms`;
  } else if (duration < 60000) {
    formattedTime = `${(duration / 1000).toFixed(2)}s`;
  } else {
    formattedTime = `${(duration / 60000).toFixed(2)}min`;
  }

  console.log(`${message}: ${formattedTime}`);
  return result;
};
