import { pgTable, text, integer, boolean } from "drizzle-orm/pg-core";
import { z } from "zod";

export const teams = pgTable("teams", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  generation: text("generation").notNull(),
  game: text("game").notNull(),
  mode: text("mode").notNull(), // "playthrough" | "competitive"
  hmRulesEnabled: boolean("hm_rules_enabled").notNull().default(false),
  pokemon: text("pokemon").notNull(), // JSON stringified array
});

export const insertTeamSchema = z.object({
  name: z.string(),
  generation: z.string(),
  game: z.string(),
  mode: z.string(),
  hmRulesEnabled: z.boolean().default(false),
  pokemon: z.string(),
});
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;
