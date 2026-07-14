import { motion } from "framer-motion";

import { useAnalytics } from "./hooks/useAnalytics";

const domains = ["overall", "mri", "esad", "mesad"];

export default function DomainSwitcher() {
  const { selectedDomain, setSelectedDomain, domainLabels } = useAnalytics();

  return (

    <div className="relative flex rounded-2xl border border-border bg-surface/80 p-1 shadow-sm backdrop-blur">

      <motion.div
        className="absolute top-1 bottom-1 rounded-xl bg-primary shadow-lg shadow-cyan-500/25"
        initial={false}
        animate={{ left: `${(domains.indexOf(selectedDomain) * 100) / domains.length}%` }}
        transition={{ type: "spring", stiffness: 500, damping: 36 }}
        style={{ width: `${100 / domains.length}%` }}
      />

      {domains.map(domain => (

        <button
          key={domain}
          type="button"
          onClick={() => setSelectedDomain(domain)}
          className={`relative z-10 px-4 py-2 rounded-xl text-sm font-medium transition ${selectedDomain === domain ? "text-white" : "text-muted-foreground hover:text-foreground"}`}
        >
          {domainLabels[domain]}
        </button>

      ))}

    </div>

  );
}