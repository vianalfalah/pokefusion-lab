export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  stats: { name: string; value: number }[];
  abilities: string[];
  height: number;
  weight: number;
  sprite: string;
  officialArtwork: string;
}

export interface PokemonSpecies {
  evolution_chain_url: string;
  flavor_text: string;
  genus: string;
}

export interface EvolutionStep {
  name: string;
  id: number;
  sprite: string;
  min_level: number | null;
}

const BASE_URL = "https://pokeapi.co/api/v2";

export async function fetchPokemonList(limit = 24, offset = 0): Promise<Pokemon[]> {
  const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  const data = await res.json();
  const details = await Promise.all(
    data.results.map((p: { url: string }) => fetch(p.url).then((r) => r.json()))
  );
  return details.map(mapPokemon);
}

export async function fetchPokemon(idOrName: string | number): Promise<Pokemon> {
  const res = await fetch(`${BASE_URL}/pokemon/${idOrName}`);
  const data = await res.json();
  return mapPokemon(data);
}

export async function fetchPokemonSpecies(id: number): Promise<PokemonSpecies> {
  const res = await fetch(`${BASE_URL}/pokemon-species/${id}`);
  const data = await res.json();
  const englishFlavor = data.flavor_text_entries.find(
    (e: any) => e.language.name === "en"
  );
  const englishGenus = data.genera.find((g: any) => g.language.name === "en");
  return {
    evolution_chain_url: data.evolution_chain.url,
    flavor_text: englishFlavor?.flavor_text?.replace(/\f/g, " ") || "",
    genus: englishGenus?.genus || "",
  };
}

export async function fetchEvolutionChain(url: string): Promise<EvolutionStep[]> {
  const res = await fetch(url);
  const data = await res.json();
  const steps: EvolutionStep[] = [];

  let current = data.chain;
  while (current) {
    const id = extractIdFromUrl(current.species.url);
    steps.push({
      name: current.species.name,
      id,
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      min_level: current.evolution_details?.[0]?.min_level || null,
    });
    current = current.evolves_to?.[0] || null;
  }
  return steps;
}

function extractIdFromUrl(url: string): number {
  const parts = url.split("/").filter(Boolean);
  return parseInt(parts[parts.length - 1]);
}

function mapPokemon(data: any): Pokemon {
  return {
    id: data.id,
    name: data.name,
    types: data.types.map((t: any) => t.type.name),
    stats: data.stats.map((s: any) => ({
      name: s.stat.name,
      value: s.base_stat,
    })),
    abilities: data.abilities.map((a: any) => a.ability.name),
    height: data.height,
    weight: data.weight,
    sprite: data.sprites.front_default,
    officialArtwork:
      data.sprites.other["official-artwork"].front_default ||
      data.sprites.front_default,
  };
}

export const TYPE_COLORS: Record<string, string> = {
  fire: "bg-pokemon-fire",
  water: "bg-pokemon-water",
  grass: "bg-pokemon-grass",
  electric: "bg-pokemon-electric",
  psychic: "bg-pokemon-psychic",
  ice: "bg-pokemon-ice",
  dragon: "bg-pokemon-dragon",
  dark: "bg-pokemon-dark",
  fairy: "bg-pokemon-fairy",
  fighting: "bg-pokemon-fighting",
  flying: "bg-pokemon-flying",
  poison: "bg-pokemon-poison",
  ground: "bg-pokemon-ground",
  rock: "bg-pokemon-rock",
  bug: "bg-pokemon-bug",
  ghost: "bg-pokemon-ghost",
  steel: "bg-pokemon-steel",
  normal: "bg-pokemon-normal",
};

export const TYPE_GRADIENTS: Record<string, string> = {
  fire: "from-[hsl(15,85%,55%)] to-[hsl(35,90%,50%)]",
  water: "from-[hsl(210,85%,55%)] to-[hsl(190,70%,60%)]",
  grass: "from-[hsl(140,60%,45%)] to-[hsl(100,50%,50%)]",
  electric: "from-[hsl(48,100%,55%)] to-[hsl(40,90%,50%)]",
  psychic: "from-[hsl(330,70%,60%)] to-[hsl(300,50%,55%)]",
  ice: "from-[hsl(190,70%,65%)] to-[hsl(200,60%,70%)]",
  dragon: "from-[hsl(260,70%,55%)] to-[hsl(280,60%,50%)]",
  dark: "from-[hsl(240,10%,25%)] to-[hsl(240,10%,35%)]",
  fairy: "from-[hsl(330,50%,70%)] to-[hsl(340,60%,65%)]",
  fighting: "from-[hsl(15,70%,45%)] to-[hsl(0,60%,50%)]",
  flying: "from-[hsl(230,50%,65%)] to-[hsl(250,40%,70%)]",
  poison: "from-[hsl(280,50%,50%)] to-[hsl(300,40%,45%)]",
  ground: "from-[hsl(35,50%,45%)] to-[hsl(40,40%,50%)]",
  rock: "from-[hsl(40,30%,40%)] to-[hsl(35,25%,45%)]",
  bug: "from-[hsl(75,60%,40%)] to-[hsl(90,50%,45%)]",
  ghost: "from-[hsl(260,30%,45%)] to-[hsl(270,40%,40%)]",
  steel: "from-[hsl(220,10%,60%)] to-[hsl(230,15%,55%)]",
  normal: "from-[hsl(30,10%,55%)] to-[hsl(30,10%,60%)]",
};
