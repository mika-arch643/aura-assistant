import ReactMarkdown from "react-markdown";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Pencil, Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function MarkdownOutput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="rounded-2xl border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b px-4 py-2">
        <div className="text-sm font-medium">Output</div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditing((e) => !e)}
          >
            {editing ? (
              <>
                <Eye className="mr-1 h-4 w-4" /> Preview
              </>
            ) : (
              <>
                <Pencil className="mr-1 h-4 w-4" /> Edit
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(value);
              toast.success("Copied to clipboard");
            }}
          >
            <Copy className="mr-1 h-4 w-4" /> Copy
          </Button>
        </div>
      </div>
      <div className="p-4">
        {editing ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[360px] font-mono text-sm"
          />
        ) : (
          <article className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-2xl prose-h2:text-lg prose-p:text-foreground/90 prose-li:text-foreground/90 prose-strong:text-foreground">
            <ReactMarkdown>{value || "_Output will appear here..._"}</ReactMarkdown>
          </article>
        )}
      </div>
    </div>
  );
}
