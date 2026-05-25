import { NextResponse } from "next/server";
import { getLiveStories } from "@/lib/live-news";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") || "12");
  const stories = await getLiveStories(limit);

  return NextResponse.json({
    stories,
    count: stories.length,
    requestedLimit: limit,
  });
}
