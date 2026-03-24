import { type PokemonSlot, NATURES, calculateStat } from "@/lib/pokemon-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Props {
  pokemon: PokemonSlot;
  mode: "playthrough" | "competitive";
  onUpdate: (pokemon: PokemonSlot) => void;
}

const STAT_LABELS: Array<{ key: keyof PokemonSlot["stats"]; label: string; color: string }> = [
  { key: "hp", label: "HP", color: "#FF5959" },
  { key: "attack", label: "Attack", color: "#F5AC78" },
  { key: "defense", label: "Defense", color: "#FAE078" },
  { key: "spAtk", label: "Sp. Atk", color: "#9DB7F5" },
  { key: "spDef", label: "Sp. Def", color: "#A7DB8D" },
  { key: "speed", label: "Speed", color: "#FA92B2" },
];

const NATURE_STAT_MAP: Record<string, string> = {
  hp: "HP", attack: "Attack", defense: "Defense",
  spAtk: "Sp. Atk", spDef: "Sp. Def", speed: "Speed",
};

export default function NatureIVEditor({ pokemon, mode, onUpdate }: Props) {
  const currentNature = NATURES.find(n => n.name === pokemon.nature) || NATURES[0];

  const getNatureMultiplier = (statKey: string): number => {
    const statName = NATURE_STAT_MAP[statKey];
    if (currentNature.increased === statName) return 1.1;
    if (currentNature.decreased === statName) return 0.9;
    return 1.0;
  };

  const getNatureIndicator = (statKey: string): string => {
    const statName = NATURE_STAT_MAP[statKey];
    if (currentNature.increased === statName) return "↑";
    if (currentNature.decreased === statName) return "↓";
    return "";
  };

  const totalEVs = Object.values(pokemon.evs).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      {/* Nature Selector */}
      <div>
        <Label className="text-xs font-medium text-muted-foreground">Nature</Label>
        <Select
          value={pokemon.nature}
          onValueChange={(v) => onUpdate({ ...pokemon, nature: v })}
        >
          <SelectTrigger data-testid="select-nature" className="mt-1 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {NATURES.map(n => (
              <SelectItem key={n.name} value={n.name}>
                {n.name}{n.increased ? ` (+${n.increased} / -${n.decreased})` : " (Neutral)"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Base Stats */}
      <div>
        <div className="text-xs font-medium text-muted-foreground mb-2">Base Stats</div>
        <div className="space-y-1.5">
          {STAT_LABELS.map(({ key, label, color }) => {
            const base = pokemon.stats[key];
            const natureInd = getNatureIndicator(key);
            const pct = Math.min(100, (base / 255) * 100);

            return (
              <div key={key} className="flex items-center gap-2">
                <div className="w-16 text-[10px] font-medium text-right">
                  {label}
                  {natureInd && (
                    <span className={natureInd === "↑" ? "text-green-500 ml-0.5" : "text-red-400 ml-0.5"}>
                      {natureInd}
                    </span>
                  )}
                </div>
                <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
                <div className="w-8 text-[10px] font-mono text-right">{base}</div>
              </div>
            );
          })}
          <div className="flex items-center gap-2 mt-1 pt-1 border-t border-border">
            <div className="w-16 text-[10px] font-bold text-right">Total</div>
            <div className="flex-1" />
            <div className="w-8 text-[10px] font-mono font-bold text-right">
              {Object.values(pokemon.stats).reduce((a, b) => a + b, 0)}
            </div>
          </div>
        </div>
      </div>

      {/* IVs */}
      <div>
        <div className="text-xs font-medium text-muted-foreground mb-2">
          IVs {mode === "playthrough" && <span className="text-[10px] font-normal">(default: 31 for playthrough)</span>}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {STAT_LABELS.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-1.5">
              <label className="text-[10px] text-muted-foreground w-10">{label}</label>
              <Input
                data-testid={`iv-${key}`}
                type="number"
                min={0}
                max={31}
                value={pokemon.ivs[key]}
                onChange={(e) => {
                  const val = Math.min(31, Math.max(0, parseInt(e.target.value) || 0));
                  onUpdate({ ...pokemon, ivs: { ...pokemon.ivs, [key]: val } });
                }}
                className="h-6 text-[10px] w-full px-1.5 text-center"
              />
            </div>
          ))}
        </div>
      </div>

      {/* EVs (Competitive mode) */}
      {mode === "competitive" && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">EVs</span>
            <span className={`text-[10px] ${totalEVs > 510 ? "text-destructive" : "text-muted-foreground"}`}>
              {totalEVs}/510
            </span>
          </div>
          <div className="space-y-2">
            {STAT_LABELS.map(({ key, label, color }) => (
              <div key={key} className="flex items-center gap-2">
                <label className="w-12 text-[10px] text-muted-foreground text-right">{label}</label>
                <Slider
                  data-testid={`ev-slider-${key}`}
                  value={[pokemon.evs[key]]}
                  max={252}
                  step={4}
                  onValueChange={([val]) => {
                    onUpdate({ ...pokemon, evs: { ...pokemon.evs, [key]: val } });
                  }}
                  className="flex-1"
                />
                <Input
                  type="number"
                  min={0}
                  max={252}
                  step={4}
                  value={pokemon.evs[key]}
                  onChange={(e) => {
                    const val = Math.min(252, Math.max(0, parseInt(e.target.value) || 0));
                    onUpdate({ ...pokemon, evs: { ...pokemon.evs, [key]: val } });
                  }}
                  className="w-12 h-6 text-[10px] px-1.5 text-center"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Abilities */}
      {pokemon.abilities.length > 0 && (
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-1.5">Abilities</div>
          <div className="flex flex-wrap gap-1.5">
            {pokemon.abilities.map(a => (
              <span key={a} className="text-[10px] bg-muted rounded px-2 py-0.5">{a}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
