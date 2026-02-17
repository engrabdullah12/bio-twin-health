import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, AlertTriangle, CheckCircle, Loader2, Search } from "lucide-react";

type SimResult = {
  compatibility: number;
  risks: string[];
  benefits: string[];
  interactions: string[];
};

const mockResults: Record<string, SimResult> = {
  "Vitamin D3": {
    compatibility: 94,
    risks: [],
    benefits: ["Improves calcium absorption by 23%", "Synergizes with your current magnesium levels"],
    interactions: [],
  },
  Metformin: {
    compatibility: 72,
    risks: ["May lower B12 absorption given your genetic variant MTHFR C677T"],
    benefits: ["Effective glucose regulation for your metabolic profile"],
    interactions: ["Moderate interaction with your cortisol cycle — take in AM"],
  },
  Ibuprofen: {
    compatibility: 45,
    risks: ["Your CYP2C9 variant causes slow metabolism — 2x longer half-life", "Elevated GI risk with current cortisol levels"],
    benefits: ["Effective anti-inflammatory"],
    interactions: ["Conflicts with your evening supplement stack"],
  },
};

const suggestions = Object.keys(mockResults);

export default function DrugSimulator() {
  const [query, setQuery] = useState("");
  const [simulating, setSimulating] = useState(false);
  const [result, setResult] = useState<SimResult | null>(null);
  const [selectedDrug, setSelectedDrug] = useState("");

  const runSimulation = (drug: string) => {
    setSelectedDrug(drug);
    setQuery(drug);
    setSimulating(true);
    setResult(null);
    setTimeout(() => {
      setResult(mockResults[drug] || mockResults["Vitamin D3"]);
      setSimulating(false);
    }, 2000);
  };

  const compatColor = (score: number) => {
    if (score >= 80) return "text-glow-accent";
    if (score >= 60) return "text-glow-warning";
    return "text-glow-danger";
  };

  return (
    <div className="glass rounded-lg p-6 space-y-5">
      <div className="flex items-center gap-3">
        <FlaskConical className="w-5 h-5 text-primary" />
        <h3 className="font-display font-semibold text-foreground">Drug Simulator</h3>
      </div>

      <p className="text-xs text-muted-foreground font-body">
        Feed a medication to your Bio-Twin and see how it interacts with your unique biology.
      </p>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search medication or supplement..."
          className="w-full bg-secondary/50 border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground font-body focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
        />
      </div>

      {/* Quick picks */}
      <div className="flex gap-2 flex-wrap">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => runSimulation(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-body transition-all border ${
              selectedDrug === s
                ? "bg-primary/20 border-primary/40 text-primary"
                : "bg-secondary/50 border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Simulation */}
      <AnimatePresence mode="wait">
        {simulating && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 py-8"
          >
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground font-body">Simulating on your Bio-Twin...</p>
            <div className="w-48 h-1 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        )}

        {result && !simulating && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Compatibility score */}
            <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
              <div className={`text-3xl font-display font-bold ${compatColor(result.compatibility)}`}>
                {result.compatibility}%
              </div>
              <div>
                <p className="text-sm font-display font-medium text-foreground">Compatibility Score</p>
                <p className="text-xs text-muted-foreground font-body">Based on your genetic & metabolic profile</p>
              </div>
            </div>

            {/* Risks */}
            {result.risks.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-display font-medium text-glow-danger flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Risks Detected
                </p>
                {result.risks.map((r, i) => (
                  <p key={i} className="text-xs text-muted-foreground font-body pl-5">• {r}</p>
                ))}
              </div>
            )}

            {/* Benefits */}
            {result.benefits.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-display font-medium text-glow-accent flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Benefits
                </p>
                {result.benefits.map((b, i) => (
                  <p key={i} className="text-xs text-muted-foreground font-body pl-5">• {b}</p>
                ))}
              </div>
            )}

            {/* Interactions */}
            {result.interactions.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-display font-medium text-glow-warning flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Interactions
                </p>
                {result.interactions.map((int, i) => (
                  <p key={i} className="text-xs text-muted-foreground font-body pl-5">• {int}</p>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
