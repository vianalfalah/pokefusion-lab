import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { EvolutionStep } from "@/lib/pokemon";

interface EvolutionChainProps {
  steps: EvolutionStep[];
}

const EvolutionChain = ({ steps }: EvolutionChainProps) => {
  if (steps.length <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center gap-2">
          <Link to={`/pokemon/${step.id}`}>
            <motion.div
              whileHover={{ scale: 1.1, y: -4 }}
              className="glass rounded-xl p-3 flex flex-col items-center gap-2 cursor-pointer group"
            >
              <img
                src={step.sprite}
                alt={step.name}
                className="w-16 h-16 object-contain group-hover:drop-shadow-[0_0_12px_hsl(var(--primary)/0.5)] transition-all"
              />
              <span className="font-display text-[10px] font-bold uppercase tracking-wider text-foreground capitalize">
                {step.name}
              </span>
              {step.min_level && (
                <span className="font-body text-[10px] text-muted-foreground">
                  Lv. {step.min_level}
                </span>
              )}
            </motion.div>
          </Link>
          {i < steps.length - 1 && (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      ))}
    </div>
  );
};

export default EvolutionChain;
