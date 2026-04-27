import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

type Props = {
  code: string;
  lang: string;
};

// Map our language values to shiki language names
const langMap: Record<string, string> = {
  python: "python",
  javascript: "javascript",
  typescript: "typescript",
  react: "tsx",
  html: "html",
  java: "java",
  cpp: "cpp",
  rust: "rust",
  go: "go",
  sql: "sql",
};

export function CodeHighlight({ code, lang }: Props) {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    if (!code) {
      setHtml("");
      return;
    }
    codeToHtml(code, {
      lang: langMap[lang] ?? "text",
      theme: "github-dark-default",
    })
      .then((out) => {
        if (!cancelled) setHtml(out);
      })
      .catch(() => {
        if (!cancelled)
          setHtml(
            `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`
          );
      });
    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  if (!html) {
    // While shiki loads, render plain code so streaming feels instant
    return (
      <pre className="font-mono text-[13px] leading-[1.7] text-zinc-200 whitespace-pre">
        <code>{code}</code>
      </pre>
    );
  }

  return (
    <div
      className="tf-shiki"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
