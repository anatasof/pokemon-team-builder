import { type PokemonSlot } from "@/lib/pokemon-data";
import { MessageSquare, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface Props {
  team: PokemonSlot[];
  coverage: {
    superEffective: Record<string, number>;
    resistances: Record<string, number>;
    weaknesses: Record<string, number>;
    immunities: Record<string, number>;
    uncovered: string[];
    comments: string[];
  };
  mode: "playthrough" | "competitive";
  hmCoverage: {
    covered: string[];
    missing: string[];
    assignments: Record<string, string>;
  } | null;
  requiredHMs: string[];
}

export default function TeamComments({ team, coverage, mode, hmCoverage, requiredHMs }: Props) {
  const activePokemon = team.filter(p => p.name);
  const comments: Array<{ type: "info" | "warning" | "success"; text: string }> = [];

  // Type coverage comments
  coverage.comments.forEach(c => {
    if (c.includes("Excellent") || c.includes("Good")) {
      comments.push({ type: "success", text: c });
    } else if (c.includes("weakness") || c.includes("lacks") || c.includes("low type")) {
      comments.push({ type: "warning", text: c });
    } else {
      comments.push({ type: "info", text: c });
    }
  });

  // HM comments
  if (hmCoverage && mode === "playthrough") {
    if (hmCoverage.missing.length === 0 && requiredHMs.length > 0) {
      comments.push({ type: "success", text: "All required HMs are covered by your team." });
    } else if (hmCoverage.missing.length > 0) {
      comments.push({
        type: "warning",
        text: `Your team is missing HMs: ${hmCoverage.missing.join(", ")}. You'll need additional Pokémon or an HM slave for progression.`,
      });
    }
  }

  // Individual Pokemon analysis
  activePokemon.forEach(p => {
    const movesWithStab = p.moves.filter(m => 
      m.name && m.category !== "status" && p.types.includes(m.type)
    );
    if (p.moves.filter(m => m.name).length > 0 && movesWithStab.length === 0) {
      comments.push({
        type: "info",
        text: `${p.name} has no STAB (Same Type Attack Bonus) moves. Consider adding a ${p.types.join(" or ")}-type attack for 1.5x damage bonus.`,
      });
    }

    // Check for all same-type moves
    const offensiveMoves = p.moves.filter(m => m.name && m.category !== "status");
    if (offensiveMoves.length >= 3) {
      const moveTypes = new Set(offensiveMoves.map(m => m.type));
      if (moveTypes.size === 1) {
        comments.push({
          type: "warning",
          text: `${p.name} only has ${offensiveMoves[0].type}-type attacking moves. Diverse move types improve coverage.`,
        });
      }
    }

    // Nature recommendations
    if (mode === "competitive") {
      const bst = Object.values(p.stats).reduce((a, b) => a + b, 0);
      if (p.stats.attack > p.stats.spAtk && p.nature === "Modest") {
        comments.push({
          type: "info",
          text: `${p.name} has higher Attack than Sp. Atk but a Modest nature (-Atk/+SpAtk). Consider Adamant or Jolly instead.`,
        });
      }
      if (p.stats.spAtk > p.stats.attack && p.nature === "Adamant") {
        comments.push({
          type: "info",
          text: `${p.name} has higher Sp. Atk than Attack but an Adamant nature (-SpAtk/+Atk). Consider Modest or Timid instead.`,
        });
      }

      const totalEVs = Object.values(p.evs).reduce((a, b) => a + b, 0);
      if (totalEVs > 0 && totalEVs < 510) {
        comments.push({
          type: "info",
          text: `${p.name} has ${510 - totalEVs} unused EVs. Distribute them for maximum effectiveness.`,
        });
      }
    }
  });

  // Team balance
  if (activePokemon.length >= 3) {
    const allPhysical = activePokemon.every(p => p.stats.attack >= p.stats.spAtk);
    const allSpecial = activePokemon.every(p => p.stats.spAtk >= p.stats.attack);
    if (allPhysical) {
      comments.push({
        type: "warning",
        text: "All your Pokémon are physically-oriented. A special attacker would help against physically defensive opponents.",
      });
    }
    if (allSpecial) {
      comments.push({
        type: "warning",
        text: "All your Pokémon are specially-oriented. A physical attacker would help against specially defensive opponents.",
      });
    }
  }

  if (activePokemon.length < 3) {
    comments.push({
      type: "info",
      text: "Add more Pokémon to see team coverage analysis and recommendations.",
    });
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "warning": return <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />;
      case "success": return <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />;
      default: return <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold">Team Analysis</h3>
      </div>

      <div className="space-y-2">
        {comments.map((c, i) => (
          <div key={i} className="flex items-start gap-2">
            {getIcon(c.type)}
            <p className="text-xs text-foreground/80 leading-relaxed">{c.text}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-xs text-muted-foreground">Select Pokémon and moves to see team analysis.</p>
        )}
      </div>
    </div>
  );
}
