import { useState, useEffect, useRef, useCallback } from "react";
import { searchPokemon, getPokemonForGeneration, formatPokemonName } from "@/lib/pokeapi";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const containerRef = useRef<HTMLDivElement>(null);
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

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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
          data-testid="pokemon-search-input"
          placeholder="Search Pokemon by name or #..."
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

      {showDropdown && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
          <ScrollArea className="max-h-[280px]">
            {loading && (
              <div className="p-3 text-xs text-muted-foreground text-center">Searching...</div>
            )}
            {!loading && results.length === 0 && query && (
              <div className="p-3 text-xs text-muted-foreground text-center">No Pokemon found</div>
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
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
