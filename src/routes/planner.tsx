import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ListChecks, Loader2, Wand2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { PageHeader, ToolShell } from "@/components/tool-shell";
import { ResponsibleAi } from "@/components/responsible-ai";
import { MarkdownOutput } from "@/components/markdown-output";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { generatePlan } from "@/lib/ai-tools.functions";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — ThriveDesk" },
      { name: "description", content: "Turn a goal into a prioritized, time-boxed plan." },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const fn = useServerFn(generatePlan);
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!goal.trim()) {
      toast.error("What's the goal?");
      return;
    }
    setLoading(true);
    try {
      const { text } = await fn({ data: { goal, deadline, context } });
      setOutput(text);
    } catch (err) {
      toast.error("Couldn't generate plan. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolShell>
      <PageHeader
        title="AI Task Planner"
        description="Describe a goal; get milestones, a checklist, and a suggested schedule."
        icon={ListChecks}
        accent="peach"
      />

      <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border bg-card p-5 shadow-sm">
        <div className="grid gap-2">
          <Label htmlFor="goal">Goal</Label>
          <Input
            id="goal"
            placeholder="e.g. Launch a new landing page"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="dl">Deadline (optional)</Label>
          <Input
            id="dl"
            placeholder="e.g. In 3 weeks"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="ctx">Context (optional)</Label>
          <Textarea
            id="ctx"
            rows={4}
            placeholder="Team size, constraints, dependencies..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate plan
          </Button>
        </div>
      </form>

      <MarkdownOutput value={output} onChange={setOutput} />
      <ResponsibleAi />
    </ToolShell>
  );
}
