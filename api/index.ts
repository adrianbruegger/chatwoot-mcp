export async function GET(): Promise<Response> {
  return Response.json({
    name: "chatwoot-mcp-server",
    version: "1.0.0",
    mcp: "/api/mcp",
    docs: "https://github.com/adrianbruegger/chatwoot-mcp",
  });
}
