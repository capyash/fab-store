import SolutionLayout from "./SolutionLayout";

const COGNICLAIM_NAV_ITEMS = [
  { key: "store", label: "FAB Store", iconName: "Store" },
  { key: "home", label: "Home", iconName: "Home" },
  { key: "worklist", label: "Worklist", iconName: "ClipboardList" },
  { key: "executive", label: "Executive", iconName: "TrendingUp" },
  { key: "reports", label: "Reports", iconName: "BarChart3" },
  { key: "knowledge", label: "Knowledge Base", iconName: "BookOpen" },
  { key: "pitch", label: "Product Hub", iconName: "Sparkles" },
];

export default function Layout({ children, onNavigate, active }) {
  return (
    <SolutionLayout
      productName="Cogniclaim"
      tagline="AI-Powered Claims Intelligence"
      storageKey="cogniclaim"
      navItems={COGNICLAIM_NAV_ITEMS}
      onNavigate={onNavigate}
      active={active}
      footerText="Cogniclaim • Powered by SOP Executor"
      showSettings={true}
    >
      {children}
    </SolutionLayout>
  );
}

