import { NextRequest, NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import { withRateLimit } from "@/middleware/rate-limit";
import { executeWithPiston, executeWithWandbox } from "@/lib/execute-remote-api";

async function handler(req: NextRequest) {
  const { code, language } = await req.json();

  if (!code || !language) {
    return NextResponse.json({ error: "missing code or language" }, { status: StatusCodes.BAD_REQUEST });
  }

  const pistonUrl = process.env.PISTON_URL;

  let usedFallback = false;

  if (pistonUrl) {
    try {
      return NextResponse.json(await executeWithPiston(code, language, pistonUrl));
    } catch {
      usedFallback = true;
    }
  }

  try {
    const result = await executeWithWandbox(code, language);
    if (usedFallback)
      result.output = `[piston unavailable, ran on wandbox]\n${result.output}`;
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Execution failed";
    return NextResponse.json({ error: message }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
}

export const POST = withRateLimit(handler);
