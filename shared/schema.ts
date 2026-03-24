import { pgTable, text, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
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

export const insertTeamSchema = createInsertSchema(teams).omit({ id: true });
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;
