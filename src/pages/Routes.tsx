import { useState } from "react";
import {
  Check,
  GitFork,
  Globe2,
  HeartPulse,
  Plus,
  ShieldAlert,
  X,
} from "lucide-react";
import { useI18n } from "../i18n";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Switch } from "../components/ui/switch";
import { Dialog, DialogContent } from "../components/ui/dialog";

type Provider = {
  name: string;
  role: string;
  url: string;
  models: string;
  priority: number;
  latency: string;
  enabled: boolean;
};
const initialProviders: Provider[] = [
  {
    name: "中转站-主通道",
    role: "Primary",
    url: "https://api.b.ai/v1",
    models: "GPT-5.6 · Claude 4",
    priority: 1,
    latency: "180ms",
    enabled: true,
  },
  {
    name: "备用中转站",
    role: "Fallback",
    url: "https://ai.akile.ai/v1",
    models: "GPT-4o · DeepSeek-V3",
    priority: 2,
    latency: "246ms",
    enabled: true,
  },
  {
    name: "官方直连",
    role: "Emergency",
    url: "https://api.openai.com/v1",
    models: "GPT-4o · o3-mini",
    priority: 3,
    latency: "382ms",
    enabled: false,
  },
];
export default function Routes() {
  const { t } = useI18n();
  const [providers, setProviders] = useState<Provider[]>(initialProviders);
  const [dialog, setDialog] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const toggle = (index: number): void =>
    setProviders((items) =>
      items.map((item, current) =>
        current === index ? { ...item, enabled: !item.enabled } : item,
      ),
    );
  const addProvider = (): void => {
    if (!name.trim() || !url.trim()) return;
    setProviders((items) => [
      ...items,
      {
        name,
        role: "Custom",
        url,
        models: "待配置",
        priority: items.length + 1,
        latency: "—",
        enabled: true,
      },
    ]);
    setName("");
    setUrl("");
    setDialog(false);
  };
  return (
    <main className="w-full min-h-screen space-y-6 bg-background py-6 text-foreground">
      <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("routes.title")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("routes.subtitle")}
          </p>
        </div>
        <Button className="gap-2" onClick={() => setDialog(true)} type="button">
          <Plus size={16} />
          {t("routes.add")}
        </Button>
      </header>
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs text-muted-foreground">LiteLLM STATUS</p>
          <div className="mt-3 flex items-center gap-2 text-lg font-semibold">
            <span className="h-2.5 w-2.5 rounded-full bg-success" />
            {t("common.operational")}
          </div>
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            v1.61.0 · port 4000
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground">
            {t("routes.providers")}
          </p>
          <strong className="mt-2 block font-mono text-3xl">
            {providers.filter((item) => item.enabled).length}
          </strong>
          <p className="mt-2 text-xs text-muted-foreground">
            {t("routes.active")}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground">
            {t("routes.failover")}
          </p>
          <strong className="mt-2 block font-mono text-3xl">99.9%</strong>
          <p className="mt-2 text-xs text-muted-foreground">
            {t("routes.success")}
          </p>
        </Card>
      </section>
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t("routes.providers")}</h2>
          <span className="text-xs text-muted-foreground">UPSTREAM POOL</span>
        </div>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {providers.map((item, index) => (
            <Card
              key={`${item.name}-${index}`}
              className={`p-5 ${!item.enabled ? "opacity-60" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-md border border-border bg-muted">
                    <Globe2 size={17} />
                  </span>
                  <div>
                    <strong className="block text-sm">{item.name}</strong>
                    <span className="text-xs text-muted-foreground">
                      {item.role}
                    </span>
                  </div>
                </div>
                <Switch
                  aria-label={t("routes.toggle")}
                  checked={item.enabled}
                  onClick={() => toggle(index)}
                />
              </div>
              <code className="mt-4 block truncate rounded border border-border bg-muted/40 p-2 text-xs">
                {item.url}
              </code>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground">{t("routes.models")}</p>
                  <p className="mt-1">{item.models}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">
                    {t("routes.priority")}
                  </p>
                  <p className="mt-1 font-mono">P{item.priority}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <HeartPulse size={14} />
                  {item.latency}
                </span>
                <Badge variant="outline" className="gap-1">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${item.enabled ? "bg-success" : "bg-muted-foreground"}`}
                  />
                  {item.enabled ? t("routes.healthy") : t("routes.disabled")}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>
      <Card className="p-5">
        <div className="flex items-center gap-3">
          <ShieldAlert size={18} />
          <div>
            <h2 className="font-semibold">{t("routes.failover")}</h2>
            <p className="text-xs text-muted-foreground">
              主节点连续 3 次失败后自动切换到下一个优先级节点。
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded border border-border px-3 py-2">
            P1 · 中转站-主通道
          </span>
          <GitFork size={14} className="text-muted-foreground" />
          <span className="rounded border border-border px-3 py-2">
            P2 · 备用中转站
          </span>
          <GitFork size={14} className="text-muted-foreground" />
          <span className="rounded border border-border px-3 py-2">
            P3 · 官方直连
          </span>
        </div>
      </Card>
      {
        <Dialog open={dialog} onOpenChange={setDialog}>
          <DialogContent aria-label={t("routes.add")}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t("routes.add")}</h2>
              <Button
                type="button"
                onClick={() => setDialog(false)}
                className="rounded p-2 hover:bg-muted"
              >
                <X size={16} />
              </Button>
            </div>
            <label className="block text-sm">
              名称
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none"
                placeholder="例如：团队中转站"
              />
            </label>
            <label className="mt-4 block text-sm">
              Base URL
              <Input
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm outline-none"
                placeholder="https://api.example.com/v1"
              />
            </label>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                onClick={() => setDialog(false)}
                className="rounded-md border border-border px-4 py-2 text-sm"
              >
                取消
              </Button>
              <Button
                type="button"
                onClick={addProvider}
                className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
              >
                <Check size={15} className="mr-2 inline" />
                {t("routes.add")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      }
    </main>
  );
}
