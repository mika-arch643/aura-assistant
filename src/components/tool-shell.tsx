import { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  icon: Icon,
  accent = "lavender",
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: "lavender" | "mint" | "peach" | "sky" | "rose";
}) {
  const bg: Record<string, string> = {
    lavender: "from-pastel-lavender to-pastel-sky",
    mint: "from-pastel-mint to-pastel-sky",
    peach: "from-pastel-peach to-pastel-rose",
    sky: "from-pastel-sky to-pastel-mint",
    rose: "from-pastel-rose to-pastel-lavender",
  };
  return (
    <header className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
      <div
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${bg[accent]} text-primary shadow-sm`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-bold tracking-tight">{title}</h1>
        <p className="truncate text-sm text-muted-foreground">{description}</p>
      </div>
    </header>
  );
}

export function ToolShell({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-5xl space-y-6 p-6">{children}</div>;
}
