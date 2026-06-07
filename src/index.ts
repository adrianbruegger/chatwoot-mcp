#!/usr/bin/env node

import dotenv from "dotenv";

dotenv.config();

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createChatwootMcpServer } from "./create-server.js";
import { getChatwootConfig } from "./config.js";

async function main() {
  const config = getChatwootConfig();
  const server = await createChatwootMcpServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);

  console.error("Chatwoot MCP server running on stdio");
  console.error(`Connected to: ${config.baseUrl}`);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
