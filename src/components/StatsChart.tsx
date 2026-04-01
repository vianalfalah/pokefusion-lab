import { motion } from "framer-motion";

interface StatsChartProps {
  stats: { name: string; value: number }[];
}

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SP.ATK",
  "special-defense": "SP.DEF",
  speed: "SPD",
};

const StatsChart = ({ stats }: StatsChartProps) => {
  return (
    <div className="space-y-3">
      {stats.map((stat, i) => (
        <div key={stat.name} className="flex items-center gap-3">
          <span className="font-display text-[10px] font-bold uppercase tracking-wider text-muted-foreground w-14 text-right">
            {STAT_LABELS[stat.name] || stat.name}
          </span>
          <span className="font-body text-sm font-bold text-foreground w-8 text-right">
            {stat.value}
          </span>
          <div className="flex-1 stat-bar">
            <motion.div
              className="stat-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${(stat.value / 255) * 100}%` }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsChart;
