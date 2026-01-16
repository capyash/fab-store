import { useDemoMode } from"../contexts/DemoModeContext";
import { useAuth } from"../auth/AuthContext";

export default function Settings() {
 const { isDemoMode, toggleDemoMode } = useDemoMode();
 const { login, logout, isAuthenticated } = useAuth();

 return (
  <div className="p-6 space-y-6">
   <header>
    <h2 className="text-xl font-semibold text-text01">Settings</h2>
    <p className="text-sm text-text03">
     Lightweight controls for the recovery build. Replace with the full panel once available.
    </p>
   </header>

   <section className="rounded-2xl border border-stroke01 bg-white/80 p-5 space-y-4">
    <div className="flex items-center justify-between">
     <div>
      <p className="font-medium text-text01">Demo mode</p>
      <p className="text-sm text-text03">Toggles demo labels and mock data.</p>
     </div>
     <button
      type="button"
      onClick={toggleDemoMode}
      className={`px-4 py-2 rounded-full text-sm font-semibold ${
       isDemoMode ?"bg-success01 text-success02" :"bg-bg03 text-text01"
      }`}
     >
      {isDemoMode ?"Enabled" :"Disabled"}
     </button>
    </div>

    <div className="flex items-center justify-between">
     <div>
      <p className="font-medium text-text01">Authentication state</p>
      <p className="text-sm text-text03">
       Fake sign-in/out to preview the FAB Store flow.
      </p>
     </div>
     <button
      type="button"
      onClick={() => (isAuthenticated ? logout() : login())}
      className="px-4 py-2 rounded-full text-sm font-semibold bg-pinkTP text-white"
     >
      {isAuthenticated ?"Sign out" :"Sign in"}
     </button>
    </div>
   </section>
  </div>
 );
}

