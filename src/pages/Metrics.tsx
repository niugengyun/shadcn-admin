import { useMemo, useState } from "react";
import {
  Activity,
  Coins,
  Gauge,
  RefreshCw,
  Search,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useI18n } from "../i18n";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { MetricCard } from "../components/metric-card";
import { PageHeader } from "../components/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

type TraceStatus = "success" | "failed" | "queued";
type Trace = {
  id: string;
  agentKey: string;
  nodeKey: string;
  model: string;
  tokens: string;
  latency: string;
  status: TraceStatus;
  timeKey: string;
};
const trend = [
  { time: "00:00", prompt: 320, completion: 180 },
  { time: "04:00", prompt: 280, completion: 155 },
  { time: "08:00", prompt: 760, completion: 390 },
  { time: "12:00", prompt: 920, completion: 470 },
  { time: "16:00", prompt: 1080, completion: 550 },
  { time: "20:00", prompt: 1260, completion: 680 },
];
const trendByRange = {
  "1h": [
    { time: "00:00", prompt: 280, completion: 140 },
    { time: "00:10", prompt: 420, completion: 210 },
    { time: "00:20", prompt: 360, completion: 190 },
    { time: "00:30", prompt: 620, completion: 310 },
    { time: "00:40", prompt: 760, completion: 390 },
    { time: "00:50", prompt: 920, completion: 470 },
  ],
  "24h": trend,
  "7d": [
    { time: "Mon", prompt: 720, completion: 360 },
    { time: "Tue", prompt: 880, completion: 430 },
    { time: "Wed", prompt: 640, completion: 320 },
    { time: "Thu", prompt: 980, completion: 510 },
    { time: "Fri", prompt: 1260, completion: 680 },
    { time: "Sat", prompt: 1120, completion: 590 },
    { time: "Sun", prompt: 1380, completion: 740 },
  ],
  "30d": [
    { time: "Week 1", prompt: 960, completion: 460 },
    { time: "Week 2", prompt: 1120, completion: 560 },
    { time: "Week 3", prompt: 1040, completion: 520 },
    { time: "Week 4", prompt: 1420, completion: 760 },
  ],
} as const;
type MetricRange = keyof typeof trendByRange;
const distribution = [
  { name: "Claude 3.5", value: 42 },
  { name: "GPT-4o", value: 31 },
  { name: "DeepSeek-V3", value: 18 },
  { name: "Qwen-Max", value: 9 },
];
const colors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];
const traces: Trace[] = [
  {
    id: "tr_8f2a91c",
    agentKey: "metrics.codeReviewer",
    nodeKey: "metrics.primaryRelay",
    model: "Claude 3.5",
    tokens: "56.6k",
    latency: "620ms",
    status: "success",
    timeKey: "common.justNow",
  },
  {
    id: "tr_31c07bd",
    agentKey: "metrics.developer",
    nodeKey: "metrics.fallbackRelay",
    model: "GPT-4o",
    tokens: "38.9k",
    latency: "488ms",
    status: "success",
    timeKey: "common.minutesAgo2",
  },
  {
    id: "tr_4a0e112",
    agentKey: "metrics.codeReviewer",
    nodeKey: "metrics.primaryRelay",
    model: "DeepSeek-V3",
    tokens: "33.5k",
    latency: "1.24s",
    status: "queued",
    timeKey: "common.minutesAgo8",
  },
  {
    id: "tr_9dd81ea",
    agentKey: "metrics.developer",
    nodeKey: "metrics.directProvider",
    model: "Claude 3.5",
    tokens: "74.0k",
    latency: "2.05s",
    status: "failed",
    timeKey: "common.minutesAgo12",
  },
  {
    id: "tr_6bc30fa",
    agentKey: "metrics.researcher",
    nodeKey: "metrics.primaryRelay",
    model: "GPT-4o",
    tokens: "21.8k",
    latency: "712ms",
    status: "success",
    timeKey: "common.minutesAgo18",
  },
];
export default function Metrics() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [range, setRange] = useState<MetricRange>("24h");
  const activeTrend = trendByRange[range];
  const filtered = useMemo(
    () =>
      traces.filter((trace) =>
        `${trace.id} ${t(trace.agentKey)} ${trace.model} ${t(trace.nodeKey)}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query, t],
  );
  const refresh = (): void => {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 700);
  };
  const statusLabel = (status: TraceStatus): string =>
    status === "success"
      ? t("metrics.success")
      : status === "failed"
        ? t("metrics.failed")
        : t("metrics.queued");
  return (
    <div className="metrics-page w-full space-y-6 text-foreground">
      <PageHeader
        eyebrow={t("common.controlPlane")}
        title={t("metrics.title")}
        subtitle={t("metrics.subtitle")}
        action={<div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <div className="flex items-center rounded-md border border-border bg-muted p-1">
            {(
              [
                ["1h", t("metrics.range1h")],
                ["24h", t("metrics.range24h")],
                ["7d", t("metrics.range7d")],
                ["30d", t("metrics.range30d")],
              ] as const
            ).map(([value, label]) => (
              <Button
                key={value}
                type="button"
                size="sm"
                variant={range === value ? "default" : "ghost"}
                onClick={() => setRange(value)}
                aria-pressed={range === value}
              >
                {label}
              </Button>
            ))}
          </div>
          <Button
            type="button"
            onClick={refresh}
            aria-label={t("metrics.refresh")}
            title={t("metrics.refresh")}
            variant="outline"
            size="icon"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          </Button>
        </div>}
      />
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={TrendingUp}
          label={t("metrics.totalTokens")}
          value="1.08B"
          detail={t("metrics.vsPrevious")}
          change="12.4%"
        />
        <MetricCard
          icon={Activity}
          label={t("metrics.sessions")}
          value="1,269"
          detail={t("metrics.activePeriod")}
          change="24h"
        />
        <MetricCard
          icon={Coins}
          label={t("metrics.estimatedCost")}
          value="$4.2k"
          detail={t("metrics.modelPricing")}
          change="3.1%"
          down
        />
        <MetricCard
          icon={Gauge}
          label={t("metrics.p95Health")}
          value="480ms"
          detail={t("metrics.successRate")}
          change="99.9%"
        />
      </section>
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="min-w-0 p-5 xl:col-span-8">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-semibold">{t("metrics.tokenTrend")}</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("metrics.prompt")} / {t("metrics.completion")} ·{" "}
                {range === "1h"
                  ? t("metrics.range1h")
                  : range === "24h"
                    ? t("metrics.range24h")
                    : range === "7d"
                      ? t("metrics.range7d")
                      : t("metrics.range30d")}
              </p>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-chart-1" />
                {t("metrics.prompt")}
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-chart-2" />
                {t("metrics.completion")}
              </span>
            </div>
          </div>
          <div className="h-[290px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={activeTrend}
                margin={{ top: 6, right: 4, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="hsl(var(--border) / 0.7)"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="prompt"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1) / 0.12)"
                  strokeWidth={2}
                  name={t("metrics.prompt")}
                />
                <Area
                  type="monotone"
                  dataKey="completion"
                  stroke="hsl(var(--chart-2))"
                  fill="hsl(var(--chart-2) / 0.1)"
                  strokeWidth={2}
                  name={t("metrics.completion")}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="min-w-0 p-5 xl:col-span-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold">{t("metrics.modelDistribution")}</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("metrics.totalShare")}
              </p>
            </div>
            <span className="font-mono text-xs text-muted-foreground">100%</span>
          </div>
          <div className="relative h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  stroke="hsl(var(--card))"
                  strokeWidth={2}
                >
                  {distribution.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
              <div>
                <div className="font-mono text-2xl font-bold">1.08B</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {t("metrics.totalTokens")}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2 xl:grid-cols-1">
            {distribution.map((entry, index) => (
              <div key={entry.name} className="flex min-w-0 items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: colors[index] }}
                />
                <span className="truncate text-muted-foreground">{entry.name}</span>
                <span className="ml-auto font-mono">{entry.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </section>
      <Card className="min-w-0">
        <div className="flex flex-col justify-between gap-4 border-b border-border p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold">{t("metrics.recentTraces")}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("metrics.traceSubtitle")}
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search
              size={14}
              className="absolute left-3 top-3 text-muted-foreground"
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label={t("metrics.filter")}
              placeholder={t("metrics.filter")}
              className="pl-8"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table className="min-w-[920px] whitespace-nowrap">
            <TableHeader>
              <TableRow>
                <TableHead>{t("metrics.traceId")}</TableHead>
                <TableHead>{t("metrics.agent")}</TableHead>
                <TableHead>{t("metrics.node")}</TableHead>
                <TableHead>{t("metrics.model")}</TableHead>
                <TableHead>{t("metrics.inputOutput")}</TableHead>
                <TableHead>{t("metrics.latency")}</TableHead>
                <TableHead>{t("metrics.status")}</TableHead>
                <TableHead>{t("metrics.time")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((trace) => (
                <TableRow key={trace.id}>
                  <TableCell className="font-mono text-xs">
                    {trace.id}
                  </TableCell>
                  <TableCell>{t(trace.agentKey)}</TableCell>
                  <TableCell>{t(trace.nodeKey)}</TableCell>
                  <TableCell>{trace.model}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {trace.tokens}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {trace.latency}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1.5">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${trace.status === "success" ? "bg-success" : trace.status === "failed" ? "bg-destructive" : "bg-warning"}`}
                      />
                      {statusLabel(trace.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {t(trace.timeKey)}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-28 text-center">
                    <div className="flex flex-col items-center justify-center gap-2" role="status" aria-live="polite">
                      <span className="text-sm text-muted-foreground">{t("metrics.noResults")}</span>
                      {query && (
                        <Button type="button" variant="link" size="sm" onClick={() => setQuery("")}>
                          {t("metrics.clearFilter")}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
