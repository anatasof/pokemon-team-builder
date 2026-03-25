// Pokemon generation and game data

export interface Generation {
  id: number;
  name: string;
  region: string;
  games: Game[];
  dexRange: [number, number]; // national dex range
  totalNew: number;
}

export interface Game {
  id: string;
  name: string;
  generation: number;
  hmMoves: string[];
  availableTMs: string[];
}

export const GENERATIONS: Generation[] = [
  {
    id: 1, name: "Generation I", region: "Kanto",
    games: [
      { id: "red", name: "Red", generation: 1, hmMoves: ["Cut", "Fly", "Surf", "Strength", "Flash"], availableTMs: [] },
      { id: "blue", name: "Blue", generation: 1, hmMoves: ["Cut", "Fly", "Surf", "Strength", "Flash"], availableTMs: [] },
      { id: "yellow", name: "Yellow", generation: 1, hmMoves: ["Cut", "Fly", "Surf", "Strength", "Flash"], availableTMs: [] },
    ],
    dexRange: [1, 151], totalNew: 151,
  },
  {
    id: 2, name: "Generation II", region: "Johto",
    games: [
      { id: "gold", name: "Gold", generation: 2, hmMoves: ["Cut", "Fly", "Surf", "Strength", "Flash", "Whirlpool", "Waterfall"], availableTMs: [] },
      { id: "silver", name: "Silver", generation: 2, hmMoves: ["Cut", "Fly", "Surf", "Strength", "Flash", "Whirlpool", "Waterfall"], availableTMs: [] },
      { id: "crystal", name: "Crystal", generation: 2, hmMoves: ["Cut", "Fly", "Surf", "Strength", "Flash", "Whirlpool", "Waterfall"], availableTMs: [] },
    ],
    dexRange: [1, 251], totalNew: 100,
  },
  {
    id: 3, name: "Generation III", region: "Hoenn",
    games: [
      { id: "ruby", name: "Ruby", generation: 3, hmMoves: ["Cut", "Fly", "Surf", "Strength", "Flash", "Rock Smash", "Waterfall", "Dive"], availableTMs: [] },
      { id: "sapphire", name: "Sapphire", generation: 3, hmMoves: ["Cut", "Fly", "Surf", "Strength", "Flash", "Rock Smash", "Waterfall", "Dive"], availableTMs: [] },
      { id: "emerald", name: "Emerald", generation: 3, hmMoves: ["Cut", "Fly", "Surf", "Strength", "Flash", "Rock Smash", "Waterfall", "Dive"], availableTMs: [] },
      { id: "firered", name: "FireRed", generation: 3, hmMoves: ["Cut", "Fly", "Surf", "Strength", "Flash", "Rock Smash", "Waterfall"], availableTMs: [] },
      { id: "leafgreen", name: "LeafGreen", generation: 3, hmMoves: ["Cut", "Fly", "Surf", "Strength", "Flash", "Rock Smash", "Waterfall"], availableTMs: [] },
    ],
    dexRange: [1, 386], totalNew: 135,
  },
  {
    id: 4, name: "Generation IV", region: "Sinnoh",
    games: [
      { id: "diamond", name: "Diamond", generation: 4, hmMoves: ["Cut", "Fly", "Surf", "Strength", "Rock Smash", "Waterfall", "Rock Climb", "Defog"], availableTMs: [] },
      { id: "pearl", name: "Pearl", generation: 4, hmMoves: ["Cut", "Fly", "Surf", "Strength", "Rock Smash", "Waterfall", "Rock Climb", "Defog"], availableTMs: [] },
      { id: "platinum", name: "Platinum", generation: 4, hmMoves: ["Cut", "Fly", "Surf", "Strength", "Rock Smash", "Waterfall", "Rock Climb", "Defog"], availableTMs: [] },
      { id: "heartgold", name: "HeartGold", generation: 4, hmMoves: ["Cut", "Fly", "Surf", "Strength", "Rock Smash", "Waterfall", "Whirlpool", "Rock Climb"], availableTMs: [] },
      { id: "soulsilver", name: "SoulSilver", generation: 4, hmMoves: ["Cut", "Fly", "Surf", "Strength", "Rock Smash", "Waterfall", "Whirlpool", "Rock Climb"], availableTMs: [] },
    ],
    dexRange: [1, 493], totalNew: 107,
  },
  {
    id: 5, name: "Generation V", region: "Unova",
    games: [
      { id: "black", name: "Black", generation: 5, hmMoves: ["Cut", "Fly", "Surf", "Strength", "Waterfall", "Dive"], availableTMs: [] },
      { id: "white", name: "White", generation: 5, hmMoves: ["Cut", "Fly", "Surf", "Strength", "Waterfall", "Dive"], availableTMs: [] },
      { id: "black2", name: "Black 2", generation: 5, hmMoves: ["Cut", "Fly", "Surf", "Strength", "Waterfall", "Dive"], availableTMs: [] },
      { id: "white2", name: "White 2", generation: 5, hmMoves: ["Cut", "Fly", "Surf", "Strength", "Waterfall", "Dive"], availableTMs: [] },
    ],
    dexRange: [1, 649], totalNew: 156,
  },
  {
    id: 6, name: "Generation VI", region: "Kalos",
    games: [
      { id: "x", name: "X", generation: 6, hmMoves: ["Cut", "Fly", "Surf", "Strength", "Waterfall"], availableTMs: [] },
      { id: "y", name: "Y", generation: 6, hmMoves: ["Cut", "Fly", "Surf", "Strength", "Waterfall"], availableTMs: [] },
      { id: "omega-ruby", name: "Omega Ruby", generation: 6, hmMoves: ["Cut", "Fly", "Surf", "Strength", "Rock Smash", "Waterfall", "Dive"], availableTMs: [] },
      { id: "alpha-sapphire", name: "Alpha Sapphire", generation: 6, hmMoves: ["Cut", "Fly", "Surf", "Strength", "Rock Smash", "Waterfall", "Dive"], availableTMs: [] },
    ],
    dexRange: [1, 721], totalNew: 72,
  },
  {
    id: 7, name: "Generation VII", region: "Alola",
    games: [
      { id: "sun", name: "Sun", generation: 7, hmMoves: [], availableTMs: [] },
      { id: "moon", name: "Moon", generation: 7, hmMoves: [], availableTMs: [] },
      { id: "ultra-sun", name: "Ultra Sun", generation: 7, hmMoves: [], availableTMs: [] },
      { id: "ultra-moon", name: "Ultra Moon", generation: 7, hmMoves: [], availableTMs: [] },
    ],
    dexRange: [1, 809], totalNew: 88,
  },
  {
    id: 8, name: "Generation VIII", region: "Galar",
    games: [
      { id: "sword", name: "Sword", generation: 8, hmMoves: [], availableTMs: [] },
      { id: "shield", name: "Shield", generation: 8, hmMoves: [], availableTMs: [] },
      { id: "brilliant-diamond", name: "Brilliant Diamond", generation: 8, hmMoves: ["Cut", "Fly", "Surf", "Strength", "Rock Smash", "Waterfall", "Rock Climb", "Defog"], availableTMs: [] },
      { id: "shining-pearl", name: "Shining Pearl", generation: 8, hmMoves: ["Cut", "Fly", "Surf", "Strength", "Rock Smash", "Waterfall", "Rock Climb", "Defog"], availableTMs: [] },
      { id: "legends-arceus", name: "Legends: Arceus", generation: 8, hmMoves: [], availableTMs: [] },
    ],
    dexRange: [1, 905], totalNew: 96,
  },
  {
    id: 9, name: "Generation IX", region: "Paldea",
    games: [
      { id: "scarlet", name: "Scarlet", generation: 9, hmMoves: [], availableTMs: [] },
      { id: "violet", name: "Violet", generation: 9, hmMoves: [], availableTMs: [] },
    ],
    dexRange: [1, 1025], totalNew: 120,
  },
];

export const NATURES = [
  { name: "Adamant", increased: "Attack", decreased: "Sp. Atk" },
  { name: "Bashful", increased: null, decreased: null },
  { name: "Bold", increased: "Defense", decreased: "Attack" },
  { name: "Brave", increased: "Attack", decreased: "Speed" },
  { name: "Calm", increased: "Sp. Def", decreased: "Attack" },
  { name: "Careful", increased: "Sp. Def", decreased: "Sp. Atk" },
  { name: "Docile", increased: null, decreased: null },
  { name: "Gentle", increased: "Sp. Def", decreased: "Defense" },
  { name: "Hardy", increased: null, decreased: null },
  { name: "Hasty", increased: "Speed", decreased: "Defense" },
  { name: "Impish", increased: "Defense", decreased: "Sp. Atk" },
  { name: "Jolly", increased: "Speed", decreased: "Sp. Atk" },
  { name: "Lax", increased: "Defense", decreased: "Sp. Def" },
  { name: "Lonely", increased: "Attack", decreased: "Defense" },
  { name: "Mild", increased: "Sp. Atk", decreased: "Defense" },
  { name: "Modest", increased: "Sp. Atk", decreased: "Attack" },
  { name: "Naive", increased: "Speed", decreased: "Sp. Def" },
  { name: "Naughty", increased: "Attack", decreased: "Sp. Def" },
  { name: "Quiet", increased: "Sp. Atk", decreased: "Speed" },
  { name: "Quirky", increased: null, decreased: null },
  { name: "Rash", increased: "Sp. Atk", decreased: "Sp. Def" },
  { name: "Relaxed", increased: "Defense", decreased: "Speed" },
  { name: "Sassy", increased: "Sp. Def", decreased: "Speed" },
  { name: "Serious", increased: null, decreased: null },
  { name: "Timid", increased: "Speed", decreased: "Attack" },
];

export const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

export const TYPE_CHART: Record<string, Record<string, number>> = {
  normal:   { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 0.5, ghost: 0, dragon: 1, dark: 1, steel: 0.5, fairy: 1 },
  fire:     { normal: 1, fire: 0.5, water: 0.5, electric: 1, grass: 2, ice: 2, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 2, rock: 0.5, ghost: 1, dragon: 0.5, dark: 1, steel: 2, fairy: 1 },
  water:    { normal: 1, fire: 2, water: 0.5, electric: 1, grass: 0.5, ice: 1, fighting: 1, poison: 1, ground: 2, flying: 1, psychic: 1, bug: 1, rock: 2, ghost: 1, dragon: 0.5, dark: 1, steel: 1, fairy: 1 },
  electric: { normal: 1, fire: 1, water: 2, electric: 0.5, grass: 0.5, ice: 1, fighting: 1, poison: 1, ground: 0, flying: 2, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 0.5, dark: 1, steel: 1, fairy: 1 },
  grass:    { normal: 1, fire: 0.5, water: 2, electric: 1, grass: 0.5, ice: 1, fighting: 1, poison: 0.5, ground: 2, flying: 0.5, psychic: 1, bug: 0.5, rock: 2, ghost: 1, dragon: 0.5, dark: 1, steel: 0.5, fairy: 1 },
  ice:      { normal: 1, fire: 0.5, water: 0.5, electric: 1, grass: 2, ice: 0.5, fighting: 1, poison: 1, ground: 2, flying: 2, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 2, dark: 1, steel: 0.5, fairy: 1 },
  fighting: { normal: 2, fire: 1, water: 1, electric: 1, grass: 1, ice: 2, fighting: 1, poison: 0.5, ground: 1, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dragon: 1, dark: 2, steel: 2, fairy: 0.5 },
  poison:   { normal: 1, fire: 1, water: 1, electric: 1, grass: 2, ice: 1, fighting: 1, poison: 0.5, ground: 0.5, flying: 1, psychic: 1, bug: 1, rock: 0.5, ghost: 0.5, dragon: 1, dark: 1, steel: 0, fairy: 2 },
  ground:   { normal: 1, fire: 2, water: 1, electric: 2, grass: 0.5, ice: 1, fighting: 1, poison: 2, ground: 1, flying: 0, psychic: 1, bug: 0.5, rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 2, fairy: 1 },
  flying:   { normal: 1, fire: 1, water: 1, electric: 0.5, grass: 2, ice: 1, fighting: 2, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 2, rock: 0.5, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 1 },
  psychic:  { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 2, poison: 2, ground: 1, flying: 1, psychic: 0.5, bug: 1, rock: 1, ghost: 1, dragon: 1, dark: 0, steel: 0.5, fairy: 1 },
  bug:      { normal: 1, fire: 0.5, water: 1, electric: 1, grass: 2, ice: 1, fighting: 0.5, poison: 0.5, ground: 1, flying: 0.5, psychic: 2, bug: 1, rock: 1, ghost: 0.5, dragon: 1, dark: 2, steel: 0.5, fairy: 0.5 },
  rock:     { normal: 1, fire: 2, water: 1, electric: 1, grass: 1, ice: 2, fighting: 0.5, poison: 1, ground: 0.5, flying: 2, psychic: 1, bug: 2, rock: 1, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 1 },
  ghost:    { normal: 0, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 2, bug: 1, rock: 1, ghost: 2, dragon: 1, dark: 0.5, steel: 1, fairy: 1 },
  dragon:   { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 2, dark: 1, steel: 0.5, fairy: 0 },
  dark:     { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 0.5, poison: 1, ground: 1, flying: 1, psychic: 2, bug: 1, rock: 1, ghost: 2, dragon: 1, dark: 0.5, steel: 0.5, fairy: 0.5 },
  steel:    { normal: 1, fire: 0.5, water: 0.5, electric: 0.5, grass: 1, ice: 2, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 2 },
  fairy:    { normal: 1, fire: 0.5, water: 1, electric: 1, grass: 1, ice: 1, fighting: 2, poison: 0.5, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 2, dark: 2, steel: 0.5, fairy: 1 },
};

// Defensive type chart - what effectiveness incoming attacks have
export const DEFENSIVE_CHART: Record<string, Record<string, number>> = {};
const allTypes = Object.keys(TYPE_CHART);
allTypes.forEach(defType => {
  DEFENSIVE_CHART[defType] = {};
  allTypes.forEach(atkType => {
    DEFENSIVE_CHART[defType][atkType] = TYPE_CHART[atkType][defType];
  });
});

export interface PokemonSlot {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  stats: { hp: number; attack: number; defense: number; spAtk: number; spDef: number; speed: number };
  abilities: string[];
  moves: MoveSlot[];
  nature: string;
  ivs: { hp: number; attack: number; defense: number; spAtk: number; spDef: number; speed: number };
  evs: { hp: number; attack: number; defense: number; spAtk: number; spDef: number; speed: number };
  item: string;
  locations: LocationInfo[];
}

export interface MoveSlot {
  name: string;
  type: string;
  category: string; // physical, special, status
  power: number | null;
  accuracy: number | null;
  pp: number;
  learnMethod: string; // "level-up", "tm", "hm", "egg", "tutor"
  learnDetail: string; // e.g., "Level 36", "TM26", "Breed with Pikachu"
  isHM: boolean;
}

export interface LocationInfo {
  game: string;
  method: string; // "wild", "gift", "trade", "evolve", "egg"
  location: string;
  details: string;
}

export function getEmptyPokemonSlot(): PokemonSlot {
  return {
    id: 0,
    name: "",
    sprite: "",
    types: [],
    stats: { hp: 0, attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 },
    abilities: [],
    moves: [],
    nature: "Adamant",
    ivs: { hp: 31, attack: 31, defense: 31, spAtk: 31, spDef: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 },
    item: "",
    locations: [],
  };
}

// Map PokeAPI generation names to our IDs
export const GEN_API_MAP: Record<string, number> = {
  "generation-i": 1,
  "generation-ii": 2,
  "generation-iii": 3,
  "generation-iv": 4,
  "generation-v": 5,
  "generation-vi": 6,
  "generation-vii": 7,
  "generation-viii": 8,
  "generation-ix": 9,
};

// Map PokeAPI version group names to game IDs
export const VERSION_GROUP_MAP: Record<string, string[]> = {
  "red-blue": ["red", "blue"],
  "yellow": ["yellow"],
  "gold-silver": ["gold", "silver"],
  "crystal": ["crystal"],
  "ruby-sapphire": ["ruby", "sapphire"],
  "emerald": ["emerald"],
  "firered-leafgreen": ["firered", "leafgreen"],
  "diamond-pearl": ["diamond", "pearl"],
  "platinum": ["platinum"],
  "heartgold-soulsilver": ["heartgold", "soulsilver"],
  "black-white": ["black", "white"],
  "black-2-white-2": ["black2", "white2"],
  "x-y": ["x", "y"],
  "omega-ruby-alpha-sapphire": ["omega-ruby", "alpha-sapphire"],
  "sun-moon": ["sun", "moon"],
  "ultra-sun-ultra-moon": ["ultra-sun", "ultra-moon"],
  "sword-shield": ["sword", "shield"],
  "brilliant-diamond-and-shining-pearl": ["brilliant-diamond", "shining-pearl"],
  "legends-arceus": ["legends-arceus"],
  "scarlet-violet": ["scarlet", "violet"],
};

export function getGamesByGeneration(genId: number): Game[] {
  const gen = GENERATIONS.find(g => g.id === genId);
  return gen?.games || [];
}

export function isPokemonAvailableInGeneration(pokemonId: number, genId: number): boolean {
  const gen = GENERATIONS.find(g => g.id === genId);
  if (!gen) return true;
  return pokemonId >= gen.dexRange[0] && pokemonId <= gen.dexRange[1];
}

export function getHMsForGame(gameId: string): string[] {
  for (const gen of GENERATIONS) {
    const game = gen.games.find(g => g.id === gameId);
    if (game) return game.hmMoves;
  }
  return [];
}

export function computeTypeCoverage(teamTypes: string[][]): {
  superEffective: Record<string, number>;
  resistances: Record<string, number>;
  weaknesses: Record<string, number>;
  immunities: Record<string, number>;
  uncovered: string[];
  comments: string[];
} {
  const superEffective: Record<string, number> = {};
  const resistances: Record<string, number> = {};
  const weaknesses: Record<string, number> = {};
  const immunities: Record<string, number> = {};
  
  allTypes.forEach(t => {
    superEffective[t] = 0;
    resistances[t] = 0;
    weaknesses[t] = 0;
    immunities[t] = 0;
  });

  // Offensive coverage - what types can the team hit super effectively
  teamTypes.forEach(pokemonTypes => {
    pokemonTypes.forEach(pType => {
      const pTypeLower = pType.toLowerCase();
      if (TYPE_CHART[pTypeLower]) {
        allTypes.forEach(defType => {
          if (TYPE_CHART[pTypeLower][defType] > 1) {
            superEffective[defType]++;
          }
        });
      }
    });
  });

  // Defensive profile
  teamTypes.forEach(pokemonTypes => {
    allTypes.forEach(atkType => {
      let multiplier = 1;
      pokemonTypes.forEach(defType => {
        const dt = defType.toLowerCase();
        if (DEFENSIVE_CHART[dt] && DEFENSIVE_CHART[dt][atkType] !== undefined) {
          multiplier *= DEFENSIVE_CHART[dt][atkType];
        }
      });
      if (multiplier === 0) immunities[atkType]++;
      else if (multiplier < 1) resistances[atkType]++;
      else if (multiplier > 1) weaknesses[atkType]++;
    });
  });

  const uncovered = allTypes.filter(t => superEffective[t] === 0);
  const comments = generateCoverageComments(superEffective, weaknesses, resistances, immunities, uncovered, teamTypes);

  return { superEffective, resistances, weaknesses, immunities, uncovered, comments };
}

function generateCoverageComments(
  superEffective: Record<string, number>,
  weaknesses: Record<string, number>,
  resistances: Record<string, number>,
  immunities: Record<string, number>,
  uncovered: string[],
  teamTypes: string[][]
): string[] {
  const comments: string[] = [];

  if (uncovered.length > 0) {
    comments.push(`Your team lacks super-effective coverage against: ${uncovered.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(", ")}. Consider adding a Pokémon with moves that hit these types.`);
  }

  const majorWeaknesses = allTypes.filter(t => weaknesses[t] >= 3);
  if (majorWeaknesses.length > 0) {
    comments.push(`Major team weakness: ${majorWeaknesses.length} or more Pokémon are weak to ${majorWeaknesses.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(", ")}. This could be exploited by opponents.`);
  }

  const strongResists = allTypes.filter(t => resistances[t] >= 3 || immunities[t] >= 1);
  if (strongResists.length > 0) {
    comments.push(`Good defensive coverage against: ${strongResists.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(", ")}.`);
  }

  // Check for type diversity
  const flatTypes = teamTypes.flat().map(t => t.toLowerCase());
  const uniqueTypes = new Set(flatTypes);
  if (uniqueTypes.size < 4 && teamTypes.length >= 3) {
    comments.push("Your team has low type diversity. More varied types would improve coverage.");
  }

  if (teamTypes.length >= 4 && uncovered.length === 0) {
    comments.push("Excellent offensive type coverage - your team can hit every type for super-effective damage.");
  }

  const noResistances = allTypes.filter(t => resistances[t] === 0 && immunities[t] === 0);
  if (noResistances.length > 5) {
    comments.push(`Your team has no resistances to: ${noResistances.slice(0, 5).map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(", ")}${noResistances.length > 5 ? ` and ${noResistances.length - 5} more` : ""}. Consider Pokémon that resist these types.`);
  }

  return comments;
}

export function computeMoveCoverage(moves: MoveSlot[]): Record<string, number> {
  const coverage: Record<string, number> = {};
  allTypes.forEach(t => coverage[t] = 0);
  
  moves.forEach(m => {
    if (m.name && m.type && m.category !== "status") {
      const moveType = m.type.toLowerCase();
      if (TYPE_CHART[moveType]) {
        allTypes.forEach(defType => {
          if (TYPE_CHART[moveType][defType] > 1) {
            coverage[defType] = Math.max(coverage[defType], TYPE_CHART[moveType][defType]);
          }
        });
      }
    }
  });
  
  return coverage;
}

export function checkHMCoverage(team: PokemonSlot[], requiredHMs: string[]): {
  covered: string[];
  missing: string[];
  assignments: Record<string, string>;
} {
  const assignments: Record<string, string> = {};
  const covered: string[] = [];
  
  requiredHMs.forEach(hm => {
    const pokemon = team.find(p => 
      p.name && p.moves.some(m => m.name.toLowerCase() === hm.toLowerCase())
    );
    if (pokemon) {
      assignments[hm] = pokemon.name;
      covered.push(hm);
    }
  });
  
  const missing = requiredHMs.filter(hm => !covered.includes(hm));
  
  return { covered, missing, assignments };
}

export function calculateStat(
  base: number,
  iv: number,
  ev: number,
  level: number,
  nature: number, // 1.1, 1.0, or 0.9
  isHP: boolean
): number {
  if (isHP) {
    return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
  }
  return Math.floor((Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5) * nature);
}
