import { useState } from "react";
import {
  Activity,
  BarChart3,
  Check,
  CircleStop,
  Code2,
  Cpu,
  HardDrive,
  Plus,
  RotateCcw,
  Terminal,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useI18n } from "../i18n";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Dialog, DialogContent } from "../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

type Agent = {
  name: string;
  protocol: string;
  icon: typeof Terminal;
  description: string;
  sessions: number;
};
type Instance = {
  id: string;
  kind: string;
  task: string;
  status: "running" | "idle" | "failed";
  usage: string;
};

const agents: Agent[] = [
  { name: "Claude Code CLI", protocol: "Stdio / PTY", icon: Terminal, description: "本地终端执行器", sessions: 486 },
  { name: "Codex Terminal Runner", protocol: "ACP", icon: Code2, description: "代码审查与修改", sessions: 392 },
  { name: "Python / Node Sandbox", protocol: "WebSocket", icon: Cpu, description: "隔离脚本运行环境", sessions: 226 },
  { name: "Docker Isolated Agent", protocol: "WebSocket", icon: HardDrive, description: "容器化任务执行", sessions: 165 },
];

const initialInstances: Instance[] = [
  { id: "hns_claude_01", kind: "Claude Code", task: "Refactoring auth middleware", status: "running", usage: "18% / 412 MB" },
  { id: "hns_codex_02", kind: "Codex Runner", task: "Review pull request #184", status: "running", usage: "24% / 688 MB" },
  { id: "hns_sandbox_03", kind: "Python Sandbox", task: "Idle · awaiting assignment", status: "idle", usage: "2% / 126 MB" },
  { id: "hns_docker_04", kind: "Docker Agent", task: "Dependency audit", status: "failed", usage: "— / —" },
];

const activity = [
  { agent: "Codex", task: "Review pull request #184", time: "刚刚", tone: "bg-chart-1" },
  { agent: "Claude Code", task: "Refactoring auth middleware", time: "2 分钟前", tone: "bg-chart-2" },
  { agent: "Python Sandbox", task: "Dependency audit", time: "8 分钟前", tone: "bg-chart-3" },
  { agent: "Docker Agent", task: "Container health check failed", time: "12 分钟前", tone: "bg-destructive" },
];
const distribution = [
  { name: "Claude CLI", sessions: 486 },
  { name: "Codex", sessions: 392 },
  { name: "Sandbox", sessions: 226 },
  { name: "Docker", sessions: 165 },
];
const chartColors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

export default function Agents() {
  const { t } = useI18n();
  const [instances, setInstances] = useState<Instance[]>(initialInstances);
  const [selected, setSelected] = useState(0);
  const [logs, setLogs] = useState<Instance | null>(null);
  const add = (): void => setInstances((items) => [...items, { id: `hns_new_${String(items.length + 1).padStart(2, "0")}`, kind: "Claude Code", task: t("agents.newTask"), status: "idle", usage: "0% / 0 MB" }]);
  const update = (id: string, status: Instance["status"]): void => setInstances((items) => items.map((item) => (item.id === id ? { ...item, status } : item)));
  const statusText = (status: Instance["status"]): string => status === "running" ? t("agents.running") : status === "idle" ? t("agents.idle") : t("agents.failed");
  const runningCount = instances.filter((item) => item.status === "running").length;
  const totalSessions = distribution.reduce((sum, item) => sum + item.sessions, 0);

  return (
    <main className="agents-page min-h-screen w-full space-y-6 bg-background py-6 text-foreground">
      <header className="flex flex-col justify-between gap-4 border-b border-border pb-6 lg:flex-row lg:items-end">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{t("common.controlPlane")}</p>
          <h1 className="text-3xl font-semibold tracking-tight">{t("agents.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("agents.subtitle")}</p>
        </div>
        <Button className="w-full gap-2 sm:w-auto" onClick={add} type="button"><Plus size={16} aria-hidden="true" />{t("agents.mount")}</Button>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="min-w-0 border-l-2 border-l-chart-1 p-5"><p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{t("agents.sessions")}</p><strong className="mt-3 block font-mono text-3xl font-medium tracking-tight">1,269</strong><p className="mt-2 text-xs text-muted-foreground">{t("agents.sessionsHint")}</p></Card>
        <Card className="min-w-0 border-l-2 border-l-chart-2 p-5"><p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{t("agents.tokens")}</p><strong className="mt-3 block font-mono text-3xl font-medium tracking-tight">1.08B</strong><p className="mt-2 text-xs text-muted-foreground">{t("agents.tokensHint")}</p></Card>
        <Card className="min-w-0 border-l-2 border-l-chart-3 p-5"><p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{t("agents.activeAgents")}</p><strong className="mt-3 block font-mono text-3xl font-medium tracking-tight">{runningCount} / {instances.length}</strong><p className="mt-2 text-xs text-muted-foreground">{t("agents.activeHint")}</p></Card>
        <Card className="min-w-0 border-l-2 border-l-chart-4 p-5"><p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{t("agents.estimatedCost")}</p><strong className="mt-3 block font-mono text-3xl font-medium tracking-tight">$4.2k</strong><p className="mt-2 text-xs text-muted-foreground">{t("agents.costHint")}</p></Card>
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><div><h2 className="text-lg font-semibold">{t("agents.supported")}</h2><p className="mt-1 text-xs text-muted-foreground">{t("agents.supportedHint")}</p></div><span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{t("agents.connected")}</span></div>
        <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {agents.map(({ name, protocol, icon: Icon, description, sessions }, index) => <Card key={name} role="button" tabIndex={0} onClick={() => setSelected(index)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelected(index); } }} className={`min-w-0 p-4 text-left transition-colors hover:bg-muted/50 ${selected === index ? "ring-1 ring-ring" : ""}`}><div className="mb-3 flex items-center justify-between gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-border bg-muted"><Icon size={16} aria-hidden="true" /></span><span className="font-mono text-sm font-medium">{sessions}</span></div><strong className="block truncate text-sm">{name}</strong><span className="mt-1 block truncate text-xs text-muted-foreground">{description}</span><span className="mt-3 block truncate font-mono text-xs text-muted-foreground">{protocol} · {t("agents.ready")}</span></Card>)}
        </div>
      </section>

      <section className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="min-w-0 xl:col-span-8"><div className="flex flex-col justify-between gap-3 border-b border-border p-5 sm:flex-row sm:items-center"><div><h2 className="text-lg font-semibold">{t("agents.instances")} <span className="ml-1 rounded-md border border-border px-2 py-0.5 font-mono text-xs">{instances.length}</span></h2><p className="mt-1 text-xs text-muted-foreground">{t("agents.processSupervisor")}</p></div><span className="inline-flex items-center gap-2 text-xs text-muted-foreground"><span className="h-2 w-2 rounded-full bg-success" />{t("agents.live")}</span></div><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>{t("agents.instanceId")}</TableHead><TableHead>{t("agents.agentType")}</TableHead><TableHead>{t("agents.currentTask")}</TableHead><TableHead>{t("agents.status")}</TableHead><TableHead>{t("agents.resources")}</TableHead><TableHead>{t("agents.actions")}</TableHead></TableRow></TableHeader><TableBody>{instances.map((item) => <TableRow key={item.id}><TableCell className="font-mono text-xs">{item.id}</TableCell><TableCell>{item.kind}</TableCell><TableCell className="max-w-[220px] truncate text-muted-foreground">{item.task}</TableCell><TableCell><Badge variant="outline" className="gap-1.5"><span className={`h-1.5 w-1.5 rounded-full ${item.status === "running" ? "bg-success" : item.status === "idle" ? "bg-warning" : "bg-destructive"}`} />{statusText(item.status)}</Badge></TableCell><TableCell className="font-mono text-xs text-muted-foreground">{item.usage}</TableCell><TableCell><div className="flex items-center gap-1"><Button variant="ghost" size="icon" title={t("agents.viewLogs")} aria-label={t("agents.viewLogs")} onClick={() => setLogs(item)} type="button"><Activity size={15} aria-hidden="true" /></Button>{item.status !== "running" && <Button variant="ghost" size="icon" title={t("agents.restart")} aria-label={t("agents.restart")} onClick={() => update(item.id, "running")} type="button"><RotateCcw size={15} aria-hidden="true" /></Button>}<Button variant="ghost" size="icon" title={t("agents.stop")} aria-label={t("agents.stop")} onClick={() => setInstances((items) => items.filter((entry) => entry.id !== item.id))} type="button"><CircleStop size={15} aria-hidden="true" /></Button></div></TableCell></TableRow>)}</TableBody></Table></div></Card>

        <div className="grid min-w-0 gap-4 xl:col-span-4">
          <Card className="min-w-0 p-5"><div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold">{t("agents.distribution")}</h2><p className="mt-1 text-xs text-muted-foreground">{t("agents.distributionHint")}</p></div><BarChart3 size={17} className="text-muted-foreground" aria-hidden="true" /></div><div className="relative mt-3 h-[150px] w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={distribution} layout="vertical" margin={{ top: 0, right: 8, left: 8, bottom: 0 }}><CartesianGrid horizontal={false} stroke="hsl(var(--border) / 0.7)" strokeDasharray="3 3" /><XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} /><YAxis type="category" dataKey="name" width={92} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} /><Tooltip cursor={{ fill: "hsl(var(--muted) / 0.5)" }} contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "var(--radius)", fontSize: 12 }} /><Bar dataKey="sessions" radius={[0, 3, 3, 0]} name={t("agents.sessions")}>{distribution.map((item, index) => <Cell key={item.name} fill={chartColors[index]} />)}</Bar></BarChart></ResponsiveContainer></div><div className="mt-2 border-t border-border pt-3 text-xs text-muted-foreground"><span className="font-mono text-foreground">{totalSessions}</span> {t("agents.sessionsTotal")}</div></Card>
          <Card className="min-w-0 p-5"><div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="font-semibold">{t("agents.profile")}</h2><p className="mt-1 text-xs text-muted-foreground">{t("agents.profileHint")}</p></div><span className="shrink-0 rounded-md border border-border px-2 py-1 font-mono text-xs">{agents[selected].protocol}</span></div><dl className="space-y-3 text-sm"><div><dt className="text-xs text-muted-foreground">{t("agents.harness")}</dt><dd className="mt-1 font-medium">{agents[selected].name}</dd></div><div><dt className="text-xs text-muted-foreground">{t("agents.workspace")}</dt><dd className="mt-1 truncate font-mono text-xs">~/workspace/agent-gateway</dd></div><div><dt className="text-xs text-muted-foreground">{t("agents.permissions")}</dt><dd className="mt-1">{t("agents.permissionsValue")}</dd></div><div><dt className="text-xs text-muted-foreground">{t("agents.health")}</dt><dd className="mt-1 inline-flex items-center gap-1 text-success"><Check size={14} aria-hidden="true" />{t("common.operational")}</dd></div></dl></Card>
        </div>
      </section>

      <Card className="min-w-0 p-5"><div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold">{t("agents.recentActivity")}</h2><p className="mt-1 text-xs text-muted-foreground">{t("agents.recentActivityHint")}</p></div><span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"><span className="h-1.5 w-1.5 rounded-full bg-success" />{t("agents.autoSync")}</span></div><div className="mt-4 divide-y divide-border border-y border-border">{activity.map((item) => <div key={`${item.agent}-${item.time}`} className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-3 text-sm"><span className="inline-flex items-center gap-2 font-medium"><span className={`h-2 w-2 rounded-full ${item.tone}`} />{item.agent}</span><span className="truncate text-muted-foreground">{item.task}</span><span className="font-mono text-xs text-muted-foreground">{item.time}</span></div>)}</div></Card>

      <Dialog open={Boolean(logs)} onOpenChange={(open) => !open && setLogs(null)}><DialogContent aria-label={t("agents.viewLogs")} className="max-w-xl">{logs && <><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{t("agents.executionTrace")}</p><h2 className="mt-1 font-mono text-sm">{logs.id}</h2></div><Button variant="ghost" size="icon" aria-label={t("agents.closeLogs")} title={t("agents.closeLogs")} onClick={() => setLogs(null)} type="button"><X size={16} aria-hidden="true" /></Button></div><div className="space-y-3 border-t border-border pt-4 font-mono text-xs"><p><span className="text-muted-foreground">12:41:02</span> handshake established with {logs.kind}</p><p><span className="text-muted-foreground">12:41:04</span> task accepted: {logs.task}</p><p><span className="text-muted-foreground">12:41:09</span> streaming stdout...</p><p className="text-success">[ok] trace connected · latency 620ms</p></div></>}</DialogContent></Dialog>
    </main>
  );
}
