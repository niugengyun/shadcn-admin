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
import { Dialog, DialogContent } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Switch } from "../components/ui/switch";

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
  const copy = {
    active: t("routes.active"),
    success: t("routes.success"),
    healthy: t("routes.healthy"),
    disabled: t("routes.disabled"),
    failoverHint: t("routes.failoverHint"),
    providerName: t("routes.providerName"),
    endpoint: t("routes.endpoint"),
    cancel: t("routes.cancel"),
    close: t("routes.close"),
    namePlaceholder: t("routes.namePlaceholder"),
    urlPlaceholder: t("routes.urlPlaceholder"),
    pendingModels: t("routes.pendingModels"),
    customRole: t("routes.customRole"),
  };

  const setProviderEnabled = (index: number, enabled: boolean): void => {
    setProviders((items) =>
      items.map((item, current) =>
        current === index ? { ...item, enabled } : item,
      ),
    );
  };

  const addProvider = (): void => {
    if (!name.trim() || !url.trim()) return;
    setProviders((items) => [
      ...items,
      {
        name: name.trim(),
        role: copy.customRole,
        url: url.trim(),
        models: copy.pendingModels,
        priority: items.length + 1,
        latency: "—",
        enabled: true,
      },
    ]);
    setName("");
    setUrl("");
    setDialog(false);
  };

  const activeProviders = providers.filter((item) => item.enabled).length;

  return (
    <main className="routes-page w-full min-w-0 space-y-6 text-foreground">
      <header className="flex flex-col justify-between gap-4 border-b border-border pb-6 lg:flex-row lg:items-end">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {t("common.controlPlane")}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {t("routes.title")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("routes.subtitle")}
          </p>
        </div>
        <Button
          className="w-full shrink-0 gap-2 sm:w-auto"
          onClick={() => setDialog(true)}
          type="button"
        >
          <Plus size={16} aria-hidden="true" />
          {t("routes.add")}
        </Button>
      </header>

      <section
        aria-label={t("routes.title")}
        className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-3"
      >
        <Card className="min-w-0 p-5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            LiteLLM STATUS
          </p>
          <div className="mt-4 flex items-center gap-2 text-lg font-semibold">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-success" />
            {t("common.operational")}
          </div>
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            v1.61.0 · port 4000
          </p>
        </Card>

        <Card className="min-w-0 p-5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {t("routes.providers")}
          </p>
          <strong className="mt-3 block font-mono text-3xl font-medium tracking-tight">
            {activeProviders}
          </strong>
          <p className="mt-2 text-xs text-muted-foreground">
            {copy.active}
          </p>
        </Card>

        <Card className="min-w-0 p-5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {t("routes.failover")}
          </p>
          <strong className="mt-3 block font-mono text-3xl font-medium tracking-tight">
            99.9%
          </strong>
          <p className="mt-2 text-xs text-muted-foreground">
            {copy.success}
          </p>
        </Card>
      </section>

      <section className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">{t("routes.providers")}</h2>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {t("routes.upstreamPool")}
          </span>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-3">
          {providers.map((item, index) => (
            <Card
              key={`${item.name}-${index}`}
              className={`flex min-w-0 flex-col p-5 transition-opacity ${
                item.enabled ? "" : "opacity-60"
              }`}
            >
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border bg-muted text-foreground">
                    <Globe2 size={17} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <strong className="block truncate text-sm font-semibold">
                      {item.name}
                    </strong>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {item.role}
                    </span>
                  </div>
                </div>
                <Switch
                  aria-label={`${t("routes.toggle")}: ${item.name}`}
                  checked={item.enabled}
                  onCheckedChange={(checked) =>
                    setProviderEnabled(index, checked)
                  }
                />
              </div>

              <code className="mt-5 block min-w-0 truncate rounded-md border border-border bg-muted/40 px-2.5 py-2 font-mono text-xs text-foreground">
                {item.url}
              </code>

              <div className="mt-5 grid min-w-0 grid-cols-2 gap-4 text-xs">
                <div className="min-w-0">
                  <p className="text-muted-foreground">{t("routes.models")}</p>
                  <p className="mt-1 truncate text-foreground">{item.models}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">
                    {t("routes.priority")}
                  </p>
                  <p className="mt-1 font-mono text-foreground">
                    P{item.priority}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 font-mono">
                  <HeartPulse size={14} aria-hidden="true" />
                  {item.latency}
                </span>
                <Badge
                  variant="outline"
                  className="shrink-0 gap-1.5 font-normal"
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      item.enabled ? "bg-success" : "bg-muted-foreground"
                    }`}
                  />
                  {item.enabled ? copy.healthy : copy.disabled}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Card className="min-w-0 p-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border bg-muted">
            <ShieldAlert size={18} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="font-semibold">{t("routes.failover")}</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {copy.failoverHint}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
          {providers.map((item, index) => (
            <div
              className="flex items-center gap-2"
              key={`failover-${item.name}-${index}`}
            >
              <span className="inline-flex max-w-full items-center rounded-md border border-border bg-background px-3 py-2 font-medium">
                <span className="mr-2 font-mono text-muted-foreground">
                  P{item.priority}
                </span>
                <span className="truncate">{item.name}</span>
              </span>
              {index < providers.length - 1 && (
                <GitFork
                  size={14}
                  className="shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
      </Card>

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent aria-label={t("routes.add")} className="max-w-md">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">{t("routes.add")}</h2>
            <Button
              aria-label={copy.close}
              className="shrink-0"
              onClick={() => setDialog(false)}
              size="icon"
              title={copy.close}
              type="button"
              variant="ghost"
            >
              <X size={16} aria-hidden="true" />
            </Button>
          </div>

          <label className="block text-sm">
            {copy.providerName}
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2"
              placeholder={copy.namePlaceholder}
            />
          </label>

          <label className="block text-sm">
            {copy.endpoint}
            <Input
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              className="mt-2 font-mono"
              placeholder={copy.urlPlaceholder}
            />
          </label>

          <div className="flex justify-end gap-2">
            <Button
              onClick={() => setDialog(false)}
              type="button"
              variant="outline"
            >
              {copy.cancel}
            </Button>
            <Button onClick={addProvider} type="button">
              <Check size={15} aria-hidden="true" />
              {t("routes.add")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
