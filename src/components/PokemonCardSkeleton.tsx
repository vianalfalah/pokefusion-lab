const PokemonCardSkeleton = () => (
  <div className="glass rounded-2xl p-5">
    <div className="skeleton-pulse w-full aspect-square rounded-xl mb-3" />
    <div className="skeleton-pulse h-4 w-2/3 mb-2" />
    <div className="flex gap-1.5">
      <div className="skeleton-pulse h-5 w-14 rounded-full" />
      <div className="skeleton-pulse h-5 w-14 rounded-full" />
    </div>
  </div>
);

export default PokemonCardSkeleton;
