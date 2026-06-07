export interface ChatwootConfig {
  baseUrl: string;
  apiAccessToken?: string;
  email?: string;
  password?: string;
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
    apiAccessToken,
    email,
    password,
  };
}
