import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../../lib/db";
import { teams, insertTeamSchema } from "../../shared/schema";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const allTeams = await db.select().from(teams);
    return res.json(allTeams);
  }

  if (req.method === "POST") {
    try {
      const data = insertTeamSchema.parse(req.body);
      const [result] = await db.insert(teams).values(data).returning();
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}
