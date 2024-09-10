export const INFINITE = 100;

const retryAsync = async <Type = any>(
  operation: () => Promise<Type>,
  retries: number = 3,
  interval: number = 100,
  maxInterval: number = 500,
  retrieOperation?: () => Promise<any>
): Promise<Type> => {
  try {
    return await operation();
  } catch (err) {
    if (retries === 1) throw err;

    if (retrieOperation) await retrieOperation();

    const delay: number = Math.min(interval * 2, maxInterval); //back off-delay
    return retryAsync(operation, retries - 1, delay, maxInterval);
  }
};

export default retryAsync;
