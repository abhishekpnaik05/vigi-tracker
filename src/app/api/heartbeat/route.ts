import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();

  const { deviceId, userId, lat, lng, battery, signal } = body;

  await supabase
    .from("devices")
    .update({
      status: "Active",
      lat,
      lng,
      battery,
      signal,
      last_seen: Date.now()
    })
    .eq("id", deviceId)
    .eq("user_id", userId);

  return NextResponse.json({ success: true });
}
