export default function Home() {
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
    </div>
  );
}
