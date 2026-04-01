import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:animate-glow-pulse transition-all">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold tracking-wider text-foreground">
            POKÉDEX
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {[
            { to: "/", label: "Explore" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="relative font-body text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
              {location.pathname === link.to && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
