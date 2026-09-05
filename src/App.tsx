import { useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Bot,
  FileClock,
  Cpu,
  GitFork,
  KeyRound,
  Languages,
  LayoutDashboard,
  HeartPulse,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Sparkles,
  ChevronDown,
  Settings,
  LogOut,
  Sun,
  UserCircle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Metrics from "./pages/Metrics";
import Agents from "./pages/Agents";
import Routes from "./pages/Routes";
import ApiKeys from "./pages/ApiKeys";
import Login from "./pages/Login";
import Logs from "./pages/Logs";
import Playground from "./pages/Playground";
import SettingsPage from "./pages/Settings";
import { LanguageProvider, useI18n } from "./i18n";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { MetricCard } from "./components/metric-card";
import { PageHeader } from "./components/page-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";

type NavId = "overview" | "agents" | "routes" | "playground" | "apiKeys" | "metrics" | "logs" | "settings";
type NavItem = { id: NavId; path: string; icon: typeof LayoutDashboard; section: "workspace" | "tools" | "observability" | "system" };
const navItems: NavItem[] = [
  { id: "overview", path: "/", icon: LayoutDashboard, section: "workspace" },
  { id: "agents", path: "/agents", icon: Bot, section: "workspace" },
  { id: "routes", path: "/routes", icon: GitFork, section: "workspace" },
  { id: "playground", path: "/playground", icon: Sparkles, section: "tools" },
  { id: "apiKeys", path: "/api-keys", icon: KeyRound, section: "tools" },
  { id: "metrics", path: "/metrics", icon: BarChart3, section: "observability" },
  { id: "logs", path: "/logs", icon: FileClock, section: "observability" },
  { id: "settings", path: "/settings", icon: Settings, section: "system" },
];
const pathToNavId = (path: string): NavId =>
  navItems.find((item) => item.path === path)?.id ?? "overview";
const navIdToPath = (id: NavId): string =>
  navItems.find((item) => item.id === id)?.path ?? "/";
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useI18n();
  const dark = resolvedTheme === "dark";
  const label = dark ? t("common.switchToLight") : t("common.switchToDark");
  return (
    <Button
      variant="outline"
      size="icon"
      className="top-nav-secondary"
      onClick={() => setTheme(dark ? "light" : "dark")}
      type="button"
      aria-label={label}
      title={label}
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </Button>
  );
}
function LanguageToggle() {
  const { language, setLanguage, t } = useI18n();
  const nextLanguage = language === "zh-CN" ? "en" : "zh-CN";
  const label = language === "zh-CN" ? t("common.switchToEnglish") : t("common.switchToChinese");
  return (
    <Button
      variant="outline"
      size="icon"
      className="top-nav-secondary"
      onClick={() => setLanguage(nextLanguage)}
      type="button"
      aria-label={label}
      title={label}
    >
      <Languages size={16} />
    </Button>
  );
}
function TopNav({
  collapsed,
  onToggleCollapsed,
  onOpenMenu,
  onSignOut,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onOpenMenu: () => void;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  return (
    <header className="top-nav">
      <div className="top-nav-brand">
        <span className="brand-mark">✣</span>
        <span>AGENTGATEWAY</span>
      </div>
      <div className="top-nav-tools">
        <Button
          variant="outline"
          size="icon"
          className="top-nav-menu"
          onClick={onOpenMenu}
          type="button"
          aria-label={t("common.openMenu")}
          title={t("common.openMenu")}
        >
          <Menu size={18} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="top-nav-collapse"
          onClick={onToggleCollapsed}
          type="button"
          aria-label={collapsed ? t("common.expandSidebar") : t("common.collapseSidebar")}
          title={collapsed ? t("common.expandSidebar") : t("common.collapseSidebar")}
        >
          {collapsed ? (
            <PanelLeftOpen size={16} />
          ) : (
            <PanelLeftClose size={16} />
          )}
        </Button>
        <div className="top-nav-search">
          <Search size={15} aria-hidden="true" />
          <Input aria-label={t("common.search")} placeholder={t("common.search")} />
        </div>
        <div className="top-nav-actions">
          <LanguageToggle />
          <ThemeToggle />
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger>
              <Button
                variant="ghost"
                className="top-nav-user hover:bg-transparent"
                type="button"
                aria-label={t("common.openUserMenu")}
              >
                <UserCircle size={28} />
                <span>
                  <b>{t("common.operator")}</b>
                  <small>{t("common.controlPlane")}</small>
                </span>
                <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setOpen(false)}>
                <UserCircle size={15} />
                {t("common.profile")}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setOpen(false)}>
                <Settings size={15} />
                {t("common.settings")}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => { setOpen(false); onSignOut(); }}>
                <LogOut size={15} />
                {t("common.signOut")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
function Sidebar({
  active,
  onNavigate,
  collapsed,
  mobileOpen,
}: {
  active: NavId;
  onNavigate: (id: NavId) => void;
  collapsed: boolean;
  mobileOpen: boolean;
}) {
  const { t } = useI18n();
  const sections: NavItem["section"][] = ["workspace", "tools", "observability", "system"];
  return (
    <aside
      className={`sidebar${collapsed ? " collapsed" : ""}${mobileOpen ? " open" : ""}`}
    >
      <nav className="nav-list">
        {sections.map((section) => (
          <div className="nav-section" key={section}>
            <p className="nav-section-label">{t(`nav.section.${section}`)}</p>
            {navItems.filter((item) => item.section === section).map(({ id, path, icon: Icon }) => (
              <a
                className={`nav-item ${active === id ? "active" : ""}`}
                key={id}
                href={path}
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate(id);
                }}
                title={t(`nav.${id}`)}
                aria-current={active === id ? "page" : undefined}
              >
                <Icon size={17} strokeWidth={1.8} />
                <span>{t(`nav.${id}`)}</span>
              </a>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-footer">
          <span>v0.8.4</span>
          <span className="footer-status">
            <span className="online-dot" />
            {t("common.operational")}
          </span>
        </div>
      </div>
    </aside>
  );
}
function Overview({ onNavigate }: { onNavigate: (id: NavId) => void }) {
  const { t } = useI18n();
  const tokenTrend = [
    { time: "00:00", prompt: 320, completion: 180 },
    { time: "02:00", prompt: 280, completion: 155 },
    { time: "04:00", prompt: 410, completion: 214 },
    { time: "06:00", prompt: 540, completion: 286 },
    { time: "08:00", prompt: 760, completion: 390 },
    { time: "10:00", prompt: 840, completion: 430 },
    { time: "12:00", prompt: 920, completion: 470 },
    { time: "14:00", prompt: 980, completion: 512 },
    { time: "16:00", prompt: 1080, completion: 550 },
    { time: "18:00", prompt: 1160, completion: 604 },
    { time: "20:00", prompt: 1260, completion: 680 },
    { time: "22:00", prompt: 1380, completion: 742 },
  ];
  const agentUsage = [
    { name: "Claude Code", requests: 486 },
    { name: "Codex", requests: 392 },
    { name: "Python Sandbox", requests: 226 },
    { name: "Docker Agent", requests: 165 },
  ];
  const modelDistribution = [
    { name: "Claude 3.5", value: 42 },
    { name: "GPT-4o", value: 31 },
    { name: "DeepSeek-V3", value: 18 },
    { name: "Qwen-Max", value: 9 },
  ];
  const distributionColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
  ];
  const agents = [
    { name: "Claude Code", model: "claude-sonnet-4-5", models: 2, status: "running", color: "bg-chart-2" },
    { name: "Codex", model: "gpt-5.4", models: 3, status: "running", color: "bg-chart-1" },
    { name: "Pi", model: "deepseek-v3", models: 1, status: "offline", color: "bg-muted-foreground" },
  ];
  const relays = [
    { nameKey: "overview.primaryRelay", detail: "api.b.ai/v1", latency: "180ms", status: "healthy" },
    { nameKey: "overview.fallbackRelay", detail: "ai.akile.ai/v1", latency: "246ms", status: "healthy" },
    { nameKey: "overview.emergencyRelay", detail: "api.openai.com/v1", latency: "382ms", status: "degraded" },
  ];
  const activity = [
    { timeKey: "common.justNow", labelKey: "overview.codex", detail: t("overview.readModel"), tone: "bg-success" },
    { timeKey: "common.minutesAgo2", labelKey: "overview.llmGateway", detail: t("overview.relayLatency"), tone: "bg-success" },
    { timeKey: "common.minutesAgo8", labelKey: "overview.tokenAudit", detail: t("overview.tokenRequest"), tone: "bg-chart-1" },
    { timeKey: "common.minutesAgo12", labelKey: "overview.claudeCode", detail: t("overview.agentRunning"), tone: "bg-chart-3" },
  ];
  return (
    <div className="overview space-y-6">
      <PageHeader
        eyebrow={t("common.controlPlane")}
        title={t("nav.overview")}
        subtitle={t("overview.subtitle")}
        action={<span className="inline-flex shrink-0 items-center gap-2 text-xs text-muted-foreground"><span className="h-2 w-2 rounded-full bg-success" />{t("overview.synced")}</span>}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Bot} label={t("overview.discoveredAgents")} value="4" link={t("overview.agentAvailability")} onClick={() => onNavigate("agents")} />
        <MetricCard icon={GitFork} label={t("overview.healthyRoutes")} value="2 / 3" link={t("overview.routeAvailability")} onClick={() => onNavigate("routes")} />
        <MetricCard icon={BarChart3} label={t("overview.todayTokens")} value="2.45M" link={t("overview.vsYesterday")} onClick={() => onNavigate("metrics")} />
        <MetricCard icon={Cpu} label={t("overview.requestsToday")} value="1,269" link={t("overview.estimatedCostValue")} onClick={() => onNavigate("metrics")} />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="min-w-0 p-5 xl:col-span-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="overview-chart-icon"><BarChart3 size={17} /></span>
              <div><h2 className="font-semibold">{t("overview.tokenPulse")}</h2><p className="mt-1 text-xs text-muted-foreground">{t("overview.tokenPulseHint")}</p></div>
            </div>
            <Button variant="link" size="sm" onClick={() => onNavigate("metrics")} type="button">{t("overview.viewMetrics")} <ArrowUpRight size={14} /></Button>
          </div>
          <div className="overview-chart overview-chart-main">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tokenTrend} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="tokenPromptFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.28} /><stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} /></linearGradient>
                  <linearGradient id="tokenCompletionFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.24} /><stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
                <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} width={42} tickFormatter={(value) => `${value}k`} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }} labelStyle={{ color: "hsl(var(--foreground))" }} />
                <Legend iconType="line" wrapperStyle={{ fontSize: 11, color: "hsl(var(--muted-foreground))", paddingTop: 8 }} />
                <Area name={t("overview.promptTokens")} type="monotone" dataKey="prompt" stroke="hsl(var(--chart-1))" fill="url(#tokenPromptFill)" strokeWidth={2} />
                <Area name={t("overview.completionTokens")} type="monotone" dataKey="completion" stroke="hsl(var(--chart-2))" fill="url(#tokenCompletionFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="min-w-0 p-5 xl:col-span-4">
          <div className="flex items-start gap-3">
            <span className="overview-chart-icon"><Cpu size={17} /></span>
            <div><h2 className="font-semibold">{t("overview.modelDistribution")}</h2><p className="mt-1 text-xs text-muted-foreground">{t("overview.modelDistributionHint")}</p></div>
          </div>
          <div className="overview-chart overview-chart-donut">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={modelDistribution} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="82%" paddingAngle={3} stroke="hsl(var(--card))" strokeWidth={3}>
                  {modelDistribution.map((item, index) => <Cell key={item.name} fill={distributionColors[index % distributionColors.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, t("overview.share")]} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="overview-donut-center"><strong>2.45M</strong><span>{t("overview.tokens")}</span></div>
          </div>
          <div className="overview-legend">{modelDistribution.map((item, index) => <div key={item.name}><span style={{ backgroundColor: distributionColors[index % distributionColors.length] }} /> <span>{item.name}</span><strong>{item.value}%</strong></div>)}</div>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="min-w-0 p-5 xl:col-span-7">
          <div className="flex items-start gap-3"><span className="overview-chart-icon"><Bot size={17} /></span><div><h2 className="font-semibold">{t("overview.agentRequests")}</h2><p className="mt-1 text-xs text-muted-foreground">{t("overview.agentRequestsHint")}</p></div></div>
          <div className="overview-chart overview-chart-bars">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentUsage} layout="vertical" margin={{ top: 8, right: 8, left: 10, bottom: 0 }}>
                <CartesianGrid horizontal={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={88} tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                <Tooltip cursor={{ fill: "hsl(var(--muted) / 0.45)" }} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }} />
                <Bar dataKey="requests" name={t("overview.requests")} fill="hsl(var(--chart-3))" radius={[0, 3, 3, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="min-w-0 p-5 xl:col-span-5">
          <div className="flex items-start justify-between gap-4"><div className="flex items-start gap-3"><span className="overview-chart-icon"><HeartPulse size={17} /></span><div><h2 className="font-semibold">{t("overview.routesHealth")}</h2><p className="mt-1 text-xs text-muted-foreground">{t("overview.routesHealthHint")}</p></div></div><Button variant="link" size="sm" onClick={() => onNavigate("routes")} type="button">{t("overview.viewRoutes")} <ArrowUpRight size={14} /></Button></div>
          <div className="mt-4 divide-y divide-border">{relays.map((relay) => <div key={relay.nameKey} className="flex items-center gap-3 py-3"><span className={`h-2 w-2 rounded-full ${relay.status === "healthy" ? "bg-success" : "bg-warning"}`} /><div className="min-w-0 flex-1"><strong className="block text-sm">{t(relay.nameKey)}</strong><span className="block truncate font-mono text-xs text-muted-foreground">{relay.detail}</span></div><span className="font-mono text-xs">{relay.latency}</span></div>)}</div>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="min-w-0 p-5"><div className="flex items-start gap-3"><span className="overview-chart-icon"><Bot size={17} /></span><div><h2 className="font-semibold">{t("overview.agentRegistry")}</h2><p className="mt-1 text-xs text-muted-foreground">{t("overview.agentRegistryHint")}</p></div></div><div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">{agents.map((agent) => <button key={agent.name} type="button" onClick={() => onNavigate("agents")} className="rounded-lg border border-border bg-background p-4 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><div className="flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-md border border-border bg-muted"><Bot size={17} /></span><span className={`h-2 w-2 rounded-full ${agent.color}`} /></div><strong className="mt-4 block text-sm">{agent.name}</strong><span className="mt-1 block truncate font-mono text-xs text-muted-foreground">{agent.model}</span><span className="mt-3 block text-xs text-muted-foreground">{agent.models} {t("overview.modelsConfigured")}</span></button>)}</div></Card>
        <Card className="min-w-0 p-5"><div className="flex items-start gap-3"><span className="overview-chart-icon"><Activity size={17} /></span><div><h2 className="font-semibold">{t("overview.recentActivity")}</h2><p className="mt-1 text-xs text-muted-foreground">{t("overview.recentActivityHint")}</p></div></div><div className="mt-4 divide-y divide-border">{activity.map((item) => <div key={`${item.timeKey}-${item.labelKey}`} className="flex items-center gap-3 py-3"><span className={`h-2 w-2 rounded-full ${item.tone}`} /><div className="min-w-0 flex-1"><strong className="block truncate text-sm">{item.detail}</strong><span className="text-xs text-muted-foreground">{t(item.labelKey)}</span></div><span className="shrink-0 font-mono text-[11px] text-muted-foreground">{t(item.timeKey)}</span></div>)}</div></Card>
      </div>
    </div>
  );
}
function AppShell({ onSignOut }: { onSignOut: () => void }) {
  const [active, setActive] = useState<NavId>(() =>
    pathToNavId(window.location.pathname),
  );
  const [collapsed, setCollapsed] = useState<boolean>(
    () => localStorage.getItem("agent-sidebar-collapsed") === "1",
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    localStorage.setItem("agent-sidebar-collapsed", collapsed ? "1" : "0");
  }, [collapsed]);
  useEffect(() => {
    const handlePopState = () =>
      setActive(pathToNavId(window.location.pathname));
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  const navigate = (id: NavId) => {
    const path = navIdToPath(id);
    if (window.location.pathname !== path)
      window.history.pushState({}, "", path);
    setActive(id);
    setMobileOpen(false);
  };
  const toggleCollapsed = () => setCollapsed((c) => !c);
  return (
    <div className={`app-shell${collapsed ? " sidebar-collapsed" : ""}`}>
      <TopNav
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
        onOpenMenu={() => setMobileOpen(true)}
        onSignOut={onSignOut}
      />
      <Sidebar
        active={active}
        onNavigate={navigate}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
      />
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}
      <main className="main-content">
        {active === "overview" ? (
          <Overview onNavigate={navigate} />
        ) : active === "metrics" ? (
          <Metrics />
        ) : active === "agents" ? (
          <Agents />
        ) : active === "routes" ? (
          <Routes />
        ) : active === "playground" ? (
          <Playground />
        ) : active === "apiKeys" ? (
          <ApiKeys />
        ) : active === "logs" ? (
          <Logs />
        ) : (
          <SettingsPage />
        )}
      </main>
    </div>
  );
}
export default function App() {
  const [authenticated, setAuthenticated] = useState(() => localStorage.getItem("agent-authenticated") === "1");
  useEffect(() => {
    if (!authenticated && window.location.pathname !== "/login") window.history.replaceState({}, "", "/login");
    if (authenticated && window.location.pathname === "/login") window.history.replaceState({}, "", "/");
  }, [authenticated]);
  const signIn = () => {
    localStorage.setItem("agent-authenticated", "1");
    window.history.replaceState({}, "", "/");
    setAuthenticated(true);
  };
  const signOut = () => {
    localStorage.removeItem("agent-authenticated");
    window.history.replaceState({}, "", "/login");
    setAuthenticated(false);
  };
  return (
    <LanguageProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        {authenticated ? <AppShell onSignOut={signOut} /> : <Login onSignIn={signIn} />}
      </ThemeProvider>
    </LanguageProvider>
  );
}
