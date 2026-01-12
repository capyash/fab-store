import SolutionLayout from "../../../components/SolutionLayout";

const TP_RESOLVE_NAV_ITEMS = [
  { key: "resolve", label: "Home", iconName: "Home" },
  { key: "resolve/worklist", label: "Worklist", iconName: "ClipboardList" },
];

export default function TPResolveLayout({ children, onNavigate, active }) {
  return (
    <SolutionLayout
      productName="TP Resolve Appeals"
      tagline="Appeals & Grievances Intelligence"
      storageKey="tpresolve"
      navItems={TP_RESOLVE_NAV_ITEMS}
      footerText="TP Resolve Appeals • Powered by SOP Executor"
      onNavigate={onNavigate}
      active={active}
      showSettings={false}
    >
      {children}
    </SolutionLayout>
  );
}

