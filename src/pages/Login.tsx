import { useState, type FormEvent } from "react";
import { ArrowRight, KeyRound, Languages, Moon, ShieldCheck, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useI18n } from "../i18n";

export default function Login({ onSignIn }: { onSignIn: () => void }) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { language, setLanguage, t } = useI18n();
  const { resolvedTheme, setTheme } = useTheme();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!username.trim() || !password.trim()) return;
    setSubmitting(true);
    window.setTimeout(onSignIn, 450);
  };

  return (
    <main className="login-shell">
      <div className="login-toolbar">
        <Button variant="outline" size="icon" type="button" onClick={() => setLanguage(language === "zh-CN" ? "en" : "zh-CN")} aria-label={t("common.language")} title={t("common.language")}>
          <Languages size={16} />
        </Button>
        <Button variant="outline" size="icon" type="button" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} aria-label={t("common.darkMode")} title={t("common.darkMode")}>
          {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </Button>
      </div>
      <div className="login-grid">
        <section className="login-intro">
          <span className="login-brand"><span className="brand-mark">✣</span> AGENTGATEWAY</span>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{t("login.controlPlane")}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{t("login.headline")}</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">{t("login.intro")}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {["login.featureRouting", "login.featureAgents", "login.featureAudit"].map((key) => (
              <div key={key} className="rounded-lg border border-border bg-card/70 p-4 text-sm">
                <ShieldCheck size={17} className="mb-3" />{t(key)}
              </div>
            ))}
          </div>
        </section>
        <Card className="login-card p-6 sm:p-8">
          <div className="grid h-11 w-11 place-items-center rounded-lg border border-border bg-muted"><KeyRound size={19} /></div>
          <h2 className="mt-6 text-2xl font-semibold tracking-tight">{t("login.title")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("login.subtitle")}</p>
          <form className="mt-7 space-y-5" onSubmit={submit}>
            <label className="block space-y-2 text-sm font-medium">
              <span>{t("login.username")}</span>
              <Input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" />
            </label>
            <label className="block space-y-2 text-sm font-medium">
              <span>{t("login.password")}</span>
              <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={t("login.passwordPlaceholder")} autoComplete="current-password" />
            </label>
            <Button className="w-full" type="submit" disabled={!username.trim() || !password.trim() || submitting}>
              {submitting ? t("login.signingIn") : t("login.signIn")}<ArrowRight size={16} />
            </Button>
          </form>
          <p className="mt-5 text-center text-xs text-muted-foreground">{t("login.securityHint")}</p>
        </Card>
      </div>
    </main>
  );
}
