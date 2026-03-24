import { TYPE_COLORS } from "@/lib/pokemon-data";
import { Badge } from "@/components/ui/badge";

interface Props {
  coverage: {
    superEffective: Record<string, number>;
    resistances: Record<string, number>;
    weaknesses: Record<string, number>;
    immunities: Record<string, number>;
    uncovered: string[];
  };
  mode: "playthrough" | "competitive";
}

const ALL_TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy",
];

export default function TeamCoverage({ coverage, mode }: Props) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <h3 className="text-sm font-semibold">Type Coverage</h3>

      {/* Offensive Coverage */}
      <div>
        <div className="text-[10px] font-medium text-muted-foreground mb-2">OFFENSIVE (SUPER EFFECTIVE COVERAGE)</div>
        <div className="grid grid-cols-6 gap-1">
          {ALL_TYPES.map(type => {
            const count = coverage.superEffective[type] || 0;
            const isUncovered = count === 0;
            return (
              <div
                key={type}
                className={`rounded-md p-1.5 text-center transition-colors ${
                  isUncovered ? "bg-destructive/10 border border-destructive/20" : "bg-muted/50"
                }`}
              >
                <div
                  className="text-[8px] font-bold text-white rounded px-1 py-0.5 mx-auto w-fit"
                  style={{ backgroundColor: TYPE_COLORS[type] || "#888" }}
                >
                  {type.slice(0, 3).toUpperCase()}
                </div>
                <div className={`text-[10px] font-mono mt-0.5 ${
                  isUncovered ? "text-destructive" : count >= 2 ? "text-green-600 dark:text-green-400" : "text-foreground"
                }`}>
                  {count}×
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Defensive Profile */}
      <div>
        <div className="text-[10px] font-medium text-muted-foreground mb-2">DEFENSIVE PROFILE</div>
        <div className="grid grid-cols-6 gap-1">
          {ALL_TYPES.map(type => {
            const weak = coverage.weaknesses[type] || 0;
            const resist = coverage.resistances[type] || 0;
            const immune = coverage.immunities[type] || 0;

            let bgClass = "bg-muted/50";
            let textClass = "text-foreground";
            if (weak >= 3) { bgClass = "bg-destructive/10 border border-destructive/20"; textClass = "text-destructive"; }
            else if (immune > 0) { bgClass = "bg-primary/10"; textClass = "text-primary"; }
            else if (resist >= 2) { bgClass = "bg-green-500/10"; textClass = "text-green-600 dark:text-green-400"; }

            return (
              <div key={type} className={`rounded-md p-1.5 text-center ${bgClass}`}>
                <div
                  className="text-[8px] font-bold text-white rounded px-1 py-0.5 mx-auto w-fit"
                  style={{ backgroundColor: TYPE_COLORS[type] || "#888" }}
                >
                  {type.slice(0, 3).toUpperCase()}
                </div>
                <div className="flex items-center justify-center gap-0.5 mt-0.5">
                  {immune > 0 && <span className="text-[9px] text-primary font-bold">0</span>}
                  {resist > 0 && <span className="text-[9px] text-green-600 dark:text-green-400">{resist}R</span>}
                  {weak > 0 && <span className={`text-[9px] ${textClass}`}>{weak}W</span>}
                  {immune === 0 && resist === 0 && weak === 0 && <span className="text-[9px] text-muted-foreground">—</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-[9px] text-muted-foreground pt-2 border-t border-border">
        <span><span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1" />Resists</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-destructive mr-1" />Weak</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-primary mr-1" />Immune</span>
      </div>
    </div>
  );
}
