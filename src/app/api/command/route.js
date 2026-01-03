let latestCommand = { led: "off" }; // default command

export async function GET() {
  // ESP32 requests this endpoint to know the current command
  return Response.json(latestCommand);
}

export async function POST(req) {
  // Web dashboard or admin panel can send a new command
  const body = await req.json();
  latestCommand = body;
  console.log("💡 New command set:", latestCommand);

  return Response.json({ status: "✅ Command updated" });
}
