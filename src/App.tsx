import { useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Bot,
  Cpu,
  GitFork,
  Languages,
  LayoutDashboard,
  HeartPulse,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  ChevronDown,
  Settings,
  LogOut,
  Server,
  Sun,
  UserCircle,
} from "lucide-react";
import Metrics from "./pages/Metrics";
import Agents from "./pages/Agents";
import Routes from "./pages/Routes";
import { LanguageProvider, useI18n } from "./i18n";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Input } from "./components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";

type NavId = "overview" | "agents" | "routes" | "metrics";
type NavItem = { id: NavId; path: string; icon: typeof LayoutDashboard };
const navItems: NavItem[] = [
  { id: "overview", path: "/", icon: LayoutDashboard },
  { id: "agents", path: "/agents", icon: Bot },
  { id: "routes", path: "/routes", icon: GitFork },
  { id: "metrics", path: "/metrics", icon: BarChart3 },
];
const pathToNavId = (path: string): NavId =>
  navItems.find((item) => item.path === path)?.id ?? "overview";
const navIdToPath = (id: NavId): string =>
  navItems.find((item) => item.id === id)?.path ?? "/";
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const label = "切换主题 / Toggle Theme";
  return (
    <Button
      variant="outline"
      size="icon"
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
  const { language, setLanguage } = useI18n();
  const nextLanguage = language === "zh-CN" ? "en" : "zh-CN";
  const label = "切换语言 / Switch Language";
  return (
    <Button
      variant="outline"
      size="icon"
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
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}) {
  const [open, setOpen] = useState(false);
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
          className="top-nav-collapse"
          onClick={onToggleCollapsed}
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen size={16} />
          ) : (
            <PanelLeftClose size={16} />
          )}
        </Button>
        <div className="top-nav-search">
          <Search size={15} aria-hidden="true" />
          <Input aria-label="Search" placeholder="Search" />
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
              >
                <UserCircle size={28} />
                <span>
                  <b>Operator</b>
                  <small>Control plane</small>
                </span>
                <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setOpen(false)}>
                <UserCircle size={15} />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setOpen(false)}>
                <Settings size={15} />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setOpen(false)}>
                <LogOut size={15} />
                Sign out
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
  return (
    <aside
      className={`sidebar${collapsed ? " collapsed" : ""}${mobileOpen ? " open" : ""}`}
    >
      <nav className="nav-list">
        {navItems.map(({ id, path, icon: Icon }) => (
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
function HeartPulseIcon() {
  return <HeartPulse size={16} className="muted-icon" />;
}
function MetricCard({
  icon: Icon,
  label,
  value,
  link,
  tone,
  onClick,
}: {
  icon: typeof Server;
  label: string;
  value: string;
  link: string;
  tone: string;
  onClick: () => void;
}) {
  return (
    <Card
      className="metric-card cursor-pointer transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      role="link"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
    >
      <div className="metric-top">
        <span className={`metric-icon ${tone}`}>
          <Icon size={16} />
        </span>
        <span>{label}</span>
        <ArrowUpRight size={15} className="metric-arrow" />
      </div>
      <strong>{value}</strong>
      <div className="metric-link">
        {link}
        <ArrowUpRight size={14} />
      </div>
    </Card>
  );
}
function Overview({ onNavigate }: { onNavigate: (id: NavId) => void }) {
  const { t } = useI18n();
  return (
    <div className="overview">
      <div className="page-head">
        <div>
          <h1>{t("overview.greeting")}</h1>
          <p>{t("overview.subtitle")}</p>
        </div>
        <span className="sync-label">
          <span className="online-dot" />
          {t("overview.synced")}
        </span>
      </div>
      <div className="metric-grid">
        <MetricCard
          icon={Bot}
          label={t("overview.activeAgents").toUpperCase()}
          value="3"
          link="Claude Code / Codex / 沙盒"
          tone="tone-violet"
          onClick={() => onNavigate("agents")}
        />
        <MetricCard
          icon={GitFork}
          label={t("overview.gatewayStatus").toUpperCase()}
          value="99.9%"
          link={t("overview.connectedRelays")}
          tone="tone-green"
          onClick={() => onNavigate("routes")}
        />
        <MetricCard
          icon={BarChart3}
          label={t("overview.todayTokens").toUpperCase()}
          value="2.45M"
          link={t("overview.vsYesterday")}
          tone="tone-blue"
          onClick={() => onNavigate("metrics")}
        />
        <MetricCard
          icon={Cpu}
          label={t("overview.todayCost").toUpperCase()}
          value="$6.82"
          link={t("overview.estimated")}
          tone="tone-orange"
          onClick={() => onNavigate("metrics")}
        />
      </div>
      <div className="content-grid overview-live-grid">
        <section className="panel task-flow-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">AGENT RUNTIME</span>
              <h2>{t("overview.taskFlow")}</h2>
            </div>
            <Activity size={16} className="muted-icon" />
          </div>
          <div className="flow-list">
            <div>
              <span className="flow-status running" />
              <span>Claude Code</span>
              <b>Refactoring auth middleware</b>
              <em>running</em>
            </div>
            <div>
              <span className="flow-status running" />
              <span>Codex Runner</span>
              <b>Review pull request #184</b>
              <em>running</em>
            </div>
            <div>
              <span className="flow-status idle" />
              <span>Python Sandbox</span>
              <b>Idle · awaiting assignment</b>
              <em>idle</em>
            </div>
            <div>
              <span className="flow-status failed" />
              <span>Docker Agent</span>
              <b>Dependency audit</b>
              <em>failed</em>
            </div>
          </div>
        </section>
        <section className="panel latency-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">LLM GATEWAY</span>
              <h2>{t("overview.liveLatency")}</h2>
            </div>
            <HeartPulseIcon />
          </div>
          <div className="latency-list">
            <div>
              <span className="online-dot" />
              <div>
                <b>中转站-主通道</b>
                <small>https://api.b.ai/v1</small>
              </div>
              <strong>180ms</strong>
            </div>
            <div>
              <span className="online-dot" />
              <div>
                <b>备用中转站</b>
                <small>https://ai.akile.ai/v1</small>
              </div>
              <strong>246ms</strong>
            </div>
            <div>
              <span className="offline-dot" />
              <div>
                <b>官方直连</b>
                <small>standby / emergency</small>
              </div>
              <strong>382ms</strong>
            </div>
          </div>
        </section>
      </div>
      <div className="quick-entry-row">
        <Button onClick={() => onNavigate("agents")} type="button">
          <Plus size={16} />
          {t("overview.launchAgent")}
        </Button>
        <Button onClick={() => onNavigate("routes")} type="button">
          <Plus size={16} />
          {t("overview.addRelay")}
        </Button>
        <Button onClick={() => onNavigate("metrics")} type="button">
          <ArrowUpRight size={16} />
          {t("overview.viewBilling")}
        </Button>
      </div>
    </div>
  );
}
function AppShell() {
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
      <TopNav collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
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
        <Button
          className="menu-trigger"
          onClick={() => setMobileOpen(true)}
          type="button"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </Button>
        {active === "overview" ? (
          <Overview onNavigate={navigate} />
        ) : active === "metrics" ? (
          <Metrics />
        ) : active === "agents" ? (
          <Agents />
        ) : (
          <Routes />
        )}
      </main>
    </div>
  );
}
export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <AppShell />
      </ThemeProvider>
    </LanguageProvider>
  );
}
