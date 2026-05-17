import { NextRequest, NextResponse } from "next/server";

type Language = "cpp" | "rust";

type RunResult = { output: string; error: string | null };

// wandbox
const WANDBOX_COMPILER: Record<Language, string> = { cpp: "gcc-head", rust: "rust-1.82.0" };
const WANDBOX_OPTIONS: Partial<Record<Language, string>> = { cpp: "c++17" };

interface WandboxResponse {
  status: string;
  compiler_error: string;
  program_output: string;
  program_error: string;
}

async function executeWithWandbox(code: string, lang: Language): Promise<RunResult> {
  const body: Record<string, string> = { code, compiler: WANDBOX_COMPILER[lang] };
  if (WANDBOX_OPTIONS[lang]) body.options = WANDBOX_OPTIONS[lang]!;

  const res = await fetch("https://wandbox.org/api/compile.json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Wandbox error ${res.status}`);

  const data: WandboxResponse = await res.json();
  if (data.status !== "0" && !data.program_output)
    return { output: "", error: data.compiler_error || data.program_error || "Compilation failed" };
  return { output: data.program_output || "(no output)", error: null };
}

// piston
const PISTON_LANG: Record<Language, string> = { cpp: "c++", rust: "rust" };
const PISTON_FILE: Record<Language, string> = { cpp: "main.cpp", rust: "main.rs" };

interface PistonStage { stdout: string; stderr: string; code: number }
interface PistonResponse { compile?: PistonStage; run: PistonStage }

async function executeWithPiston(code: string, lang: Language, baseUrl: string): Promise<RunResult> {
  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/api/v2/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: PISTON_LANG[lang],
      version: "*",
      files: [{ name: PISTON_FILE[lang], content: code }],
    }),
  });
  if (!res.ok) throw new Error(`Piston error ${res.status}`);

  const data: PistonResponse = await res.json();
  if (data.compile && data.compile.code !== 0)
    return { output: "", error: data.compile.stderr || "Compilation failed" };
  const out = data.run.code !== 0 && !data.run.stdout ? data.run.stderr : data.run.stdout;
  return { output: out || "(no output)", error: null };
}

export async function POST(req: NextRequest) {
  const { code, language } = await req.json();

  if (!code || !language) {
    return NextResponse.json({ error: "missing code or language" }, { status: 400 });
  }

  const pistonUrl = process.env.PISTON_URL;

  let usedFallback = false;

  if (pistonUrl) {
    try {
      return NextResponse.json(await executeWithPiston(code, language as Language, pistonUrl));
    } catch {
      usedFallback = true;
    }
  }

  try {
    const result = await executeWithWandbox(code, language as Language);
    if (usedFallback)
      result.output = `[piston unavailable, ran on wandbox]\n${result.output}`;
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Execution failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
