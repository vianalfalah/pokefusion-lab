import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Pokemon, TYPE_GRADIENTS } from "@/lib/pokemon";

interface PokemonCardProps {
  pokemon: Pokemon;
  index: number;
}

const PokemonCard = ({ pokemon, index }: PokemonCardProps) => {
  const mainType = pokemon.types[0];
  const gradient = TYPE_GRADIENTS[mainType] || TYPE_GRADIENTS.normal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
    >
      <Link to={`/pokemon/${pokemon.id}`}>
        <motion.div
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="glass-hover rounded-2xl p-5 cursor-pointer group relative overflow-hidden"
        >
          {/* Background glow */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}
          />

          {/* ID badge */}
          <div className="absolute top-3 right-3 font-display text-xs font-bold text-muted-foreground">
            #{String(pokemon.id).padStart(3, "0")}
          </div>

          {/* Pokemon image */}
          <div className="relative w-full aspect-square flex items-center justify-center mb-3">
            <div
              className={`absolute inset-4 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl group-hover:opacity-25 transition-opacity duration-500`}
            />
            <motion.img
              src={pokemon.officialArtwork}
              alt={pokemon.name}
              className="relative w-3/4 h-3/4 object-contain drop-shadow-2xl"
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
              loading="lazy"
            />
          </div>

          {/* Name */}
          <h3 className="font-display text-sm font-bold capitalize text-foreground tracking-wide mb-2">
            {pokemon.name}
          </h3>

          {/* Types */}
          <div className="flex gap-1.5">
            {pokemon.types.map((type) => (
              <span
                key={type}
                className={`text-[10px] font-body font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r ${TYPE_GRADIENTS[type] || ""} text-foreground`}
              >
                {type}
              </span>
            ))}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default PokemonCard;
