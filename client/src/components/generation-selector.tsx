import { GENERATIONS } from "@/lib/pokemon-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  generation: number;
  game: string;
  onGenerationChange: (genId: number) => void;
  onGameChange: (gameId: string) => void;
}

export default function GenerationSelector({ generation, game, onGenerationChange, onGameChange }: Props) {
  const currentGen = GENERATIONS.find(g => g.id === generation)!;

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex-1 min-w-[200px]">
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Generation</label>
        <Select value={String(generation)} onValueChange={(v) => onGenerationChange(parseInt(v))}>
          <SelectTrigger data-testid="select-generation" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {GENERATIONS.map(gen => (
              <SelectItem key={gen.id} value={String(gen.id)}>
                {gen.name} — {gen.region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-w-[200px]">
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Game</label>
        <Select value={game} onValueChange={onGameChange}>
          <SelectTrigger data-testid="select-game" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {currentGen.games.map(g => (
              <SelectItem key={g.id} value={g.id}>
                {g.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2.5">
        <span>Pokedex: #{currentGen.dexRange[0]} — #{currentGen.dexRange[1]}</span>
        <span className="text-border">|</span>
        <span>{currentGen.totalNew} new Pokémon</span>
        {currentGen.games.find(g => g.id === game)?.hmMoves.length ? (
          <>
            <span className="text-border">|</span>
            <span>{currentGen.games.find(g => g.id === game)!.hmMoves.length} HMs</span>
          </>
        ) : null}
      </div>
    </div>
  );
}
