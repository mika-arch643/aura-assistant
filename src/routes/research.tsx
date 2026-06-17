import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Loader2, Wand2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { PageHeader, ToolShell } from "@/components/tool-shell";
import { ResponsibleAi } from "@/components/responsible-ai";
import { MarkdownOutput } from "@/components/markdown-output";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { researchTopic } from "@/lib/ai-tools.functions";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — ThriveDesk" },
      { name: "description", content: "Get a structured research brief on any topic." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const fn = useServerFn(researchTopic);
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState("overview");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) {
      toast.error("Enter a topic to research");
      return;
    }
    setLoading(true);
    try {
      const { text } = await fn({ data: { topic, depth } });
      setOutput(text);
    } catch (err) {
      toast.error("Couldn't generate research. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolShell>
      <PageHeader
        title="AI Research Assistant"
        description="Get a structured brief: background, key concepts, perspectives, and open questions."
        icon={Sparkles}
        accent="sky"
      />

      <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border bg-card p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_200px]">
          <div className="grid gap-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              placeholder="e.g. Vector databases for RAG"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="depth">Depth</Label>
            <Select value={depth} onValueChange={setDepth}>
              <SelectTrigger id="depth">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Overview</SelectItem>
                <SelectItem value="deep dive">Deep dive</SelectItem>
                <SelectItem value="executive summary">Executive summary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Research
          </Button>
        </div>
      </form>

      <MarkdownOutput value={output} onChange={setOutput} />
      <ResponsibleAi />
    </ToolShell>
  );
}
