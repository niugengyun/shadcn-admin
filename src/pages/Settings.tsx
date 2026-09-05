import { useState } from "react";
import { Database, Globe2, Save, Shield, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "../components/page-header";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Switch } from "../components/ui/switch";
import { useI18n } from "../i18n";

export default function Settings() {
  const { t } = useI18n();
  const [saved, setSaved] = useState(false);
  const [audit, setAudit] = useState(true);
  const [failover, setFailover] = useState(true);
  const save = () => { setSaved(true); window.setTimeout(() => setSaved(false), 1200); };
  return (
    <div className="space-y-6">
      <PageHeader eyebrow={t("common.controlPlane")} title={t("settings.title")} subtitle={t("settings.subtitle")} action={<Button type="button" onClick={save}><Save size={16} />{saved ? t("settings.saved") : t("settings.save")}</Button>} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="min-w-0 p-5"><div className="flex gap-3"><span className="overview-chart-icon"><Globe2 size={17} /></span><div><h2 className="font-semibold">{t("settings.gateway")}</h2><p className="mt-1 text-xs text-muted-foreground">{t("settings.gatewayHint")}</p></div></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium"><span>{t("settings.publicUrl")}</span><Input className="mt-2" defaultValue="http://127.0.0.1:8080/v1" /></label><label className="text-sm font-medium"><span>{t("settings.requestTimeout")}</span><Input className="mt-2" defaultValue="30s" /></label><label className="text-sm font-medium sm:col-span-2"><span>{t("settings.defaultModel")}</span><Input className="mt-2" defaultValue="gpt-5.4" /></label></div></Card>
        <Card className="min-w-0 p-5"><div className="flex gap-3"><span className="overview-chart-icon"><Shield size={17} /></span><div><h2 className="font-semibold">{t("settings.security")}</h2><p className="mt-1 text-xs text-muted-foreground">{t("settings.securityHint")}</p></div></div><div className="mt-5 divide-y divide-border"><div className="flex items-center justify-between gap-4 py-4"><div><strong className="text-sm">{t("settings.audit")}</strong><p className="mt-1 text-xs text-muted-foreground">{t("settings.auditHint")}</p></div><Switch checked={audit} onCheckedChange={setAudit} aria-label={t("settings.audit")} /></div><div className="flex items-center justify-between gap-4 py-4"><div><strong className="text-sm">{t("settings.failover")}</strong><p className="mt-1 text-xs text-muted-foreground">{t("settings.failoverHint")}</p></div><Switch checked={failover} onCheckedChange={setFailover} aria-label={t("settings.failover")} /></div></div></Card>
        <Card className="min-w-0 p-5"><div className="flex gap-3"><span className="overview-chart-icon"><Database size={17} /></span><div><h2 className="font-semibold">{t("settings.storage")}</h2><p className="mt-1 text-xs text-muted-foreground">{t("settings.storageHint")}</p></div></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium"><span>{t("settings.retention")}</span><Input className="mt-2" defaultValue="30 days" /></label><label className="text-sm font-medium"><span>{t("settings.database")}</span><Input className="mt-2" defaultValue="SQLite · local" readOnly /></label></div></Card>
        <Card className="min-w-0 p-5"><div className="flex gap-3"><span className="overview-chart-icon"><SlidersHorizontal size={17} /></span><div><h2 className="font-semibold">{t("settings.limits")}</h2><p className="mt-1 text-xs text-muted-foreground">{t("settings.limitsHint")}</p></div></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium"><span>{t("settings.requestsPerMinute")}</span><Input className="mt-2" defaultValue="600" /></label><label className="text-sm font-medium"><span>{t("settings.concurrency")}</span><Input className="mt-2" defaultValue="32" /></label></div></Card>
      </div>
    </div>
  );
}
