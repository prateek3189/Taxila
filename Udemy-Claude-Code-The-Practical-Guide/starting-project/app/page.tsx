"use client";

import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-8xl font-bold text-black dark:text-zinc-50">
        Hello World
      </h1>
      <ul className="mt-8 list-disc space-y-2 text-left text-lg text-zinc-700 dark:text-zinc-300">
        <li>AI-powered coding directly in your terminal</li>
        <li>Understands full codebase context across files</li>
        <li>Runs shell commands, edits files, and manages git</li>
        <li>Supports multi-step agentic tasks autonomously</li>
        <li>Works with any language or framework</li>
      </ul>
      <div className="mt-10 flex flex-col items-center gap-4">
        <span className="text-6xl font-bold text-black dark:text-zinc-50">{count}</span>
        <div className="flex gap-4">
          <button
            onClick={() => setCount((c) => c - 1)}
            className="rounded-xl bg-zinc-200 px-6 py-3 text-2xl font-bold text-black hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
          >
            −
          </button>
          <button
            onClick={() => setCount((c) => c + 1)}
            className="rounded-xl bg-zinc-200 px-6 py-3 text-2xl font-bold text-black hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
