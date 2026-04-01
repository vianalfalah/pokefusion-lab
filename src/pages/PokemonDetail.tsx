import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Ruler, Weight, Sparkles } from "lucide-react";
import {
  fetchPokemon,
  fetchPokemonSpecies,
  fetchEvolutionChain,
  TYPE_GRADIENTS,
} from "@/lib/pokemon";
import StatsChart from "@/components/StatsChart";
import EvolutionChain from "@/components/EvolutionChain";
import Pokemon3DScene from "@/components/Pokemon3DScene";

const TYPE_3D_COLORS: Record<string, [string, string]> = {
  fire: ["#f97316", "#ef4444"],
  water: ["#3b82f6", "#06b6d4"],
  grass: ["#22c55e", "#84cc16"],
  electric: ["#eab308", "#f59e0b"],
  psychic: ["#ec4899", "#a855f7"],
  ice: ["#06b6d4", "#67e8f9"],
  dragon: ["#7c3aed", "#6366f1"],
  dark: ["#374151", "#1f2937"],
  fairy: ["#f472b6", "#e879f9"],
  normal: ["#9ca3af", "#6b7280"],
  fighting: ["#dc2626", "#ea580c"],
  flying: ["#818cf8", "#a78bfa"],
  poison: ["#a855f7", "#7c3aed"],
  ground: ["#d97706", "#92400e"],
  rock: ["#78716c", "#a8a29e"],
  bug: ["#84cc16", "#65a30d"],
  ghost: ["#7c3aed", "#4c1d95"],
  steel: ["#9ca3af", "#6b7280"],
};

const PokemonDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: pokemon, isLoading } = useQuery({
    queryKey: ["pokemon", id],
    queryFn: () => fetchPokemon(id!),
    enabled: !!id,
  });

  const { data: species } = useQuery({
    queryKey: ["pokemon-species", id],
    queryFn: () => fetchPokemonSpecies(Number(id)),
    enabled: !!id,
  });

  const { data: evolution } = useQuery({
    queryKey: ["evolution", species?.evolution_chain_url],
    queryFn: () => fetchEvolutionChain(species!.evolution_chain_url),
    enabled: !!species?.evolution_chain_url,
  });

  if (isLoading || !pokemon) {
    return (
      <div className="min-h-screen gradient-mesh pt-24 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const mainType = pokemon.types[0];
  const gradient = TYPE_GRADIENTS[mainType] || TYPE_GRADIENTS.normal;
  const [color3d, secondary3d] = TYPE_3D_COLORS[mainType] || TYPE_3D_COLORS.normal;

  return (
    <div className="min-h-screen gradient-mesh pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pokédex
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Image + 3D */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="glass rounded-3xl p-8 relative overflow-hidden">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`}
              />
              <div className="relative flex items-center justify-center">
                <motion.img
                  src={pokemon.officialArtwork}
                  alt={pokemon.name}
                  className="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-2xl"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                  whileHover={{ scale: 1.05, rotate: 3 }}
                />
              </div>
            </div>

            {/* 3D Scene */}
            <div className="glass rounded-3xl overflow-hidden h-[250px]">
              <Pokemon3DScene color={color3d} secondaryColor={secondary3d} />
            </div>
          </motion.div>

          {/* Right: Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <span className="font-display text-sm text-muted-foreground">
                #{String(pokemon.id).padStart(3, "0")}
              </span>
              <h1 className="font-display text-3xl md:text-5xl font-black capitalize text-foreground mt-1">
                {pokemon.name}
              </h1>
              {species && (
                <p className="font-body text-sm text-muted-foreground mt-1">
                  {species.genus}
                </p>
              )}
            </div>

            {/* Types */}
            <div className="flex gap-2">
              {pokemon.types.map((type) => (
                <span
                  key={type}
                  className={`font-body text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full bg-gradient-to-r ${TYPE_GRADIENTS[type] || ""} text-foreground`}
                >
                  {type}
                </span>
              ))}
            </div>

            {/* Description */}
            {species && (
              <p className="font-body text-sm text-secondary-foreground leading-relaxed glass rounded-xl p-4">
                {species.flavor_text}
              </p>
            )}

            {/* Physical */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass rounded-xl p-4 flex items-center gap-3">
                <Ruler className="w-5 h-5 text-accent" />
                <div>
                  <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">Height</p>
                  <p className="font-display text-sm font-bold text-foreground">{(pokemon.height / 10).toFixed(1)}m</p>
                </div>
              </div>
              <div className="glass rounded-xl p-4 flex items-center gap-3">
                <Weight className="w-5 h-5 text-accent" />
                <div>
                  <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">Weight</p>
                  <p className="font-display text-sm font-bold text-foreground">{(pokemon.weight / 10).toFixed(1)}kg</p>
                </div>
              </div>
            </div>

            {/* Abilities */}
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="font-display text-xs font-bold uppercase tracking-wider text-foreground">
                  Abilities
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {pokemon.abilities.map((ability) => (
                  <span
                    key={ability}
                    className="font-body text-xs capitalize px-3 py-1 rounded-lg bg-secondary text-secondary-foreground"
                  >
                    {ability.replace("-", " ")}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="glass rounded-xl p-4">
              <h3 className="font-display text-xs font-bold uppercase tracking-wider text-foreground mb-4">
                Base Stats
              </h3>
              <StatsChart stats={pokemon.stats} />
            </div>

            {/* Evolution */}
            {evolution && evolution.length > 1 && (
              <div className="glass rounded-xl p-4">
                <h3 className="font-display text-xs font-bold uppercase tracking-wider text-foreground mb-4">
                  Evolution Chain
                </h3>
                <EvolutionChain steps={evolution} />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
