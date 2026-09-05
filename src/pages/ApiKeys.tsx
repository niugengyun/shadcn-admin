import { useState } from "react";
import { Activity, Copy, KeyRound, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { MetricCard } from "../components/metric-card";
import { PageHeader } from "../components/page-header";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useI18n } from "../i18n";

const initialKeys = [
  { id: "production", name: "Production Gateway", prefix: "agw_prod_••••8N2K", scope: "All models", requests: "18.2K", last: "2 min" },
  { id: "development", name: "Development", prefix: "agw_dev_••••4P7M", scope: "GPT · Claude", requests: "4.8K", last: "18 min" },
  { id: "analytics", name: "Analytics Worker", prefix: "agw_ro_••••9Q1X", scope: "Read only", requests: "1.3K", last: "3 h" },
];

export default function ApiKeys() {
  const { t } = useI18n();
  const [keys, setKeys] = useState(initialKeys);
  const addKey = () => setKeys((current) => [...current, { id: `key-${Date.now()}`, name: t("keys.newKey"), prefix: "agw_new_••••K8D3", scope: t("keys.standardScope"), requests: "0", last: t("keys.never") }]);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={t("common.controlPlane")} title={t("keys.title")} subtitle={t("keys.subtitle")} action={<Button type="button" onClick={addKey}><Plus size={16} />{t("keys.create")}</Button>} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={KeyRound} label={t("keys.activeKeys")} value={String(keys.length)} detail={t("keys.activeHint")} />
        <MetricCard icon={Activity} label={t("keys.requests")} value="24.3K" change="8.6%" detail={t("keys.period")} />
        <MetricCard icon={ShieldCheck} label={t("keys.blocked")} value="186" detail={t("keys.blockedHint")} />
        <MetricCard icon={KeyRound} label={t("keys.expiring")} value="1" detail={t("keys.expiringHint")} down />
      </div>
      <section>
        <div className="mb-4"><h2 className="font-semibold">{t("keys.inventory")}</h2><p className="mt-1 text-xs text-muted-foreground">{t("keys.inventoryHint")}</p></div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {keys.map((key) => (
            <Card key={key.id} className="min-w-0 p-5">
              <div className="flex items-start justify-between gap-3"><span className="grid h-9 w-9 place-items-center rounded-md border border-border bg-muted"><KeyRound size={17} /></span><Badge variant="outline">{t("keys.active")}</Badge></div>
              <h3 className="mt-5 font-semibold">{key.name}</h3>
              <code className="mt-2 block truncate text-xs text-muted-foreground">{key.prefix}</code>
              <div className="mt-5 grid grid-cols-3 gap-3 text-xs"><div><span className="text-muted-foreground">{t("keys.scope")}</span><strong className="mt-1 block truncate">{key.scope}</strong></div><div><span className="text-muted-foreground">{t("keys.usage")}</span><strong className="mt-1 block font-mono">{key.requests}</strong></div><div><span className="text-muted-foreground">{t("keys.lastUsed")}</span><strong className="mt-1 block font-mono">{key.last}</strong></div></div>
              <div className="mt-5 flex gap-2 border-t border-border pt-4"><Button variant="outline" size="sm" type="button"><Copy size={14} />{t("keys.copy")}</Button><Button variant="ghost" size="icon" className="ml-auto" type="button" onClick={() => setKeys((current) => current.filter((item) => item.id !== key.id))} aria-label={t("keys.revoke")} title={t("keys.revoke")}><Trash2 size={15} /></Button></div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
