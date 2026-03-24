import { type PokemonSlot } from "@/lib/pokemon-data";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowLeftRight, Egg, TrendingUp } from "lucide-react";

interface Props {
  pokemon: PokemonSlot;
  game: string;
  generation: number;
}

const METHOD_ICONS: Record<string, any> = {
  wild: MapPin,
  gift: ArrowLeftRight,
  trade: ArrowLeftRight,
  evolve: TrendingUp,
  egg: Egg,
};

export default function LocationInfo({ pokemon, game, generation }: Props) {
  if (!pokemon.name) return null;

  return (
    <div className="space-y-3">
      <div className="text-xs font-medium text-muted-foreground">How to Obtain</div>

      {pokemon.locations.length > 0 ? (
        <div className="space-y-2">
          {pokemon.locations.map((loc, i) => {
            const Icon = METHOD_ICONS[loc.method] || MapPin;
            return (
              <div key={i} className="flex items-start gap-2 bg-muted/30 rounded-lg p-2.5">
                <Icon className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                <div>
                  <div className="text-xs font-medium">{loc.location}</div>
                  {loc.details && (
                    <div className="text-[10px] text-muted-foreground mt-0.5">{loc.details}</div>
                  )}
                  <Badge variant="secondary" className="text-[9px] px-1 py-0 h-3.5 mt-1">
                    {loc.method}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
          <p>Location data not available for this game version.</p>
          <p className="mt-1.5">This Pokémon may be obtainable through:</p>
          <ul className="mt-1 space-y-0.5 text-[10px]">
            <li>• Evolution from a pre-evolution</li>
            <li>• Trading from another game</li>
            <li>• In-game event or gift</li>
            <li>• Breeding (Egg)</li>
            <li>• Transfer from a previous generation</li>
          </ul>
        </div>
      )}

      {/* Pokedex Entry */}
      <div className="pt-2 border-t border-border">
        <div className="text-xs font-medium text-muted-foreground mb-1">Pokedex Info</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
          <div className="flex justify-between">
            <span className="text-muted-foreground">National #</span>
            <span className="font-mono">{String(pokemon.id).padStart(3, "0")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">BST</span>
            <span className="font-mono">{Object.values(pokemon.stats).reduce((a, b) => a + b, 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Types</span>
            <span>{pokemon.types.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(" / ")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
