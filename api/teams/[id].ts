import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../../lib/db";
import { teams } from "../../shared/schema";
import { eq } from "drizzle-orm";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = parseInt(req.query.id as string);

  if (req.method === "GET") {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    if (!team) return res.status(404).json({ error: "Not found" });
    return res.json(team);
  }

  if (req.method === "DELETE") {
    await db.delete(teams).where(eq(teams.id, id));
    return res.json({ ok: true });
  }

  res.status(405).json({ error: "Method not allowed" });
}
