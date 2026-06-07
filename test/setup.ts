/**
 * Test setup - loads environment variables
 */
import dotenv from "dotenv";

dotenv.config();

// Validate required env vars for tests
if (!process.env.CHATWOOT_BASE_URL || !process.env.CHATWOOT_API_TOKEN || !process.env.CHATWOOT_ACCOUNT_ID) {
  console.warn(
    "⚠️  Warning: CHATWOOT_BASE_URL, CHATWOOT_ACCOUNT_ID, and CHATWOOT_API_TOKEN must be set in .env for integration tests"
  );
}
