import { NextResponse } from "next/server";
import {
  categories,
  feedCollections,
  featuredStory,
  pipelineStages,
  sourceHighlights,
  trendingStories,
  trendSignals,
} from "@/lib/elyra-data";

export async function GET() {
  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    featuredStory,
    trendSignals,
    categories,
    sourceHighlights,
    pipelineStages,
    trendingStories,
    collections: feedCollections,
  });
}