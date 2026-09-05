import type { ComponentType } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "./ui/card";

type MetricCardProps = {
  icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  detail?: string;
  change?: string;
  down?: boolean;
  link?: string;
  onClick?: () => void;
};

export function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
  change,
  down = false,
  link,
  onClick,
}: MetricCardProps) {
  const cardProps = onClick
    ? { as: "button" as const, type: "button" as const, onClick }
    : {};

  return (
    <Card
      {...cardProps}
      className={`min-w-0 p-5 ${onClick ? "w-full cursor-pointer text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" : ""}`}
    >
      <div className="flex min-w-0 items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-border bg-muted text-foreground">
          <Icon size={15} />
        </span>
        <span className="min-w-0 leading-4">{label}</span>
        {onClick && <ArrowUpRight size={15} className="ml-auto shrink-0" />}
      </div>
      <div className="mt-4 font-mono text-3xl font-bold tracking-tight sm:text-[2rem]">
        {value}
      </div>
      {(change || detail) && (
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          {change && (
            <span
              className={`inline-flex items-center gap-0.5 font-medium ${down ? "text-destructive" : "text-success"}`}
            >
              {down ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}
              {change}
            </span>
          )}
          {detail}
        </div>
      )}
      {link && (
        <div className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground">
          {link}
          <ArrowUpRight size={14} />
        </div>
      )}
    </Card>
  );
}
