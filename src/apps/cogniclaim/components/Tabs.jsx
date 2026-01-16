import { useState } from"react";

export default function Tabs({ tabs, initial = 0 }) {
 const [active, setActive] = useState(initial);
 return (
  <div className="flex flex-col h-full">
   <div className="flex gap-2 border-b border-stroke01 px-4 pt-3">
    {tabs.map((t, i) => (
     <button
      key={t.label}
      onClick={() => setActive(i)}
      className={`px-3 py-2 text-sm rounded-t-md font-medium transition-colors ${
       i===active
        ?"bg-white border border-b-0 border-stroke01 text-text01 font-semibold"
        :"text-text02 hover:bg-bg03:bg-text01 hover:text-text01:text-bg03"
      }`}
     >
      {t.label}
     </button>
    ))}
   </div>
   <div className="flex-1 overflow-auto p-4">
    {tabs[active]?.content}
   </div>
  </div>
 );
}
