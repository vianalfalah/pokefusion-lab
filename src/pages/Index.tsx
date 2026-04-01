import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, Zap, ChevronDown } from "lucide-react";
import { fetchPokemonList } from "@/lib/pokemon";
import PokemonCard from "@/components/PokemonCard";
import PokemonCardSkeleton from "@/components/PokemonCardSkeleton";
import Pokemon3DScene from "@/components/Pokemon3DScene";

const Index = () => {
  const [search, setSearch] = useState("");
  const [loadCount, setLoadCount] = useState(24);

  const { data: pokemon, isLoading } = useQuery({
    queryKey: ["pokemon-list", loadCount],
    queryFn: () => fetchPokemonList(loadCount, 0),
  });

  const filtered = pokemon?.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toString().includes(search)
  );

  return (
    <div className="min-h-screen gradient-mesh">
      {/* Hero Section */}
      <section className="relative pt-16 overflow-hidden">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-primary" />
                <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Interactive Pokédex
                </span>
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-black leading-tight mb-4">
                <span className="text-foreground">Discover</span>
                <br />
                <span className="glow-text text-primary">Pokémon</span>
              </h1>
              <p className="font-body text-base text-muted-foreground max-w-md mb-6">
                Explore the world of Pokémon with stunning 3D visuals, detailed stats, and interactive evolution chains.
              </p>

              {/* Search */}
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name or number..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full glass rounded-xl pl-10 pr-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="h-[300px] md:h-[400px]"
            >
              <Pokemon3DScene color="#ffd700" secondaryColor="#ff6b35" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pokemon Grid */}
      <section className="container mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6 flex items-center justify-between"
        >
          <h2 className="font-display text-lg font-bold text-foreground tracking-wide">
            All Pokémon
          </h2>
          <span className="font-body text-xs text-muted-foreground">
            {filtered?.length || 0} found
          </span>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {isLoading
            ? Array.from({ length: 24 }).map((_, i) => (
                <PokemonCardSkeleton key={i} />
              ))
            : filtered?.map((p, i) => (
                <PokemonCard key={p.id} pokemon={p} index={i} />
              ))}
        </div>

        {/* Load More */}
        {!isLoading && filtered && filtered.length >= loadCount && (
          <motion.div
            className="flex justify-center mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button
              onClick={() => setLoadCount((c) => c + 24)}
              className="glass-hover rounded-xl px-6 py-3 font-display text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2 group"
            >
              Load More
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Index;
