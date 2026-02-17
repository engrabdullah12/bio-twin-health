import { motion } from "framer-motion";

export default function BioTwinVisualization() {
  const rings = [80, 110, 140];

  return (
    <div className="relative flex items-center justify-center h-[320px]">
      {/* Central core */}
      <motion.div
        className="absolute w-16 h-16 rounded-full bg-primary/20 border border-primary/40"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-2 rounded-full bg-primary/30 animate-pulse-glow" />
      </motion.div>

      {/* Orbiting rings */}
      {rings.map((r, i) => (
        <div key={i} className="absolute" style={{ width: r * 2, height: r * 2 }}>
          <svg width={r * 2} height={r * 2} className="absolute inset-0">
            <circle
              cx={r}
              cy={r}
              r={r - 2}
              fill="none"
              stroke="hsl(var(--glow-primary))"
              strokeWidth="0.5"
              opacity={0.15 + i * 0.05}
              strokeDasharray="4 8"
            />
          </svg>
          <motion.div
            className="absolute w-3 h-3 rounded-full bg-primary/60 shadow-[0_0_10px_hsl(var(--glow-primary)/0.5)]"
            style={{ top: 0, left: "50%", marginLeft: -6 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 6 + i * 3, repeat: Infinity, ease: "linear" }}
            // orbit around center
          >
            <div className="w-full h-full rounded-full bg-primary animate-pulse-glow" />
          </motion.div>
        </div>
      ))}

      {/* Status labels */}
      <div className="absolute -top-2 right-0 text-[10px] text-muted-foreground font-body flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-glow-accent" />
        Twin Active
      </div>

      {/* Center label */}
      <div className="absolute bottom-4 text-center">
        <p className="text-xs text-muted-foreground font-body">Metabolic Sync</p>
        <p className="text-sm font-display font-semibold text-primary">98.7%</p>
      </div>
    </div>
  );
}
