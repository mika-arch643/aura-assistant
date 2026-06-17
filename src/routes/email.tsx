import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Loader2, Wand2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { PageHeader, ToolShell } from "@/components/tool-shell";
import { ResponsibleAi } from "@/components/responsible-ai";
import { MarkdownOutput } from "@/components/markdown-output";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateEmail } from "@/lib/ai-tools.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — ThriveDesk" },
      { name: "description", content: "Generate polished emails with the right tone in seconds." },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const fn = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState("Professional");
  const [keyPoints, setKeyPoints] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!recipient || !purpose) {
      toast.error("Recipient and purpose are required");
      return;
    }
    setLoading(true);
    try {
      const { text } = await fn({ data: { recipient, purpose, tone, keyPoints } });
      setOutput(text);
    } catch (err) {
      toast.error("Couldn't generate email. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolShell>
      <PageHeader
        title="Smart Email Generator"
        description="Describe what you need; we'll draft an email you can edit and send."
        icon={Mail}
        accent="lavender"
      />

      <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border bg-card p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              placeholder="e.g. Hiring manager at Acme"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tone">Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger id="tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Professional", "Friendly", "Persuasive", "Apologetic", "Concise", "Warm"].map(
                  (t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="purpose">Purpose</Label>
          <Input
            id="purpose"
            placeholder="e.g. Follow up after a product demo"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="kp">Key points (optional)</Label>
          <Textarea
            id="kp"
            placeholder="Bullet points or context to include..."
            rows={4}
            value={keyPoints}
            onChange={(e) => setKeyPoints(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate email
          </Button>
        </div>
      </form>

      <MarkdownOutput value={output} onChange={setOutput} />
      <ResponsibleAi />
    </ToolShell>
  );
}
