import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "elyra",
    mode: "scaffold",
    timestamp: new Date().toISOString(),
  });
}