import { useState } from "react";
import { Bot, Braces, Clock3, CornerDownLeft, Sparkles, Zap } from "lucide-react";
import { MetricCard } from "../components/metric-card";
import { PageHeader } from "../components/page-header";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useI18n } from "../i18n";

const models = ["gpt-5.4", "claude-sonnet-4-5", "deepseek-v3", "qwen-max"];

export default function Playground() {
  const { t } = useI18n();
  const [model, setModel] = useState(models[0]);
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const send = () => {
    if (!prompt.trim()) return;
    setReply(t("playground.sampleReply"));
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={t("common.controlPlane")} title={t("playground.title")} subtitle={t("playground.subtitle")} action={<Badge variant="outline"><span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-success" />{t("playground.gatewayReady")}</Badge>} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard icon={Zap} label={t("playground.route")} value="Primary" detail="LiteLLM · 182ms" />
        <MetricCard icon={Clock3} label={t("playground.context")} value="128K" detail={t("playground.contextHint")} />
        <MetricCard icon={Braces} label={t("playground.protocol")} value="SSE" detail="OpenAI compatible" />
      </div>
      <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="min-w-0 p-5 xl:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold">{t("playground.session")}</h2><p className="mt-1 text-xs text-muted-foreground">{t("playground.sessionHint")}</p></div><Badge variant="secondary">{model}</Badge></div>
          <div className="mt-5 min-h-[22rem] rounded-lg border border-border bg-background p-4">
            <div className="flex gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-border bg-muted"><Sparkles size={15} /></span><div className="max-w-2xl rounded-lg bg-muted p-3 text-sm leading-6">{t("playground.welcome")}</div></div>
            {reply && <div className="mt-4 flex gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-border bg-muted"><Bot size={15} /></span><div className="max-w-2xl rounded-lg border border-border bg-card p-3 text-sm leading-6">{reply}</div></div>}
          </div>
          <div className="mt-4 flex gap-2"><Input value={prompt} onChange={(event) => setPrompt(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") send(); }} placeholder={t("playground.placeholder")} aria-label={t("playground.placeholder")} /><Button size="icon" type="button" onClick={send} disabled={!prompt.trim()} aria-label={t("playground.send")} title={t("playground.send")}><CornerDownLeft size={16} /></Button></div>
        </Card>
        <Card className="min-w-0 p-5 xl:col-span-4">
          <h2 className="font-semibold">{t("playground.model")}</h2><p className="mt-1 text-xs text-muted-foreground">{t("playground.modelHint")}</p>
          <div className="mt-4 space-y-2">{models.map((item) => <button type="button" key={item} onClick={() => setModel(item)} className={`flex w-full items-center justify-between rounded-lg border p-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${model === item ? "border-ring bg-muted" : "border-border hover:bg-muted/50"}`}><span><strong className="block">{item}</strong><small className="mt-1 block text-muted-foreground">{item.includes("claude") ? "Anthropic" : item.includes("deepseek") ? "DeepSeek" : item.includes("qwen") ? "Alibaba" : "OpenAI"}</small></span>{model === item && <span className="h-2 w-2 rounded-full bg-success" />}</button>)}</div>
          <div className="mt-5 border-t border-border pt-5"><h3 className="text-sm font-medium">{t("playground.parameters")}</h3><div className="mt-3 grid grid-cols-2 gap-3"><label className="text-xs text-muted-foreground">Temperature<Input className="mt-2" value="0.7" readOnly /></label><label className="text-xs text-muted-foreground">Max tokens<Input className="mt-2" value="4096" readOnly /></label></div></div>
        </Card>
      </div>
    </div>
  );
}
