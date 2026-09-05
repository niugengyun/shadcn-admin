import { Activity, Clock, Database } from "lucide-react";
import { Card } from "../components/ui/card";
import { MetricCard } from "../components/metric-card";
import { PageHeader } from "../components/page-header";

const traces = [
  { id: "req_a91f", model: "GPT-5.6", tokens: "24.8k", latency: "420ms", status: "Success" },
  { id: "req_b72c", model: "Claude Sonnet", tokens: "18.2k", latency: "680ms", status: "Success" },
  { id: "req_c33d", model: "DeepSeek V3", tokens: "12.1k", latency: "900ms", status: "Fallback" },
];

export default function Trace() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Observability" title="Request Trace" subtitle="LLM request lifecycle and token inspection" />
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard icon={Activity} label="Requests" value="12,680" />
        <MetricCard icon={Clock} label="P95 Latency" value="620ms" />
        <MetricCard icon={Database} label="Tokens" value="1.08B" />
      </div>
      <div className="grid gap-4">
        {traces.map((trace) => (
          <Card key={trace.id} className="p-5 grid gap-2 sm:grid-cols-5">
            <span>{trace.id}</span>
            <span>{trace.model}</span>
            <span>{trace.tokens}</span>
            <span>{trace.latency}</span>
            <span>{trace.status}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
