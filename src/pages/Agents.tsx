import { useState } from "react";
import {
  Activity,
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
import { useI18n } from "../i18n";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
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
};
type Instance = {
  id: string;
  kind: string;
  task: string;
  status: "running" | "idle" | "failed";
  usage: string;
};
const agents: Agent[] = [
  {
    name: "Claude Code CLI",
    protocol: "Stdio / PTY",
    icon: Terminal,
    description: "本地终端执行器",
  },
  {
    name: "Codex Terminal Runner",
    protocol: "ACP",
    icon: Code2,
    description: "代码审查与修改",
  },
  {
    name: "Python / Node Sandbox",
    protocol: "WebSocket",
    icon: Cpu,
    description: "隔离脚本运行环境",
  },
  {
    name: "Docker Isolated Agent",
    protocol: "WebSocket",
    icon: HardDrive,
    description: "容器化任务执行",
  },
];
const initialInstances: Instance[] = [
  {
    id: "hns_claude_01",
    kind: "Claude Code",
    task: "Refactoring auth middleware",
    status: "running",
    usage: "18% / 412 MB",
  },
  {
    id: "hns_codex_02",
    kind: "Codex Runner",
    task: "Review pull request #184",
    status: "running",
    usage: "24% / 688 MB",
  },
  {
    id: "hns_sandbox_03",
    kind: "Python Sandbox",
    task: "Idle · awaiting assignment",
    status: "idle",
    usage: "2% / 126 MB",
  },
  {
    id: "hns_docker_04",
    kind: "Docker Agent",
    task: "Dependency audit",
    status: "failed",
    usage: "— / —",
  },
];
export default function Agents() {
  const { t } = useI18n();
  const [instances, setInstances] = useState<Instance[]>(initialInstances);
  const [selected, setSelected] = useState(0);
  const [logs, setLogs] = useState<Instance | null>(null);
  const add = (): void =>
    setInstances((items) => [
      ...items,
      {
        id: `hns_new_${String(items.length + 1).padStart(2, "0")}`,
        kind: "Claude Code",
        task: t("agents.newTask"),
        status: "idle",
        usage: "0% / 0 MB",
      },
    ]);
  const update = (id: string, status: Instance["status"]): void =>
    setInstances((items) =>
      items.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  const statusText = (status: Instance["status"]): string =>
    status === "running"
      ? t("agents.running")
      : status === "idle"
        ? t("agents.idle")
        : t("agents.failed");
  return (
    <main className="w-full min-h-screen space-y-6 bg-background py-6 text-foreground">
      <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("agents.title")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("agents.subtitle")}
          </p>
        </div>
        <Button
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          onClick={add}
          type="button"
        >
          <Plus size={16} />
          {t("agents.mount")}
        </Button>
      </header>
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t("agents.supported")}</h2>
          <span className="text-xs text-muted-foreground">HARNESS RUNTIME</span>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {agents.map(({ name, protocol, icon: Icon, description }, index) => (
            <Card
              key={name}
              role="button"
              tabIndex={0}
              onClick={() => setSelected(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelected(index);
                }
              }}
              className="p-4 text-left transition-colors hover:bg-muted/50"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="grid h-8 w-8 place-items-center rounded-md border border-border bg-muted">
                  <Icon size={16} />
                </span>
                <span
                  className={`h-2 w-2 rounded-full ${selected === index ? "bg-foreground" : "bg-muted-foreground"}`}
                />
              </div>
              <strong className="block text-sm">{name}</strong>
              <span className="mt-1 block text-xs text-muted-foreground">
                {description}
              </span>
              <span className="mt-3 block font-mono text-xs text-muted-foreground">
                {protocol} · {t("agents.ready")}
              </span>
            </Card>
          ))}
        </div>
      </section>
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-8">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h2 className="text-lg font-semibold">
                {t("agents.instances")}{" "}
                <span className="ml-1 rounded-full border border-border px-2 py-0.5 font-mono text-xs">
                  {instances.length}
                </span>
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                PROCESS SUPERVISOR
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-success" />
              {t("agents.live")}
            </span>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border text-left text-xs text-muted-foreground">
                  <TableHead className="p-4">
                    {t("agents.instanceId")}
                  </TableHead>
                  <TableHead>{t("agents.agentType")}</TableHead>
                  <TableHead>{t("agents.currentTask")}</TableHead>
                  <TableHead>{t("agents.status")}</TableHead>
                  <TableHead>{t("agents.resources")}</TableHead>
                  <TableHead className="p-4">{t("agents.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {instances.map((item) => (
                  <TableRow
                    className="border-b border-border last:border-0"
                    key={item.id}
                  >
                    <TableCell className="p-4 font-mono text-xs">
                      {item.id}
                    </TableCell>
                    <TableCell>{item.kind}</TableCell>
                    <TableCell className="max-w-[220px] truncate text-muted-foreground">
                      {item.task}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${item.status === "running" ? "bg-success" : item.status === "idle" ? "bg-warning" : "bg-destructive"}`}
                        />
                        {statusText(item.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {item.usage}
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title={t("agents.viewLogs")}
                          onClick={() => setLogs(item)}
                          type="button"
                        >
                          <Activity size={15} />
                        </Button>
                        {item.status !== "running" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title={t("agents.restart")}
                            onClick={() => update(item.id, "running")}
                            type="button"
                          >
                            <RotateCcw size={15} />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          title={t("agents.stop")}
                          onClick={() =>
                            setInstances((items) =>
                              items.filter((entry) => entry.id !== item.id),
                            )
                          }
                          type="button"
                        >
                          <CircleStop size={15} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
        <Card className="p-5 xl:col-span-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Profile</h2>
              <p className="text-xs text-muted-foreground">只读运行配置</p>
            </div>
            <span className="rounded border border-border px-2 py-1 font-mono text-xs">
              {agents[selected].protocol}
            </span>
          </div>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Harness</dt>
              <dd className="mt-1 font-medium">{agents[selected].name}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Workspace</dt>
              <dd className="mt-1 font-mono text-xs">
                ~/workspace/agent-gateway
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Permissions</dt>
              <dd className="mt-1">Filesystem · Network · Process</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Health</dt>
              <dd className="mt-1 inline-flex items-center gap-1 text-success">
                <Check size={14} />
                {t("common.operational")}
              </dd>
            </div>
          </dl>
        </Card>
      </section>
      {logs && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setLogs(null)}
        >
          <section
            className="absolute right-0 top-0 h-full w-full max-w-xl border-l border-border bg-background p-5 font-mono text-xs text-foreground"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">EXECUTION TRACE</p>
                <h2 className="mt-1 text-sm text-foreground">{logs.id}</h2>
              </div>
              <Button
                type="button"
                onClick={() => setLogs(null)}
                className="rounded p-2 hover:bg-muted"
              >
                <X size={16} />
              </Button>
            </div>
            <div className="space-y-3">
              <p>
                <span className="text-muted-foreground">12:41:02</span>{" "}
                handshake established with {logs.kind}
              </p>
              <p>
                <span className="text-muted-foreground">12:41:04</span> task
                accepted: {logs.task}
              </p>
              <p>
                <span className="text-muted-foreground">12:41:09</span>{" "}
                streaming stdout...
              </p>
              <p className="text-success">
                [ok] trace connected · latency 620ms
              </p>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
