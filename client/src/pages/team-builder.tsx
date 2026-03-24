import { useState, useCallback } from "react";
import { GENERATIONS, NATURES, getEmptyPokemonSlot, getHMsForGame, computeTypeCoverage, checkHMCoverage, type PokemonSlot, type MoveSlot, type Game } from "@/lib/pokemon-data";
import GenerationSelector from "@/components/generation-selector";
import PokemonCard from "@/components/pokemon-card";
import TeamCoverage from "@/components/team-coverage";
import HMTracker from "@/components/hm-tracker";
import TeamComments from "@/components/team-comments";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Swords, Map, Shield } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import AppFooter from "@/components/app-footer";

export default function TeamBuilder() {
  const [generation, setGeneration] = useState(1);
  const [game, setGame] = useState("red");
  const [mode, setMode] = useState<"playthrough" | "competitive">("playthrough");
  const [hmRulesEnabled, setHmRulesEnabled] = useState(true);
  const [team, setTeam] = useState<PokemonSlot[]>(
    Array.from({ length: 6 }, () => getEmptyPokemonSlot())
  );

  const currentGen = GENERATIONS.find(g => g.id === generation)!;
  const currentGame = currentGen.games.find(g => g.id === game) || currentGen.games[0];
  const requiredHMs = getHMsForGame(currentGame.id);
  const hasHMs = requiredHMs.length > 0;

  const teamTypes = team
    .filter(p => p.name)
    .map(p => p.types);

  const coverage = computeTypeCoverage(teamTypes);
  const hmCoverage = hmRulesEnabled && mode === "playthrough" ? checkHMCoverage(team, requiredHMs) : null;

  const handleGenerationChange = useCallback((genId: number) => {
    setGeneration(genId);
    const gen = GENERATIONS.find(g => g.id === genId)!;
    setGame(gen.games[0].id);
    setTeam(Array.from({ length: 6 }, () => getEmptyPokemonSlot()));
  }, []);

  const handleGameChange = useCallback((gameId: string) => {
    setGame(gameId);
    setTeam(Array.from({ length: 6 }, () => getEmptyPokemonSlot()));
  }, []);

  const handlePokemonUpdate = useCallback((index: number, pokemon: PokemonSlot) => {
    setTeam(prev => {
      const next = [...prev];
      next[index] = pokemon;
      return next;
    });
  }, []);

  const handleClearSlot = useCallback((index: number) => {
    setTeam(prev => {
      const next = [...prev];
      next[index] = getEmptyPokemonSlot();
      return next;
    });
  }, []);

  const activePokemonCount = team.filter(p => p.name).length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-semibold tracking-tight truncate">Pokémon Team Builder</h1>
              <p className="text-xs text-muted-foreground truncate hidden sm:block">{currentGen.name} · {currentGen.region}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Mode Toggle */}
            <div className="flex items-center gap-1 sm:gap-2 bg-muted/50 rounded-lg px-2 sm:px-3 py-1.5">
              <button
                data-testid="mode-playthrough"
                onClick={() => setMode("playthrough")}
                className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  mode === "playthrough"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Map className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Playthrough</span>
              </button>
              <button
                data-testid="mode-competitive"
                onClick={() => setMode("competitive")}
                className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  mode === "competitive"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Swords className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Competitive</span>
              </button>
            </div>

            <ThemeToggle />
            <Badge variant="secondary" className="text-xs">
              {activePokemonCount}/6
            </Badge>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {/* Generation & Game Selector */}
        <GenerationSelector
          generation={generation}
          game={game}
          onGenerationChange={handleGenerationChange}
          onGameChange={handleGameChange}
        />

        {/* HM Rules Toggle (Playthrough mode only) */}
        {mode === "playthrough" && hasHMs && (
          <div className="flex items-center justify-between bg-card rounded-lg border border-border p-4 gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Shield className="w-5 h-5 text-primary shrink-0" />
              <div className="min-w-0">
                <Label className="text-sm font-medium">HM Coverage Rules</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Require all HMs to be covered across team members for {currentGame.name}
                </p>
              </div>
            </div>
            <Switch
              data-testid="hm-rules-toggle"
              checked={hmRulesEnabled}
              onCheckedChange={setHmRulesEnabled}
            />
          </div>
        )}

        {/* HM Tracker */}
        {mode === "playthrough" && hmRulesEnabled && hasHMs && hmCoverage && (
          <HMTracker
            requiredHMs={requiredHMs}
            hmCoverage={hmCoverage}
            gameName={currentGame.name}
          />
        )}

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {team.map((pokemon, index) => (
            <PokemonCard
              key={index}
              index={index}
              pokemon={pokemon}
              generation={generation}
              game={game}
              mode={mode}
              requiredHMs={requiredHMs}
              hmRulesEnabled={hmRulesEnabled}
              onUpdate={(p) => handlePokemonUpdate(index, p)}
              onClear={() => handleClearSlot(index)}
            />
          ))}
        </div>

        {/* Coverage & Analysis */}
        {activePokemonCount > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TeamCoverage coverage={coverage} mode={mode} />
            <TeamComments
              team={team}
              coverage={coverage}
              mode={mode}
              hmCoverage={hmCoverage}
              requiredHMs={requiredHMs}
            />
          </div>
        )}
      </main>

      <AppFooter />
    </div>
  );
}
