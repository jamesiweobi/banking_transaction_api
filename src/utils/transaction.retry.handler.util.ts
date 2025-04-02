export async function _performTransactionWithRetry(
  transactionFunction: () => Promise<any>,
  maxRetries = 6,
  retryDelay = 1000,
) {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      return await transactionFunction();
    } catch (error: any) {
      if (error.message.includes('Write conflict')) {
        retries++;
        await new Promise((resolve) => setTimeout(resolve, retryDelay * retries));
      } else {
        throw error;
      }
    }
  }
  throw new Error('Transaction failed, please try again in a few minutes.');
}
