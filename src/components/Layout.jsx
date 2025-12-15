import SolutionLayout from "./SolutionLayout";
import {
  Home,
  ClipboardList,
  TrendingUp,
  BarChart3,
  BookOpen,
  Sparkles,
  Store,
} from "lucide-react";

const COGNICLAIM_NAV_ITEMS = [
  { key: "store", label: "FAB Store", icon: Store },
  { key: "home", label: "Home", icon: Home },
  { key: "worklist", label: "Worklist", icon: ClipboardList },
  { key: "executive", label: "Executive", icon: TrendingUp },
  { key: "reports", label: "Reports", icon: BarChart3 },
  { key: "knowledge", label: "Knowledge Base", icon: BookOpen },
  { key: "pitch", label: "Product Hub", icon: Sparkles },
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

