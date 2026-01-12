import SolutionLayout from "../../../components/SolutionLayout";

const AGENTIC_SUPPORT_NAV_ITEMS = [
  { key: "agentic", label: "Console", iconName: "HeadsetMic" },
  { key: "agentic/watchtower", label: "AI Watchtower", iconName: "Activity" },
  { key: "agentic/executive", label: "Reports & Analytics", iconName: "BarChart3" },
  { key: "agentic/knowledge-base", label: "Knowledge Base", iconName: "BookOpen" },
  { key: "agentic/admin", label: "Admin", iconName: "Settings" },
];

export default function AgenticSupportLayout({ children, onNavigate, active }) {
  return (
    <SolutionLayout
      productName="TP FAB Agents"
      tagline="Self-healing workflows for customer & device support"
      storageKey="agenticsupport"
      navItems={AGENTIC_SUPPORT_NAV_ITEMS}
      onNavigate={onNavigate}
      active={active}
      footerText="TP FAB Agents • Powered by AI Console Orchestration"
      showSettings={false}
    >
      {children}
    </SolutionLayout>
  );
}


