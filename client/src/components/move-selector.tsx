import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { type MoveSlot, TYPE_COLORS } from "@/lib/pokemon-data";
import { getMoveDetails, formatMoveName, getVersionGroupForGame } from "@/lib/pokeapi";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Zap, Shield, Target } from "lucide-react";

interface Props {
  moveIndex: number;
  currentMove: MoveSlot | null;
  availableMoves: Array<{ name: string; learnMethod: string; level: number; moveUrl: string }>;
  game: string;
  requiredHMs: string[];
  hmRulesEnabled: boolean;
  onSelect: (move: MoveSlot) => void;
}

const CATEGORY_ICONS: Record<string, any> = {
  physical: Zap,
  special: Target,
  status: Shield,
};

const LEARN_METHOD_LABELS: Record<string, string> = {
  "level-up": "Level Up",
  "machine": "TM/HM",
  "egg": "Egg Move",
  "tutor": "Move Tutor",
};

export default function MoveSelector({
  moveIndex, currentMove, availableMoves, game,
  requiredHMs, hmRulesEnabled, onSelect
}: Props) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredMoves, setFilteredMoves] = useState(availableMoves);
  const [moveDetails, setMoveDetails] = useState<Map<string, any>>(new Map());
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setFilteredMoves(availableMoves);
      return;
    }
    const lower = query.toLowerCase();
    setFilteredMoves(
      availableMoves.filter(m => formatMoveName(m.name).toLowerCase().includes(lower))
    );
  }, [query, availableMoves]);

  const updatePos = useCallback(() => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
  }, []);

  useEffect(() => {
    if (!showDropdown) return;
    updatePos();
    window.addEventListener("scroll", updatePos, true);
    window.addEventListener("resize", updatePos);
    return () => {
      window.removeEventListener("scroll", updatePos, true);
      window.removeEventListener("resize", updatePos);
    };
  }, [showDropdown, updatePos]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current && !containerRef.current.contains(e.target as Node) &&
        (!dropdownRef.current || !dropdownRef.current.contains(e.target as Node))
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelectMove = useCallback(async (moveEntry: typeof availableMoves[0]) => {
    try {
      const details = await getMoveDetails(moveEntry.name);
      const hmNames = requiredHMs.map(h => h.toLowerCase().replace(/ /g, "-"));
      const isHM = hmNames.includes(moveEntry.name.toLowerCase());

      let learnDetail = "";
      if (moveEntry.learnMethod === "level-up") {
        learnDetail = moveEntry.level > 0 ? `Level ${moveEntry.level}` : "Level 1 / Evolution";
      } else if (moveEntry.learnMethod === "machine") {
        // Try to find TM/HM number
        const vg = getVersionGroupForGame(game);
        const machineEntry = details.machines?.find((m: any) => m.version_group.name === vg);
        if (machineEntry) {
          try {
            const machineRes = await fetch(machineEntry.machine.url);
            const machineData = await machineRes.json();
            const itemName = machineData.item.name.toUpperCase().replace("-", "");
            learnDetail = isHM ? `${itemName} (HM)` : itemName;
          } catch {
            learnDetail = isHM ? "HM" : "TM";
          }
        } else {
          learnDetail = isHM ? "HM" : "TM";
        }
      } else if (moveEntry.learnMethod === "egg") {
        learnDetail = "Egg Move (breed)";
      } else if (moveEntry.learnMethod === "tutor") {
        learnDetail = "Move Tutor";
      }

      const move: MoveSlot = {
        name: formatMoveName(moveEntry.name),
        type: details.type.name,
        category: details.damage_class.name,
        power: details.power,
        accuracy: details.accuracy,
        pp: details.pp,
        learnMethod: moveEntry.learnMethod,
        learnDetail,
        isHM,
      };

      onSelect(move);
      setShowDropdown(false);
      setQuery("");
    } catch (err) {
      console.error("Error loading move:", err);
    }
  }, [game, requiredHMs, onSelect]);

  // Current move display
  if (currentMove?.name) {
    const CatIcon = CATEGORY_ICONS[currentMove.category] || Zap;
    return (
      <div className="flex items-center gap-2 bg-muted/30 rounded-lg p-2.5 group">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <Badge
            className="text-[9px] px-1.5 py-0 h-4 text-white border-0 shrink-0"
            style={{ backgroundColor: TYPE_COLORS[currentMove.type] || "#888" }}
          >
            {currentMove.type}
          </Badge>
          <CatIcon className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium truncate">{currentMove.name}</span>
          {currentMove.isHM && (
            <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-primary/50 text-primary shrink-0">HM</Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground shrink-0">
          {currentMove.power && <span>Pwr: {currentMove.power}</span>}
          {currentMove.accuracy && <span>Acc: {currentMove.accuracy}</span>}
          <span>PP: {currentMove.pp}</span>
        </div>
        <div className="text-[9px] text-muted-foreground bg-muted rounded px-1.5 py-0.5 shrink-0">
          {currentMove.learnDetail || LEARN_METHOD_LABELS[currentMove.learnMethod] || currentMove.learnMethod}
        </div>
        <button
          onClick={() => onSelect({ name: "", type: "", category: "", power: null, accuracy: null, pp: 0, learnMethod: "", learnDetail: "", isHM: false })}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
          data-testid={`clear-move-${moveIndex}`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // Move search
  return (
    <div ref={containerRef} className="relative">
      <Input
        ref={inputRef}
        data-testid={`move-search-${moveIndex}`}
        placeholder={`Move ${moveIndex + 1}...`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        className="h-8 text-xs"
      />

      {showDropdown && dropdownPos && createPortal(
        <div
          ref={dropdownRef}
          style={{ position: "fixed", top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width, zIndex: 9999 }}
          className="bg-popover border border-border rounded-lg shadow-lg overflow-hidden"
        >
          <div className="max-h-[250px] overflow-y-auto">
            {filteredMoves.length === 0 && (
              <div className="p-2.5 text-xs text-muted-foreground text-center">
                {availableMoves.length === 0 ? "Select a Pokemon first" : "No moves found"}
              </div>
            )}
            {filteredMoves.slice(0, 50).map((m, i) => {
              const hmNames = requiredHMs.map(h => h.toLowerCase().replace(/ /g, "-"));
              const isHM = hmNames.includes(m.name.toLowerCase());
              return (
                <button
                  key={`${m.name}-${m.learnMethod}-${i}`}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 hover:bg-accent text-left transition-colors"
                  onClick={() => handleSelectMove(m)}
                >
                  <span className="text-xs font-medium flex-1">{formatMoveName(m.name)}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {m.learnMethod === "level-up" && m.level > 0 ? `Lv.${m.level}` : ""}
                    {m.learnMethod === "machine" ? (isHM ? "HM" : "TM") : ""}
                    {m.learnMethod === "egg" ? "Egg" : ""}
                    {m.learnMethod === "tutor" ? "Tutor" : ""}
                    {m.learnMethod === "level-up" && m.level === 0 ? "Lv.1" : ""}
                  </span>
                  {isHM && (
                    <Badge variant="outline" className="text-[8px] px-1 py-0 h-3.5 border-primary/50 text-primary">HM</Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
