# Pokemon Team Builder

A comprehensive Pokemon team builder supporting all 9 generations and every mainline game. Plan your playthrough roster or build competitive teams with move details, type coverage analysis, and location data.

## Features

- **All 9 Generations** — every mainline game selectable (Red/Blue through Scarlet/Violet)
- **Playthrough Mode** — HM coverage rules and move acquisition details per game
- **Competitive Mode** — EV/IV spreads and nature optimizer
- **Move Details** — learn method (Level Up, TM, HM, Egg Move, Tutor), power, accuracy, and PP
- **Location Data** — wild encounter routes and levels pulled live from PokeAPI
- **Type Coverage** — offensive and defensive type grids for the full team
- **Team Analysis** — STAB tips, coverage gaps, and balance warnings

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Express + Drizzle ORM + Postgres (Supabase)
- Vercel (deployment)
- PokeAPI for live Pokemon data
