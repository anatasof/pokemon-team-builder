import type { Express } from "express";
import type { Server } from "http";
import { db } from "./storage";
import { teams, insertTeamSchema } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function registerRoutes(server: Server, app: Express) {
  // Save team
  app.post("/api/teams", async (req, res) => {
    try {
      const data = insertTeamSchema.parse(req.body);
      const [result] = await db.insert(teams).values(data).returning();
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Get all teams
  app.get("/api/teams", async (_req, res) => {
    const allTeams = await db.select().from(teams);
    res.json(allTeams);
  });

  // Get team by id
  app.get("/api/teams/:id", async (req, res) => {
    const [team] = await db.select().from(teams).where(eq(teams.id, parseInt(req.params.id)));
    if (!team) return res.status(404).json({ error: "Not found" });
    res.json(team);
  });

  // Delete team
  app.delete("/api/teams/:id", async (req, res) => {
    await db.delete(teams).where(eq(teams.id, parseInt(req.params.id)));
    res.json({ ok: true });
  });
}
