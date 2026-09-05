import { useMemo, useState } from "react";
import { Activity, CircleAlert, Clock3, Filter, Radio, Server } from "lucide-react";
import { MetricCard } from "../components/metric-card";
import { PageHeader } from "../components/page-header";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useI18n } from "../i18n";

const events = [
  { id: "req_8f31", model: "gpt-5.4", route: "Primary Relay", status: 200, latency: 184, tokens: "12.4K", time: "09:42:18" },
  { id: "req_8f30", model: "claude-sonnet-4-5", route: "Fallback Relay", status: 200, latency: 263, tokens: "8.7K", time: "09:41:52" },
  { id: "req_8f29", model: "deepseek-v3", route: "Primary Relay", status: 429, latency: 91, tokens: "—", time: "09:40:33" },
  { id: "req_8f28", model: "qwen-max", route: "Primary Relay", status: 200, latency: 326, tokens: "6.2K", time: "09:39:47" },
  { id: "req_8f27", model: "gpt-5.4", route: "Direct Provider", status: 200, latency: 205, tokens: "18.1K", time: "09:38:11" },
];

export default function Logs() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => events.filter((event) => `${event.id} ${event.model} ${event.route}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <div className="space-y-6">
      <PageHeader eyebrow={t("common.controlPlane")} title={t("logs.title")} subtitle={t("logs.subtitle")} action={<Button variant="outline" type="button"><Radio size={15} />{t("logs.live")}</Button>} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard icon={Activity} label={t("logs.throughput")} value="18.6/s" change="12%" detail={t("logs.now")} /><MetricCard icon={Clock3} label={t("logs.avgLatency")} value="214ms" detail="P95 628ms" /><MetricCard icon={CircleAlert} label={t("logs.errors")} value="0.8%" detail="18 / 2,245" down /><MetricCard icon={Server} label={t("logs.activeRoutes")} value="3" detail={t("logs.routeHint")} /></div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="min-w-0 p-5 xl:col-span-8"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="font-semibold">{t("logs.stream")}</h2><p className="mt-1 text-xs text-muted-foreground">{t("logs.streamHint")}</p></div><div className="relative min-w-0 sm:w-64"><Filter size={14} className="pointer-events-none absolute left-3 top-2.5 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder={t("logs.filter")} aria-label={t("logs.filter")} /></div></div><div className="mt-4 space-y-2">{filtered.map((event) => <div key={event.id} className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-background p-3"><span className={`h-2 w-2 rounded-full ${event.status === 200 ? "bg-success" : "bg-warning"}`} /><div className="min-w-0"><div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1"><code className="text-xs">{event.id}</code><strong className="truncate text-sm">{event.model}</strong><span className="truncate text-xs text-muted-foreground">{event.route}</span></div><div className="mt-1 flex gap-3 font-mono text-[11px] text-muted-foreground"><span>{event.time}</span><span>{event.latency}ms</span><span>{event.tokens}</span></div></div><Badge variant={event.status === 200 ? "outline" : "secondary"}>{event.status}</Badge></div>)}{filtered.length === 0 && <div className="py-12 text-center text-sm text-muted-foreground">{t("logs.empty")}</div>}</div></Card>
        <Card className="min-w-0 p-5 xl:col-span-4"><h2 className="font-semibold">{t("logs.routeLoad")}</h2><p className="mt-1 text-xs text-muted-foreground">{t("logs.routeLoadHint")}</p><div className="mt-5 space-y-5">{[{ name: "Primary Relay", value: 72, detail: "1,620 req" }, { name: "Fallback Relay", value: 21, detail: "471 req" }, { name: "Direct Provider", value: 7, detail: "154 req" }].map((route, index) => <div key={route.name}><div className="mb-2 flex justify-between gap-3 text-xs"><strong>{route.name}</strong><span className="font-mono text-muted-foreground">{route.detail}</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${index === 0 ? "bg-chart-1" : index === 1 ? "bg-chart-2" : "bg-chart-3"}`} style={{ width: `${route.value}%` }} /></div></div>)}</div><div className="mt-6 rounded-lg border border-border bg-muted/40 p-4"><div className="flex items-center gap-2 text-sm font-medium"><span className="h-2 w-2 rounded-full bg-success" />{t("logs.streamHealthy")}</div><p className="mt-2 text-xs leading-5 text-muted-foreground">{t("logs.streamHealthyHint")}</p></div></Card>
      </div>
    </div>
  );
}
