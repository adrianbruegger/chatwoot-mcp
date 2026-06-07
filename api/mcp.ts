import { timingSafeEqual } from "node:crypto";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createChatwootMcpServer } from "../dist/create-server.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, mcp-session-id, Last-Event-ID, mcp-protocol-version, Authorization",
  "Access-Control-Expose-Headers": "mcp-session-id, mcp-protocol-version",
};

function withCors(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders)) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function unauthorizedResponse(message = "Unauthorized"): Response {
  return withCors(
    new Response(JSON.stringify({ error: message }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        "WWW-Authenticate": 'Bearer realm="chatwoot-mcp"',
      },
    })
  );
}

function isAuthorized(request: Request): boolean {
  const expected = process.env.MCP_AUTH_TOKEN;
  if (!expected) {
    return false;
  }

  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return false;
  }

  const token = auth.slice(7);
  const expectedBuffer = Buffer.from(expected);
  const tokenBuffer = Buffer.from(token);

  if (expectedBuffer.length !== tokenBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, tokenBuffer);
}

function assertAuthorized(request: Request): Response | null {
  if (!process.env.MCP_AUTH_TOKEN) {
    return unauthorizedResponse("MCP_AUTH_TOKEN is not configured");
  }

  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  return null;
}

async function handleMcpRequest(request: Request): Promise<Response> {
  const authError = assertAuthorized(request);
  if (authError) {
    return authError;
  }

  try {
    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });
    const server = await createChatwootMcpServer();

    await server.connect(transport);
    const response = await transport.handleRequest(request);
    return withCors(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return withCors(
      new Response(
        JSON.stringify({
          jsonrpc: "2.0",
          error: { code: -32603, message },
          id: null,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      )
    );
  }
}

export async function OPTIONS(): Promise<Response> {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET(request: Request): Promise<Response> {
  return handleMcpRequest(request);
}

export async function POST(request: Request): Promise<Response> {
  return handleMcpRequest(request);
}

export async function DELETE(request: Request): Promise<Response> {
  return handleMcpRequest(request);
}
