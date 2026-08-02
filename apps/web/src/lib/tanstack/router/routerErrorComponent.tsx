import { FlagMark } from "@/components/ui/flag-accents";
import { Link } from "@tanstack/react-router";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { RouteStatusShell } from "./RouteStatusShell";

interface RouterErrorComponentProps {
  error: Error;
  reset?: () => void;
}

/**
 * Builds a clipboard-ready dump of the error name, message, and stack.
 */
function formatErrorForClipboard(error: Error): string {
  const lines = [`${error.name}: ${error.message}`];
  if (error.stack) {
    lines.push("", error.stack);
  }
  return lines.join("\n");
}

export function RouterErrorComponent({ error, reset }: RouterErrorComponentProps) {
  return (
    <RouteStatusShell
      data-test="router-error"
      eyebrow="Unexpected hiccup"
      title={
        <>
          Something went <span className="text-flag-red">sideways</span>
        </>
      }
      description="This page hit a snag on our end. Give it another moment, or head back home while we sort things out."
      actions={
        <>
          <Link
            to="/"
            data-test="router-error-home"
            className="inline-flex items-center gap-3 rounded-md bg-flag-green-solid px-5 py-3.5 text-[15px] font-semibold text-flag-green-content shadow-[0_0_0_1px_rgba(255,255,255,0.06)] transition-opacity hover:opacity-90"
          >
            Back home
            <FlagMark className="ring-white/20" />
          </Link>
          {reset ? (
            <button
              type="button"
              data-test="router-error-retry"
              onClick={reset}
              className="rounded-md border border-flag-red/45 px-5 py-3.5 text-[15px] text-base-content transition-colors hover:bg-flag-red-soft"
            >
              Try again
            </button>
          ) : null}
        </>
      }
      footer={import.meta.env.DEV ? <RouterErrorDevelopmentPanel error={error} /> : null}
    />
  );
}

function RouterErrorDevelopmentPanel({ error }: { error: Error }) {
  const [copied, setCopied] = useState(false);

  async function copyErrorDetails() {
    try {
      await navigator.clipboard.writeText(formatErrorForClipboard(error));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div
      data-test="router-error-development"
      className="w-full min-w-0 overflow-hidden rounded-lg border border-border/40 bg-base-200/80 p-4 text-left backdrop-blur-sm"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-sm text-flag-red">{error.name}</p>
        <button
          type="button"
          data-test="router-error-copy"
          onClick={() => void copyErrorDetails()}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-base-content/15 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-base-content/30 hover:text-base-content"
        >
          {copied ? (
            <Check className="size-3.5" aria-hidden="true" />
          ) : (
            <Copy className="size-3.5" aria-hidden="true" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="mt-2 min-w-0 overflow-x-auto">
        <p className="w-max max-w-none font-mono text-sm leading-6 whitespace-pre text-muted-foreground">
          {error.message}
        </p>
      </div>

      {error.stack ? (
        <details className="group mt-4" open>
          <summary className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-base-content">
            Stack trace
          </summary>
          <pre className="mt-3 max-h-64 min-w-0 overflow-auto rounded-md border border-border/40 bg-base-100/60 p-3 font-mono text-xs leading-5 whitespace-pre text-base-content/75">
            {error.stack}
          </pre>
        </details>
      ) : null}
    </div>
  );
}
