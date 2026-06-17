import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  NotebookPen,
  ListChecks,
  Sparkles,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { ResponsibleAi } from "@/components/responsible-ai";
import { ToolShell } from "@/components/tool-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — ThriveDesk" },
      { name: "description", content: "Your AI workspace: email, meeting notes, planning, research, and chat." },
    ],
  }),
  component: Dashboard,
});

const tiles = [
  {
    title: "Smart Email Generator",
    description: "Draft polished emails in seconds with the right tone.",
    href: "/email",
    icon: Mail,
    bg: "from-pastel-lavender to-pastel-sky",
  },
  {
    title: "Meeting Notes Summarizer",
    description: "Turn transcripts into summaries, decisions, and action items.",
    href: "/notes",
    icon: NotebookPen,
    bg: "from-pastel-mint to-pastel-sky",
  },
  {
    title: "AI Task Planner",
    description: "Break goals into milestones and a time-boxed plan.",
    href: "/planner",
    icon: ListChecks,
    bg: "from-pastel-peach to-pastel-rose",
  },
  {
    title: "AI Research Assistant",
    description: "Get structured briefs on any topic, fast.",
    href: "/research",
    icon: Sparkles,
    bg: "from-pastel-sky to-pastel-lavender",
  },
  {
    title: "AI Chatbot",
    description: "Chat with a friendly AI assistant in real time.",
    href: "/chat",
    icon: MessageSquare,
    bg: "from-pastel-rose to-pastel-peach",
  },
];

function Dashboard() {
  return (
    <ToolShell>
      <section className="rounded-3xl bg-gradient-to-br from-pastel-lavender via-pastel-sky to-pastel-mint p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary/80">
          Welcome back
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          Your calm, capable AI workspace.
        </h1>
        <p className="mt-2 max-w-xl text-sm text-foreground/70 md:text-base">
          Five focused tools to help you write better, plan smarter, and move
          faster — without the noise.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
          <Link
            key={t.href}
            to={t.href}
            className="group rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div
              className={`mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${t.bg} text-primary`}
            >
              <t.icon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold tracking-tight">{t.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
            <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
              Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </section>

      <ResponsibleAi />
    </ToolShell>
  );
}
