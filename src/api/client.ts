// Simulated API client delay to mimic real network behavior and async sagas
export const delay = (ms: number = 400): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const apiCall = async <T>(callback: () => T, delayMs: number = 400): Promise<T> => {
  await delay(delayMs);
  return callback();
};
