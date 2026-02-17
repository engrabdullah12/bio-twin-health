import { motion } from "framer-motion";
import { Dna, ShieldCheck, TrendingUp } from "lucide-react";

const traits = [
  { gene: "CYP2D6", status: "Normal Metabolizer", detail: "Standard drug processing speed" },
  { gene: "MTHFR C677T", status: "Heterozygous", detail: "Slightly reduced folate metabolism" },
  { gene: "CYP2C9", status: "Slow Metabolizer", detail: "Extended half-life for NSAIDs" },
  { gene: "APOE", status: "ε3/ε3", detail: "Average lipid metabolism risk" },
];

export default function DNAProfile() {
  return (
    <div className="glass rounded-lg p-6 space-y-5">
      <div className="flex items-center gap-3">
        <Dna className="w-5 h-5 text-primary" />
        <h3 className="font-display font-semibold text-foreground">Genetic Profile</h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {traits.map((t, i) => (
          <motion.div
            key={t.gene}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
          >
            <div>
              <p className="text-sm font-display font-medium text-foreground">{t.gene}</p>
              <p className="text-xs text-muted-foreground font-body">{t.detail}</p>
            </div>
            <span className={`text-xs font-body px-2 py-1 rounded-full border ${
              t.status.includes("Slow") 
                ? "border-glow-warning/30 text-glow-warning bg-glow-warning/5" 
                : t.status.includes("Heterozygous")
                ? "border-glow-warning/30 text-glow-warning bg-glow-warning/5"
                : "border-glow-accent/30 text-glow-accent bg-glow-accent/5"
            }`}>
              {t.status}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-4 pt-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="w-3.5 h-3.5 text-glow-accent" /> Data Encrypted
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <TrendingUp className="w-3.5 h-3.5 text-primary" /> Last updated 7d ago
        </div>
      </div>
    </div>
  );
}
