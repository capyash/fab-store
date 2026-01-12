import SolutionLayout from "../../../components/SolutionLayout";

const TP_LEND_NAV_ITEMS = [
  { key: "lend", label: "Home", iconName: "Home" },
  { key: "lend/worklist", label: "Worklist", iconName: "ClipboardList" },
];

export default function TPLendLayout({ children, onNavigate, active }) {
  return (
    <SolutionLayout
      productName="TP Lend"
      tagline="Mortgage Processing Intelligence"
      storageKey="tplend"
      navItems={TP_LEND_NAV_ITEMS}
      footerText="TP Lend • Powered by SOP Executor"
      onNavigate={onNavigate}
      active={active}
      showSettings={false}
    >
      {children}
    </SolutionLayout>
  );
}

