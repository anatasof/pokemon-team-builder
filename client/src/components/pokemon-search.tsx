import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { searchPokemon, getPokemonForGeneration, formatPokemonName } from "@/lib/pokeapi";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Props {
  generation: number;
  onSelect: (name: string, id: number) => void;
}

export default function PokemonSearch({ generation, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Array<{ name: string; id: number; sprite: string }>>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [genPokemon, setGenPokemon] = useState<Array<{ name: string; id: number; sprite: string }>>([]);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Load generation pokemon list
  useEffect(() => {
    let cancelled = false;
    getPokemonForGeneration(generation).then(data => {
      if (!cancelled) setGenPokemon(data);
    });
    return () => { cancelled = true; };
  }, [generation]);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    if (!value.trim()) {
      setResults(genPokemon.slice(0, 30));
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const lower = value.toLowerCase();
      // Filter from gen pokemon first
      const localResults = genPokemon.filter(p => 
        p.name.includes(lower) || String(p.id) === lower
      ).slice(0, 20);
      
      if (localResults.length > 0) {
        setResults(localResults);
      } else {
        const apiResults = await searchPokemon(value);
        setResults(apiResults);
      }
      setLoading(false);
    }, 200);
  }, [genPokemon]);

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

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          ref={inputRef}
          data-testid="pokemon-search-input"
          placeholder="Search Pokémon by name or #..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => {
            setShowDropdown(true);
            if (!query && results.length === 0) {
              setResults(genPokemon.slice(0, 30));
            }
          }}
          className="pl-8 h-9 text-sm"
        />
      </div>

      {showDropdown && dropdownPos && createPortal(
        <div
          ref={dropdownRef}
          style={{ position: "fixed", top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width, zIndex: 9999 }}
          className="bg-popover border border-border rounded-lg shadow-lg overflow-hidden"
        >
          <div className="max-h-[280px] overflow-y-auto">
            {loading && (
              <div className="p-3 text-xs text-muted-foreground text-center">Searching...</div>
            )}
            {!loading && results.length === 0 && query && (
              <div className="p-3 text-xs text-muted-foreground text-center">No Pokémon found</div>
            )}
            {results.map(p => (
              <button
                key={p.id}
                data-testid={`pokemon-option-${p.id}`}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-accent text-left transition-colors"
                onClick={() => {
                  onSelect(p.name, p.id);
                  setShowDropdown(false);
                  setQuery("");
                }}
              >
                <img
                  src={p.sprite}
                  alt={p.name}
                  className="w-8 h-8 object-contain"
                  crossOrigin="anonymous"
                  loading="lazy"
                />
                <div>
                  <div className="text-sm font-medium">{formatPokemonName(p.name)}</div>
                  <div className="text-[10px] text-muted-foreground">#{String(p.id).padStart(3, "0")}</div>
                </div>
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
