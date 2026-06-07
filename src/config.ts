export interface ChatwootConfig {
  baseUrl: string;
  accountId: number;
  apiAccessToken?: string;
  email?: string;
  password?: string;
}

function parseAccountId(value: string | undefined): number {
  if (!value) {
    throw new Error(
      "CHATWOOT_ACCOUNT_ID is required. Set it in Vercel environment variables or .env."
    );
  }

  const accountId = Number.parseInt(value, 10);
  if (!Number.isInteger(accountId) || accountId <= 0) {
    throw new Error("CHATWOOT_ACCOUNT_ID must be a positive integer.");
  }

  return accountId;
}

export function getChatwootConfig(): ChatwootConfig {
  if (!process.env.CHATWOOT_BASE_URL) {
    throw new Error(
      "CHATWOOT_BASE_URL is required. Set it in Vercel environment variables or .env."
    );
  }

  const apiAccessToken = process.env.CHATWOOT_API_TOKEN;
  const email = process.env.CHATWOOT_EMAIL;
  const password = process.env.CHATWOOT_PASSWORD;

  if (!apiAccessToken && !email) {
    throw new Error(
      "Either CHATWOOT_API_TOKEN or CHATWOOT_EMAIL must be provided."
    );
  }

  return {
    baseUrl: process.env.CHATWOOT_BASE_URL,
    accountId: parseAccountId(process.env.CHATWOOT_ACCOUNT_ID),
    apiAccessToken,
    email,
    password,
  };
}

export function getAccountId(): number {
  return getChatwootConfig().accountId;
}
