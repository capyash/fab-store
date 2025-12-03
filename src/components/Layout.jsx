import SolutionLayout from "./SolutionLayout";

export default function Layout({ children, onNavigate, active }) {
  return (
    <SolutionLayout
      productName="Cogniclaim"
      tagline="AI-Powered Claims Intelligence"
      storageKey="cogniclaim"
      onNavigate={onNavigate}
      active={active}
    >
      {children}
    </SolutionLayout>
  );
}

