import { Brain, Cpu, Zap } from "lucide-react";
import { Card } from "../components/ui/card";
import { MetricCard } from "../components/metric-card";
import { PageHeader } from "../components/page-header";

const models = [
  { name: "GPT-5.6", provider: "OpenAI", context: "400k", latency: "420ms", usage: "42%" },
  { name: "Claude Sonnet", provider: "Anthropic", context: "200k", latency: "510ms", usage: "31%" },
  { name: "DeepSeek V3", provider: "DeepSeek", context: "128k", latency: "360ms", usage: "18%" },
];

export default function Models() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Gateway" title="Models" subtitle="LLM model catalog and routing analytics" />
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard icon={Brain} label="Available Models" value="24" />
        <MetricCard icon={Cpu} label="Providers" value="8" />
        <MetricCard icon={Zap} label="Average Latency" value="430ms" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {models.map((model) => (
          <Card key={model.name} className="p-5 space-y-3">
            <div className="flex justify-between"><b>{model.name}</b><span className="text-xs text-muted-foreground">{model.provider}</span></div>
            <div className="text-sm text-muted-foreground">Context: {model.context}</div>
            <div className="text-sm text-muted-foreground">Latency: {model.latency}</div>
            <div className="text-sm">Traffic Share {model.usage}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
