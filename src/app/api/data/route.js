export async function POST(req) {
  const body = await req.json();
  console.log("📡 Data received from ESP32:", body);

  // Example: you could save this to a database here (MongoDB, etc.)
  // await db.collection('devices').insertOne(body);

  return Response.json({ status: "✅ Data received successfully" });
}
