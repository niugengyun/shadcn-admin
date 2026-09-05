import { Activity, Cpu, HeartPulse, Server } from "lucide-react";
import { Card } from "../components/ui/card";
import { MetricCard } from "../components/metric-card";
import { PageHeader } from "../components/page-header";

const providers = [
  { name: "OpenAI", models: 12, latency: "320ms", status: "Healthy" },
  { name: "Anthropic", models: 8, latency: "410ms", status: "Healthy" },
  { name: "DeepSeek", models: 5, latency: "520ms", status: "Degraded" },
];

export default function Providers() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Gateway"
        title="Providers"
        subtitle="Manage upstream LLM providers and health status"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Server} label="Providers" value="3" />
        <MetricCard icon={Cpu} label="Models" value="25" />
        <MetricCard icon={Activity} label="Avg Latency" value="416ms" />
        <MetricCard icon={HeartPulse} label="Availability" value="99.8%" />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {providers.map((provider) => (
          <Card key={provider.name} className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{provider.name}</h2>
              <span className="text-xs text-muted-foreground">{provider.status}</span>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between"><span>Models</span><span>{provider.models}</span></div>
              <div className="flex justify-between"><span>Latency</span><span>{provider.latency}</span></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
