// PokeAPI service layer with caching
const API_BASE = "https://pokeapi.co/api/v2";
const cache = new Map<string, any>();

async function fetchWithCache(url: string): Promise<any> {
  if (cache.has(url)) return cache.get(url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  cache.set(url, data);
  return data;
}

export interface PokeAPIPokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      "official-artwork": { front_default: string };
    };
  };
  types: Array<{ slot: number; type: { name: string } }>;
  stats: Array<{ base_stat: number; stat: { name: string } }>;
  abilities: Array<{ ability: { name: string; url: string }; is_hidden: boolean }>;
  moves: Array<{
    move: { name: string; url: string };
    version_group_details: Array<{
      level_learned_at: number;
      move_learn_method: { name: string };
      version_group: { name: string };
    }>;
  }>;
  species: { url: string };
}

export interface PokeAPIMove {
  id: number;
  name: string;
  type: { name: string };
  damage_class: { name: string };
  power: number | null;
  accuracy: number | null;
  pp: number;
  effect_entries: Array<{ effect: string; short_effect: string; language: { name: string } }>;
  machines: Array<{
    machine: { url: string };
    version_group: { name: string };
  }>;
}

export interface PokeAPIMachine {
  id: number;
  item: { name: string };
  move: { name: string };
  version_group: { name: string };
}

export interface PokeAPISpecies {
  id: number;
  name: string;
  generation: { name: string };
  flavor_text_entries: Array<{ flavor_text: string; language: { name: string }; version: { name: string } }>;
  egg_groups: Array<{ name: string }>;
  evolution_chain: { url: string };
  varieties: Array<{ is_default: boolean; pokemon: { name: string; url: string } }>;
}

export interface PokemonEncounter {
  location_area: { name: string; url: string };
  version_details: Array<{
    max_chance: number;
    version: { name: string };
    encounter_details: Array<{
      chance: number;
      method: { name: string };
      min_level: number;
      max_level: number;
    }>;
  }>;
}

export async function searchPokemon(query: string, limit = 20): Promise<Array<{ name: string; id: number; sprite: string }>> {
  try {
    // First try direct ID or name
    const lower = query.toLowerCase().trim();
    if (lower) {
      try {
        const pokemon = await fetchWithCache(`${API_BASE}/pokemon/${lower}`);
        return [{
          name: pokemon.name,
          id: pokemon.id,
          sprite: pokemon.sprites.front_default || pokemon.sprites.other?.["official-artwork"]?.front_default || "",
        }];
      } catch {
        // Not found by direct lookup, search in the list
      }
    }

    // Fetch a chunk of pokemon and filter
    if (!cache.has("pokemon-list-full")) {
      const data = await fetchWithCache(`${API_BASE}/pokemon?limit=1025&offset=0`);
      cache.set("pokemon-list-full", data.results);
    }
    const allPokemon = cache.get("pokemon-list-full") as Array<{ name: string; url: string }>;
    
    const filtered = allPokemon.filter(p => p.name.includes(lower)).slice(0, limit);
    return filtered.map(p => {
      const id = parseInt(p.url.split("/").filter(Boolean).pop() || "0");
      return {
        name: p.name,
        id,
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      };
    });
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}

export async function getPokemonDetails(idOrName: string | number): Promise<PokeAPIPokemon> {
  return fetchWithCache(`${API_BASE}/pokemon/${idOrName}`);
}

export async function getMoveDetails(nameOrId: string | number): Promise<PokeAPIMove> {
  return fetchWithCache(`${API_BASE}/move/${nameOrId}`);
}

export async function getSpeciesDetails(nameOrId: string | number): Promise<PokeAPISpecies> {
  return fetchWithCache(`${API_BASE}/pokemon-species/${nameOrId}`);
}

export async function getPokemonEncounters(id: number): Promise<PokemonEncounter[]> {
  return fetchWithCache(`${API_BASE}/pokemon/${id}/encounters`);
}

export async function getMachineDetails(url: string): Promise<PokeAPIMachine> {
  return fetchWithCache(url);
}

export function formatPokemonName(name: string): string {
  return name.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export function formatMoveName(name: string): string {
  return name.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export function formatLocationName(name: string): string {
  return name.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export async function getPokemonMovesForGame(
  pokemon: PokeAPIPokemon,
  versionGroup: string
): Promise<Array<{
  name: string;
  learnMethod: string;
  level: number;
  moveUrl: string;
}>> {
  const moves: Array<{
    name: string;
    learnMethod: string;
    level: number;
    moveUrl: string;
  }> = [];

  for (const moveEntry of pokemon.moves) {
    const relevantDetails = moveEntry.version_group_details.filter(
      d => d.version_group.name === versionGroup
    );
    
    for (const detail of relevantDetails) {
      moves.push({
        name: moveEntry.move.name,
        learnMethod: detail.move_learn_method.name,
        level: detail.level_learned_at,
        moveUrl: moveEntry.move.url,
      });
    }
  }

  return moves;
}

// Get the version group name from our game ID
export function getVersionGroupForGame(gameId: string): string {
  const map: Record<string, string> = {
    red: "red-blue", blue: "red-blue", yellow: "yellow",
    gold: "gold-silver", silver: "gold-silver", crystal: "crystal",
    ruby: "ruby-sapphire", sapphire: "ruby-sapphire", emerald: "emerald",
    firered: "firered-leafgreen", leafgreen: "firered-leafgreen",
    diamond: "diamond-pearl", pearl: "diamond-pearl", platinum: "platinum",
    heartgold: "heartgold-soulsilver", soulsilver: "heartgold-soulsilver",
    black: "black-white", white: "black-white",
    black2: "black-2-white-2", white2: "black-2-white-2",
    x: "x-y", y: "x-y",
    "omega-ruby": "omega-ruby-alpha-sapphire", "alpha-sapphire": "omega-ruby-alpha-sapphire",
    sun: "sun-moon", moon: "sun-moon",
    "ultra-sun": "ultra-sun-ultra-moon", "ultra-moon": "ultra-sun-ultra-moon",
    sword: "sword-shield", shield: "sword-shield",
    "brilliant-diamond": "brilliant-diamond-and-shining-pearl",
    "shining-pearl": "brilliant-diamond-and-shining-pearl",
    "legends-arceus": "legends-arceus",
    scarlet: "scarlet-violet", violet: "scarlet-violet",
  };
  return map[gameId] || "";
}

// Get list of Pokemon available in a specific generation's regional dex
export async function getPokemonForGeneration(genId: number): Promise<Array<{ name: string; id: number; sprite: string }>> {
  const cacheKey = `gen-pokemon-${genId}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  try {
    // Use the pokedex endpoint for regional dex
    const pokedexMap: Record<number, string> = {
      1: "kanto", 2: "original-johto", 3: "hoenn", 4: "original-sinnoh",
      5: "original-unova", 6: "kalos-central", 7: "original-alola",
      8: "galar", 9: "paldea",
    };
    
    const pokedexName = pokedexMap[genId] || "national";
    const data = await fetchWithCache(`${API_BASE}/pokedex/${pokedexName}`);
    
    const results = data.pokemon_entries.map((entry: any) => {
      const id = entry.pokemon_species.url.split("/").filter(Boolean).pop();
      return {
        name: entry.pokemon_species.name,
        id: parseInt(id),
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      };
    });
    
    cache.set(cacheKey, results);
    return results;
  } catch {
    // Fallback: use national dex range
    if (!cache.has("pokemon-list-full")) {
      const data = await fetchWithCache(`${API_BASE}/pokemon?limit=1025&offset=0`);
      cache.set("pokemon-list-full", data.results);
    }
    const allPokemon = cache.get("pokemon-list-full") as Array<{ name: string; url: string }>;
    
    const gen = (await import("./pokemon-data")).GENERATIONS.find(g => g.id === genId);
    if (!gen) return [];
    
    const results = allPokemon
      .slice(0, gen.dexRange[1])
      .map((p, i) => ({
        name: p.name,
        id: i + 1,
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i + 1}.png`,
      }));
    
    cache.set(cacheKey, results);
    return results;
  }
}
