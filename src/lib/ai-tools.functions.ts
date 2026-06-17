import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "google/gemini-3-flash-preview";

async function runPrompt(system: string, prompt: string) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const gateway = createLovableAiGatewayProvider(key);
  const { text } = await generateText({
    model: gateway(MODEL),
    system,
    prompt,
  });
  return { text };
}

const EmailInput = z.object({
  recipient: z.string().min(1),
  purpose: z.string().min(1),
  tone: z.string().min(1),
  keyPoints: z.string().optional().default(""),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => EmailInput.parse(d))
  .handler(async ({ data }) => {
    const system =
      "You are a professional email writer. Produce a polished, ready-to-send email in Markdown. Include a subject line as a heading and a clear body. Keep it concise and on-brand.";
    const prompt = `Recipient: ${data.recipient}\nPurpose: ${data.purpose}\nTone: ${data.tone}\nKey points: ${data.keyPoints || "(none)"}\n\nWrite the email now.`;
    return runPrompt(system, prompt);
  });

const NotesInput = z.object({
  transcript: z.string().min(1),
});

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => NotesInput.parse(d))
  .handler(async ({ data }) => {
    const system =
      "You summarize meeting notes. Output Markdown with sections: ## Summary, ## Key Decisions, ## Action Items (with owners if mentioned), ## Risks / Open Questions. Be concise and faithful to the transcript.";
    return runPrompt(system, data.transcript);
  });

const PlannerInput = z.object({
  goal: z.string().min(1),
  deadline: z.string().optional().default(""),
  context: z.string().optional().default(""),
});

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => PlannerInput.parse(d))
  .handler(async ({ data }) => {
    const system =
      "You are an AI task planner. Break the goal into a prioritized, time-boxed plan in Markdown. Use sections: ## Overview, ## Milestones, ## Task Breakdown (as a checklist with - [ ]), ## Suggested Schedule, ## Risks.";
    const prompt = `Goal: ${data.goal}\nDeadline: ${data.deadline || "flexible"}\nContext: ${data.context || "(none)"}`;
    return runPrompt(system, prompt);
  });

const ResearchInput = z.object({
  topic: z.string().min(1),
  depth: z.string().optional().default("overview"),
});

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ResearchInput.parse(d))
  .handler(async ({ data }) => {
    const system =
      "You are an AI research assistant. Produce a structured Markdown brief: ## TL;DR, ## Background, ## Key Concepts, ## Notable Perspectives, ## Open Questions, ## Suggested Further Reading. Acknowledge uncertainty; do not fabricate citations.";
    const prompt = `Topic: ${data.topic}\nDepth: ${data.depth}`;
    return runPrompt(system, prompt);
  });
