import { motion } from "framer-motion";
import { Heart, Droplets, Moon, Activity } from "lucide-react";

const vitals = [
  {
    label: "Heart Rate",
    value: "72",
    unit: "bpm",
    icon: Heart,
    trend: "+2",
    status: "normal" as const,
    sparkline: [68, 70, 72, 71, 73, 72, 70, 72],
  },
  {
    label: "Glucose",
    value: "95",
    unit: "mg/dL",
    icon: Droplets,
    trend: "-3",
    status: "normal" as const,
    sparkline: [100, 98, 96, 95, 97, 95, 94, 95],
  },
  {
    label: "Sleep Score",
    value: "87",
    unit: "/100",
    icon: Moon,
    trend: "+5",
    status: "good" as const,
    sparkline: [80, 82, 84, 85, 83, 86, 85, 87],
  },
  {
    label: "Cortisol",
    value: "14.2",
    unit: "μg/dL",
    icon: Activity,
    trend: "-1.1",
    status: "elevated" as const,
    sparkline: [16, 15.5, 15, 14.8, 14.5, 14.3, 14.2, 14.2],
  },
];

const statusColor = {
  normal: "text-primary",
  good: "text-glow-accent",
  elevated: "text-glow-warning",
};

function MiniSparkline({ data }: { data: number[] }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const h = 28;
  const w = 80;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(" ");

  return (
    <svg width={w} height={h} className="opacity-40">
      <polyline
        points={points}
        fill="none"
        stroke="hsl(var(--glow-primary))"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function VitalsGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {vitals.map((vital, i) => (
        <motion.div
          key={vital.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          className="glass rounded-lg p-4 flex flex-col gap-3 group hover:glow-border transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <vital.icon className={`w-4 h-4 ${statusColor[vital.status]}`} />
              <span className="text-xs text-muted-foreground font-body">{vital.label}</span>
            </div>
            <MiniSparkline data={vital.sparkline} />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-display font-bold text-foreground">{vital.value}</span>
            <span className="text-xs text-muted-foreground">{vital.unit}</span>
          </div>
          <span className={`text-xs ${vital.trend.startsWith("+") ? "text-glow-accent" : "text-glow-warning"}`}>
            {vital.trend} from yesterday
          </span>
        </motion.div>
      ))}
    </div>
  );
}
