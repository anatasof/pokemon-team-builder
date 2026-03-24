import { Badge } from "@/components/ui/badge";
import { Check, AlertTriangle } from "lucide-react";

interface Props {
  requiredHMs: string[];
  hmCoverage: {
    covered: string[];
    missing: string[];
    assignments: Record<string, string>;
  };
  gameName: string;
}

export default function HMTracker({ requiredHMs, hmCoverage, gameName }: Props) {
  const allCovered = hmCoverage.missing.length === 0;

  return (
    <div className={`rounded-lg border p-4 ${
      allCovered ? "border-green-500/30 bg-green-500/5" : "border-amber-500/30 bg-amber-500/5"
    }`}>
      <div className="flex items-center gap-2 mb-3">
        {allCovered ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-amber-500" />
        )}
        <span className="text-xs font-semibold">
          HM Coverage for {gameName}
        </span>
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 ml-auto">
          {hmCoverage.covered.length}/{requiredHMs.length}
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        {requiredHMs.map(hm => {
          const isCovered = hmCoverage.covered.includes(hm);
          const assignedTo = hmCoverage.assignments[hm];
          return (
            <div
              key={hm}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs ${
                isCovered
                  ? "bg-green-500/10 text-green-700 dark:text-green-400"
                  : "bg-muted/50 text-muted-foreground"
              }`}
            >
              {isCovered ? (
                <Check className="w-3 h-3" />
              ) : (
                <div className="w-3 h-3 rounded-full border border-current" />
              )}
              <span className="font-medium">{hm}</span>
              {assignedTo && (
                <span className="text-[9px] ml-auto opacity-60">{assignedTo}</span>
              )}
            </div>
          );
        })}
      </div>

      {hmCoverage.missing.length > 0 && (
        <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-2">
          Missing: {hmCoverage.missing.join(", ")}. Add Pokémon with these moves to complete your playthrough team.
        </p>
      )}
    </div>
  );
}
