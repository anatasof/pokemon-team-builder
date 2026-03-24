export default function AppFooter() {
  return (
    <footer className="border-t border-border mt-12 py-6">
      <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-muted-foreground">
        <div className="flex flex-col gap-1">
          <p>
            © 2026{" "}
            <a
              href="https://instagram.com/anatasof"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-red-500 hover:text-red-400 transition-colors"
            >
              @anatasof
            </a>
          </p>
        </div>
        <div className="flex flex-col gap-1 sm:text-center">
          <p>Pokémon and all related names are trademarks of Nintendo, Game Freak, and Creatures Inc.</p>
        </div>
        <div className="flex flex-col gap-1 sm:text-right">
          <p>
            Pokémon data provided by{" "}
            <a
              href="https://pokeapi.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:text-foreground transition-colors"
            >
              PokéAPI
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
