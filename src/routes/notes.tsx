import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { NotebookPen, Loader2, Wand2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { PageHeader, ToolShell } from "@/components/tool-shell";
import { ResponsibleAi } from "@/components/responsible-ai";
import { MarkdownOutput } from "@/components/markdown-output";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { summarizeMeeting } from "@/lib/ai-tools.functions";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — ThriveDesk" },
      { name: "description", content: "Turn transcripts into summaries, decisions, and action items." },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const fn = useServerFn(summarizeMeeting);
  const [transcript, setTranscript] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!transcript.trim()) {
      toast.error("Paste a transcript to summarize");
      return;
    }
    setLoading(true);
    try {
      const { text } = await fn({ data: { transcript } });
      setOutput(text);
    } catch (err) {
      toast.error("Couldn't summarize. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolShell>
      <PageHeader
        title="Meeting Notes Summarizer"
        description="Paste raw notes or a transcript; get a tidy recap with action items."
        icon={NotebookPen}
        accent="mint"
      />

      <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border bg-card p-5 shadow-sm">
        <div className="grid gap-2">
          <Label htmlFor="t">Transcript or raw notes</Label>
          <Textarea
            id="t"
            rows={12}
            placeholder="Paste your meeting transcript here..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="font-mono text-sm"
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Summarize
          </Button>
        </div>
      </form>

      <MarkdownOutput value={output} onChange={setOutput} />
      <ResponsibleAi />
    </ToolShell>
  );
}
