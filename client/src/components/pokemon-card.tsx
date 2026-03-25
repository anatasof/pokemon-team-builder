import { useState, useEffect, useCallback } from "react";
import { type PokemonSlot, type MoveSlot, NATURES, TYPE_COLORS, computeMoveCoverage, isPokemonAvailableInGeneration, GENERATIONS } from "@/lib/pokemon-data";
import {
  getPokemonDetails, getSpeciesDetails, getPokemonEncounters, getMoveDetails,
  searchPokemon, formatPokemonName, formatMoveName, formatLocationName,
  getPokemonMovesForGame, getVersionGroupForGame, type PokeAPIPokemon
} from "@/lib/pokeapi";
import PokemonSearch from "@/components/pokemon-search";
import MoveSelector from "@/components/move-selector";
import NatureIVEditor from "@/components/nature-iv-editor";
import LocationInfo from "@/components/location-info";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, ChevronDown, ChevronUp, Info, Swords, MapPin, Sparkles, AlertTriangle } from "lucide-react";

interface Props {
  index: number;
  pokemon: PokemonSlot;
  generation: number;
  game: string;
  mode: "playthrough" | "competitive";
  requiredHMs: string[];
  hmRulesEnabled: boolean;
  onUpdate: (pokemon: PokemonSlot) => void;
  onClear: () => void;
}

export default function PokemonCard({
  index, pokemon, generation, game, mode,
  requiredHMs, hmRulesEnabled, onUpdate, onClear
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rawPokemon, setRawPokemon] = useState<PokeAPIPokemon | null>(null);
  const [availableMoves, setAvailableMoves] = useState<Array<{
    name: string; learnMethod: string; level: number; moveUrl: string;
  }>>([]);

  const versionGroup = getVersionGroupForGame(game);

  // Reload available moves whenever the pokemon or game changes
  useEffect(() => {
    if (!rawPokemon) { setAvailableMoves([]); return; }
    const vg = getVersionGroupForGame(game);
    getPokemonMovesForGame(rawPokemon, vg).then(setAvailableMoves);
  }, [rawPokemon, game]);

  const handleSelectPokemon = useCallback(async (name: string, id: number) => {
    setLoading(true);
    try {
      const [details, species, encounters] = await Promise.all([
        getPokemonDetails(id),
        getSpeciesDetails(id),
        getPokemonEncounters(id).catch(() => []),
      ]);

      setRawPokemon(details);

      const types = details.types.map(t => t.type.name);
      const stats = {
        hp: details.stats.find(s => s.stat.name === "hp")?.base_stat || 0,
        attack: details.stats.find(s => s.stat.name === "attack")?.base_stat || 0,
        defense: details.stats.find(s => s.stat.name === "defense")?.base_stat || 0,
        spAtk: details.stats.find(s => s.stat.name === "special-attack")?.base_stat || 0,
        spDef: details.stats.find(s => s.stat.name === "special-defense")?.base_stat || 0,
        speed: details.stats.find(s => s.stat.name === "speed")?.base_stat || 0,
      };
      const abilities = details.abilities.map(a => 
        formatPokemonName(a.ability.name) + (a.is_hidden ? " (Hidden)" : "")
      );

      // Parse encounters for this game
      const gameVersion = game.replace(/-/g, "");
      const locations = encounters
        .filter((enc: any) => enc.version_details.some((vd: any) => {
          const vName = vd.version.name.replace(/-/g, "");
          return vName === gameVersion || vName === game;
        }))
        .map((enc: any) => ({
          game: game,
          method: "wild",
          location: formatLocationName(enc.location_area.name),
          details: enc.version_details
            .filter((vd: any) => {
              const vName = vd.version.name.replace(/-/g, "");
              return vName === gameVersion || vName === game;
            })
            .map((vd: any) => {
              const method = vd.encounter_details[0]?.method?.name || "unknown";
              const minLvl = vd.encounter_details[0]?.min_level || "?";
              const maxLvl = vd.encounter_details[0]?.max_level || "?";
              return `${formatPokemonName(method)} (Lv. ${minLvl}-${maxLvl})`;
            })
            .join(", "),
        }));

      onUpdate({
        ...pokemon,
        id,
        name: formatPokemonName(name),
        sprite: details.sprites.other?.["official-artwork"]?.front_default || details.sprites.front_default || "",
        types,
        stats,
        abilities,
        moves: pokemon.moves.length > 0 ? pokemon.moves : [],
        locations,
      });
      setExpanded(true);
    } catch (err) {
      console.error("Error loading pokemon:", err);
    } finally {
      setLoading(false);
    }
  }, [game, versionGroup, onUpdate, pokemon]);

  // Empty slot
  if (!pokemon.name) {
    return (
      <Card className="border-dashed border-2 border-border/60 bg-card/50 hover:border-primary/30 transition-colors">
        <CardContent className="p-4">
          <div className="text-xs text-muted-foreground mb-2 font-medium">Slot {index + 1}</div>
          <PokemonSearch
            generation={generation}
            onSelect={handleSelectPokemon}
          />
        </CardContent>
      </Card>
    );
  }

  const moveCoverage = computeMoveCoverage(pokemon.moves);
  const coveredTypes = Object.entries(moveCoverage).filter(([_, v]) => v > 0).map(([k]) => k);
  const isPokemonInGen = isPokemonAvailableInGeneration(pokemon.id, generation);

  return (
    <Card className="bg-card border border-border overflow-hidden">
      {/* Pokemon Header */}
      <div
        className="p-4 cursor-pointer flex items-center gap-3 hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
        data-testid={`pokemon-card-header-${index}`}
      >
        {pokemon.sprite && (
          <img
            src={pokemon.sprite}
            alt={pokemon.name}
            className="w-14 h-14 object-contain"
            crossOrigin="anonymous"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{pokemon.name}</span>
            <span className="text-xs text-muted-foreground">#{pokemon.id}</span>
            {!isPokemonInGen && (
              <span className="flex items-center gap-1 text-[10px] text-amber-500 font-medium">
                <AlertTriangle className="w-3 h-3" />
                Not in Gen {generation}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            {pokemon.types.map(type => (
              <Badge
                key={type}
                className="text-[10px] px-1.5 py-0 h-5 font-medium text-white border-0"
                style={{ backgroundColor: TYPE_COLORS[type] || "#888" }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
            <span>{pokemon.moves.filter(m => m.name).length}/4 moves</span>
            <span className="text-border">·</span>
            <span>{pokemon.nature}</span>
            {mode === "competitive" && (
              <>
                <span className="text-border">·</span>
                <span>{Object.values(pokemon.evs).reduce((a, b) => a + b, 0)}/510 EVs</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            data-testid={`clear-pokemon-${index}`}
          >
            <X className="w-4 h-4" />
          </Button>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-border">
          <Tabs defaultValue="moves" className="w-full">
            <TabsList className="w-full rounded-none border-b border-border bg-transparent h-auto p-0">
              <TabsTrigger value="moves" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs py-2.5">
                <Swords className="w-3.5 h-3.5 mr-1" /> Moves
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs py-2.5">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Stats
              </TabsTrigger>
              <TabsTrigger value="info" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs py-2.5">
                <MapPin className="w-3.5 h-3.5 mr-1" /> Location
              </TabsTrigger>
            </TabsList>

            <TabsContent value="moves" className="p-4 mt-0 space-y-3">
              {[0, 1, 2, 3].map(moveIndex => (
                <MoveSelector
                  key={moveIndex}
                  moveIndex={moveIndex}
                  currentMove={pokemon.moves[moveIndex] || null}
                  availableMoves={availableMoves}
                  game={game}
                  requiredHMs={requiredHMs}
                  hmRulesEnabled={hmRulesEnabled && mode === "playthrough"}
                  onSelect={(move) => {
                    const newMoves = [...pokemon.moves];
                    while (newMoves.length <= moveIndex) {
                      newMoves.push({ name: "", type: "", category: "", power: null, accuracy: null, pp: 0, learnMethod: "", learnDetail: "", isHM: false });
                    }
                    newMoves[moveIndex] = move;
                    onUpdate({ ...pokemon, moves: newMoves });
                  }}
                />
              ))}

              {/* Move Coverage Summary */}
              {pokemon.moves.filter(m => m.name).length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="text-[10px] font-medium text-muted-foreground mb-1.5">MOVE COVERAGE (SUPER EFFECTIVE)</div>
                  <div className="flex flex-wrap gap-1">
                    {coveredTypes.map(type => (
                      <Badge
                        key={type}
                        className="text-[9px] px-1 py-0 h-4 text-white border-0"
                        style={{ backgroundColor: TYPE_COLORS[type] || "#888" }}
                      >
                        {type}
                      </Badge>
                    ))}
                    {coveredTypes.length === 0 && (
                      <span className="text-[10px] text-muted-foreground">No offensive moves selected</span>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="stats" className="p-4 mt-0">
              <NatureIVEditor
                pokemon={pokemon}
                mode={mode}
                generation={generation}
                onUpdate={onUpdate}
              />
            </TabsContent>

            <TabsContent value="info" className="p-4 mt-0">
              <LocationInfo
                pokemon={pokemon}
                game={game}
                generation={generation}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </Card>
  );
}
