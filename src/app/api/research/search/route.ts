
import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import {
  searchEvidence,
  type EvidencePassage,
} from "@/lib/research-retrieval";


interface EvidenceIndex {
  passages: EvidencePassage[];
}

const VALID_EXPERIMENTS = [
  "ALL",
  "FLEX",
  "BASS-II",
  "SAFFIRE-I",
] as const;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q")?.trim() ?? "";
    const experiment =
      searchParams.get("experiment") ?? "ALL";

    const requestedLimit = Number(
      searchParams.get("limit") ?? 8
    );

    if (query.length < 3 || query.length > 500) {
      return NextResponse.json(
        {
          error: "Question must contain between 3 and 500 characters.",
        },
        { status: 400 }
      );
    }

    if (
      !VALID_EXPERIMENTS.includes(
        experiment as (typeof VALID_EXPERIMENTS)[number]
      )
    ) {
      return NextResponse.json(
        { error: "Invalid experiment selection." },
        { status: 400 }
      );
    }

    const limit = Number.isFinite(requestedLimit)
      ? Math.min(Math.max(Math.floor(requestedLimit), 1), 20)
      : 8;

    const indexPath = path.join(
      process.cwd(),
      "public",
      "data",
      "research",
      "evidence-index.json"
    );

    const fileContents = await readFile(indexPath, "utf-8");
    const evidenceIndex = JSON.parse(
      fileContents
    ) as EvidenceIndex;

    if (!Array.isArray(evidenceIndex.passages)) {
      throw new Error("Invalid evidence index structure.");
    }

    const results = searchEvidence(
      evidenceIndex.passages,
      query,
      experiment,
      limit
    );

    return NextResponse.json({
      success: true,
      query,
      experiment,
      totalIndexedPassages: evidenceIndex.passages.length,
      resultCount: results.length,
      results: results.map(({ passage, score }) => ({
        id: passage.id,
        experiment: passage.experiment,
        source: passage.source,
        sourceType: passage.source_type,
        page: passage.page,
        chunk: passage.chunk,
        text: passage.text,
        relevanceScore: score,
      })),
    });
  } catch (error) {
    console.error("Research evidence search failed:", error);

    return NextResponse.json(
      { error: "Unable to search the research evidence index." },
      { status: 500 }
    );
  }
}
