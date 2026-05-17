"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Language = "cpp" | "rust";

type TokenType =
  | "keyword"
  | "preprocessor"
  | "string"
  | "comment"
  | "number"
  | "macro"
  | "lifetime"
  | "type"
  | "plain";

type Token = { type: TokenType; text: string };

// — keyword sets —

const CPP_KEYWORDS = new Set([
  "alignas", "alignof", "auto", "bool", "break", "case", "catch", "char",
  "char8_t", "char16_t", "char32_t", "class", "concept", "const", "consteval",
  "constexpr", "constinit", "const_cast", "continue", "co_await", "co_return",
  "co_yield", "decltype", "default", "delete", "do", "double", "dynamic_cast",
  "else", "enum", "explicit", "export", "extern", "false", "final", "float",
  "for", "friend", "goto", "if", "inline", "int", "long", "mutable",
  "namespace", "new", "noexcept", "nullptr", "operator", "override", "private",
  "protected", "public", "register", "reinterpret_cast", "requires", "return",
  "short", "signed", "sizeof", "static", "static_assert", "static_cast",
  "struct", "switch", "template", "this", "thread_local", "throw", "true",
  "try", "typedef", "typeid", "typename", "union", "unsigned", "using",
  "virtual", "void", "volatile", "wchar_t", "while",
]);

const RUST_KEYWORDS = new Set([
  "as", "async", "await", "break", "const", "continue", "crate", "dyn",
  "else", "enum", "extern", "false", "fn", "for", "if", "impl", "in", "let",
  "loop", "match", "mod", "move", "mut", "pub", "ref", "return", "self",
  "Self", "static", "struct", "super", "trait", "true", "type", "unsafe",
  "use", "where", "while",
]);

// one-dark-pro-style palette
const TOKEN_COLORS: Record<TokenType, string> = {
  keyword:      "text-[#c678dd]",
  preprocessor: "text-[#e06c75]",
  string:       "text-[#98c379]",
  comment:      "text-[#5c6370] italic",
  number:       "text-[#d19a66]",
  macro:        "text-[#61afef]",
  lifetime:     "text-[#e06c75]",
  type:         "text-[#e5c07b]",
  plain:        "text-[#d8e3f0]",
};

// — runners —

const PROMPTS: Record<Language, string> = { cpp: "$ ./snippet", rust: "$ cargo run" };
const LANG_LABEL: Record<Language, string> = { cpp: "C++", rust: "RUST" };
const LANG_BADGE: Record<Language, string> = {
  cpp:  "border-[#5cb8ff]/40 bg-[#5cb8ff]/10 text-[#5cb8ff]",
  rust: "border-[#f0804a]/40 bg-[#f0804a]/10 text-[#f0804a]",
};

type RunResult = { output: string; error: string | null };

// wandbox (default, no auth required)
const WANDBOX_COMPILER: Record<Language, string> = { cpp: "gcc-head", rust: "rust-1.82.0" };
const WANDBOX_OPTIONS: Partial<Record<Language, string>> = { cpp: "c++17" };

interface WandboxResponse {
  status: string;
  compiler_error: string;
  program_output: string;
  program_error: string;
}

async function runWithWandbox(code: string, lang: Language): Promise<RunResult> {
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

// piston (self-hosted; set NEXT_PUBLIC_PISTON_URL to enable)
const PISTON_LANG: Record<Language, string> = { cpp: "c++", rust: "rust" };
const PISTON_FILE: Record<Language, string> = { cpp: "main.cpp", rust: "main.rs" };

interface PistonStage { stdout: string; stderr: string; code: number }
interface PistonResponse { compile?: PistonStage; run: PistonStage }

async function runWithPiston(code: string, lang: Language, baseUrl: string): Promise<RunResult> {
  const res = await fetch(`${baseUrl}/api/v2/execute`, {
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

function executeCode(code: string, lang: Language): Promise<RunResult> {
  const pistonUrl = process.env.NEXT_PUBLIC_PISTON_URL;
  return pistonUrl ? runWithPiston(code, lang, pistonUrl) : runWithWandbox(code, lang);
}

// — component —

type SnippetRunnerProps = {
  code: string;
  title?: string;
  language?: Language;
};

const runDelayMs = 120;

export function SnippetRunner({ code, title, language = "cpp" }: SnippetRunnerProps) {
  const [editableCode, setEditableCode]     = useState(() => code.replace(/^\n+|\n+$/g, ""));
  const [isRunning, setIsRunning]           = useState(false);
  const [hasRun, setHasRun]                 = useState(false);
  const [outputLines, setOutputLines]       = useState<string[]>([]);
  const [errorText, setErrorText]           = useState<string | null>(null);
  const [visibleLineCount, setVisibleCount] = useState(0);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const preRef          = useRef<HTMLPreElement>(null);
  const textareaRef     = useRef<HTMLTextAreaElement>(null);
  const pendingSelection = useRef<[number, number] | null>(null);

  const codeLines = useMemo(() => tokenizeLines(editableCode, language), [editableCode, language]);

  const clearTimers = useCallback(() => {
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];
  }, []);

  function syncScroll() {
    if (!preRef.current || !textareaRef.current) return;
    preRef.current.scrollTop  = textareaRef.current.scrollTop;
    preRef.current.scrollLeft = textareaRef.current.scrollLeft;
  }

  useEffect(() => () => clearTimers(), [clearTimers]);

  useLayoutEffect(() => {
    if (pendingSelection.current) {
      textareaRef.current?.setSelectionRange(...pendingSelection.current);
      pendingSelection.current = null;
    }
  });

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const ta = e.currentTarget;
    const { selectionStart: ss, selectionEnd: se, value } = ta;

    if (e.key === "Enter") {
      e.preventDefault();
      const lineStart = value.lastIndexOf("\n", ss - 1) + 1;
      const indent = value.slice(lineStart, ss).match(/^\s*/)?.[0] ?? "";
      const insert = "\n" + indent;
      setEditableCode(value.slice(0, ss) + insert + value.slice(se));
      pendingSelection.current = [ss + insert.length, ss + insert.length];
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();

      if (ss === se) {
        // no selection — single-cursor insert or remove
        if (e.shiftKey) {
          const lineStart = value.lastIndexOf("\n", ss - 1) + 1;
          const spaces = value.slice(lineStart, ss).match(/ {1,2}$/)?.[0].length ?? 0;
          if (spaces) {
            setEditableCode(value.slice(0, ss - spaces) + value.slice(ss));
            pendingSelection.current = [ss - spaces, ss - spaces];
          }
        } else {
          setEditableCode(value.slice(0, ss) + "  " + value.slice(se));
          pendingSelection.current = [ss + 2, ss + 2];
        }
        return;
      }

      // selection spans lines — block indent / dedent
      const lineStart = value.lastIndexOf("\n", ss - 1) + 1;
      const lineEnd   = value.indexOf("\n", se);
      const before = value.slice(0, lineStart);
      const block  = value.slice(lineStart, lineEnd < 0 ? value.length : lineEnd);
      const after  = lineEnd < 0 ? "" : value.slice(lineEnd);
      const lines  = block.split("\n");

      if (e.shiftKey) {
        let removedFirst = 0, totalRemoved = 0;
        const dedented = lines.map((line, i) => {
          const n = Math.min(2, line.length - line.trimStart().length);
          if (i === 0) removedFirst = n;
          totalRemoved += n;
          return line.slice(n);
        });
        setEditableCode(before + dedented.join("\n") + after);
        pendingSelection.current = [ss - removedFirst, se - totalRemoved];
      } else {
        const indented = lines.map((l) => "  " + l);
        setEditableCode(before + indented.join("\n") + after);
        pendingSelection.current = [ss + 2, se + lines.length * 2];
      }
    }
  }

  async function runSnippet() {
    clearTimers();
    setIsRunning(true);
    setHasRun(false);
    setOutputLines([]);
    setErrorText(null);
    setVisibleCount(0);

    try {
      const result = await executeCode(editableCode, language);

      if (result.error) {
        setErrorText(result.error);
        setHasRun(true);
        setIsRunning(false);
        return;
      }

      const lines = result.output.split("\n");
      if (lines.at(-1) === "") lines.pop();

      setOutputLines(lines);
      setHasRun(true);
      setIsRunning(false);

      lines.forEach((_: string, idx: number) => {
        const t = setTimeout(() => setVisibleCount(idx + 1), runDelayMs * (idx + 1));
        timerRefs.current.push(t);
      });
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : "Failed to connect");
      setHasRun(true);
      setIsRunning(false);
    }
  }

  function resetSnippet() {
    clearTimers();
    setIsRunning(false);
    setHasRun(false);
    setOutputLines([]);
    setErrorText(null);
    setVisibleCount(0);
  }

  const isError = hasRun && errorText !== null;
  const dotClass = isRunning
    ? "animate-pulse bg-[#66a6ff]"
    : isError
    ? "bg-[#e06c75]"
    : "bg-[#526173]";

  return (
    <figure className="my-8 overflow-hidden rounded-lg border bg-card text-card-foreground shadow-xs">
      <div className="flex items-center justify-between gap-3 border-b px-3 py-2 sm:px-4">
        <figcaption className="flex items-center gap-2.5">
          <span className={cn("rounded border px-1.5 py-px font-mono text-[10px] font-bold tracking-widest", LANG_BADGE[language])}>
            {LANG_LABEL[language]}
          </span>
          {title && (
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {title}
            </span>
          )}
        </figcaption>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="Reset"
            title="Reset"
            onClick={resetSnippet}
          >
            <RotateCcw />
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={runSnippet}
            disabled={isRunning}
          >
            <Play />
            {isRunning ? "Running…" : "Run"}
          </Button>
        </div>
      </div>

      <div className="relative bg-[#0b1020]">
        <pre
          ref={preRef}
          aria-hidden
          className="overflow-hidden p-4 text-sm leading-6 pointer-events-none select-none"
        >
          <code>
            {codeLines.map((lineTokens, lineIdx) => (
              <span key={lineIdx} className="block min-w-max">
                <span className="mr-4 inline-block w-6 text-right text-[#73819d]">
                  {lineIdx + 1}
                </span>
                {lineTokens.map((tok, tokIdx) => (
                  <span key={tokIdx} className={TOKEN_COLORS[tok.type]}>
                    {tok.text}
                  </span>
                ))}
              </span>
            ))}
          </code>
        </pre>
        <textarea
          ref={textareaRef}
          suppressHydrationWarning
          className="absolute inset-0 w-full h-full resize-none border-none font-mono text-sm leading-6 outline-none"
          style={{
            background: "transparent",
            color: "transparent",
            caretColor: "#d8e3f0",
            padding: "1rem 1rem 1rem 3.5rem",
            whiteSpace: "pre",
            overflowWrap: "normal",
            tabSize: 2,
          }}
          value={editableCode}
          onChange={(e) => setEditableCode(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={syncScroll}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>

      <div className="border-t bg-[#07111f] p-4 font-mono text-sm text-[#d7e8ff]">
        <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#99abc1]">
          <span className={cn("size-2 rounded-full", dotClass)} />
          {isError ? "stderr" : "stdout"}
        </div>
        <output aria-live="polite" className="block min-h-16 whitespace-pre-wrap">
          {!hasRun && !isRunning ? (
            PROMPTS[language]
          ) : isRunning ? (
            `${PROMPTS[language]}\n…`
          ) : isError ? (
            <span className="text-[#e06c75]">{errorText}</span>
          ) : (
            outputLines.slice(0, visibleLineCount).join("\n")
          )}
        </output>
      </div>
    </figure>
  );
}

// — tokenizer —

const reAlpha = /[a-zA-Z_]/;
const reAlNum = /[a-zA-Z0-9_]/;
const reDigit = /\d/;
const reHexDigit = /[\da-fA-F]/;

function tokenizeLines(code: string, lang: Language): Token[][] {
  const lines: Token[][] = [[]];
  for (const tok of tokenize(code, lang)) {
    const parts = tok.text.split("\n");
    lines[lines.length - 1].push({ type: tok.type, text: parts[0] });
    for (let j = 1; j < parts.length; j++) {
      lines.push([]);
      if (parts[j]) lines[lines.length - 1].push({ type: tok.type, text: parts[j] });
    }
  }
  return lines;
}

function tokenize(code: string, lang: Language): Token[] {
  const tokens: Token[] = [];
  const kw = lang === "cpp" ? CPP_KEYWORDS : RUST_KEYWORDS;
  let i = 0;

  const c = (offset = 0) => code[i + offset] ?? "";

  while (i < code.length) {
    // block comment
    if (c() === "/" && c(1) === "*") {
      const end = code.indexOf("*/", i + 2);
      const j = end < 0 ? code.length : end + 2;
      tokens.push({ type: "comment", text: code.slice(i, j) });
      i = j;
      continue;
    }
    // line comment
    if (c() === "/" && c(1) === "/") {
      let j = i;
      while (j < code.length && code[j] !== "\n") j++;
      tokens.push({ type: "comment", text: code.slice(i, j) });
      i = j;
      continue;
    }
    // double-quoted string
    if (c() === '"') {
      let j = i + 1;
      while (j < code.length && code[j] !== '"') {
        if (code[j] === "\\") j++;
        j++;
      }
      tokens.push({ type: "string", text: code.slice(i, j + 1) });
      i = j + 1;
      continue;
    }
    // Rust raw string r#"..."#
    if (lang === "rust" && c() === "r" && c(1) === "#" && c(2) === '"') {
      const end = code.indexOf('"#', i + 3);
      const j = end < 0 ? code.length : end + 2;
      tokens.push({ type: "string", text: code.slice(i, j) });
      i = j;
      continue;
    }
    // single quote: Rust lifetime or char literal
    if (c() === "'") {
      if (lang === "rust" && reAlpha.test(c(1))) {
        let j = i + 2;
        while (j < code.length && reAlNum.test(code[j])) j++;
        if (code[j] !== "'") {
          tokens.push({ type: "lifetime", text: code.slice(i, j) });
          i = j;
          continue;
        }
      }
      let j = i + 1;
      if (code[j] === "\\") j += 2;
      else j++;
      if (code[j] === "'") j++;
      tokens.push({ type: "string", text: code.slice(i, j) });
      i = j;
      continue;
    }
    // C++ preprocessor directive
    if (lang === "cpp" && c() === "#") {
      let j = i;
      while (j < code.length && code[j] !== "\n") j++;
      tokens.push({ type: "preprocessor", text: code.slice(i, j) });
      i = j;
      continue;
    }
    // number
    if (reDigit.test(c()) || (c() === "." && reDigit.test(c(1)))) {
      let j = i;
      if (c() === "0" && /[xX]/.test(c(1))) {
        j += 2;
        while (j < code.length && reHexDigit.test(code[j])) j++;
      } else {
        while (j < code.length && reDigit.test(code[j])) j++;
        if (code[j] === ".") { j++; while (j < code.length && reDigit.test(code[j])) j++; }
        if (/[eE]/.test(code[j])) { j++; if (/[+-]/.test(code[j])) j++; while (j < code.length && reDigit.test(code[j])) j++; }
      }
      while (j < code.length && /[uUlLfFiI]/.test(code[j])) j++;
      tokens.push({ type: "number", text: code.slice(i, j) });
      i = j;
      continue;
    }
    // identifier - keyword / macro / PascalCase type (Rust) / plain
    if (reAlpha.test(c())) {
      let j = i + 1;
      while (j < code.length && reAlNum.test(code[j])) j++;
      const word = code.slice(i, j);
      i = j;
      if (lang === "rust" && code[i] === "!" && code[i + 1] !== "=") {
        tokens.push({ type: "macro", text: word + "!" });
        i++;
      } else if (kw.has(word)) {
        tokens.push({ type: "keyword", text: word });
      } else if (lang === "rust" && /^[A-Z]/.test(word)) {
        tokens.push({ type: "type", text: word });
      } else {
        tokens.push({ type: "plain", text: word });
      }
      continue;
    }
    // everything else (whitespace, operators, punctuation)
    tokens.push({ type: "plain", text: code[i] });
    i++;
  }

  return tokens;
}
