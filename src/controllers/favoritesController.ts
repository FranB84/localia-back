import type { Response } from "express";
import { eq, and } from "drizzle-orm";

import db from "../db/connection";
import { favorites } from "../db/schema";
import type { AuthenticatedRequest } from "../middleware/auth";

// GET /users/me/favorites
// Devuelve todos los negocios favoritos del usuario autenticado
export const getFavorites = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const userFavorites = await db.query.favorites.findMany({
      where: eq(favorites.user_id, userId),
      with: {
        business: true,
      },
    });

    return res.status(200).json({ favorites: userFavorites });
  } catch (error) {
    console.error("Error fetching favorites", error);
    return res.status(500).json({ message: "Failed to fetch favorites" });
  }
};

// POST /users/me/favorites/:bizId
// Agrega un negocio a favoritos
export const addFavorite = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const bizId = req.params.bizId as string;

    // Verifica que no exista ya ese favorito
    const existing = await db.query.favorites.findFirst({
      where: and(
        eq(favorites.user_id, userId),
        eq(favorites.business_id, bizId)
      ),
    });

    if (existing) {
      return res.status(409).json({ message: "Already in favorites" });
    }

    const [favorite] = await db
      .insert(favorites)
      .values({
        user_id: userId,
        business_id: bizId,
      })
      .returning();

    return res.status(201).json({ favorite });
  } catch (error) {
    console.error("Error adding favorite", error);
    return res.status(500).json({ message: "Failed to add favorite" });
  }
};

// DELETE /users/me/favorites/:bizId
// Elimina un negocio de favoritos
export const removeFavorite = async (req: AuthenticatedRequest, res: Response) => {
  try {
     const userId = req.user!.id;
    const bizId = req.params.bizId as string;

    const deleted = await db
      .delete(favorites)
      .where(
        and(
          eq(favorites.user_id, userId),
          eq(favorites.business_id, bizId)
        )
      )
      .returning();

    if (deleted.length === 0) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    return res.status(200).json({ message: "Removed from favorites" });
  } catch (error) {
    console.error("Error removing favorite", error);
    return res.status(500).json({ message: "Failed to remove favorite" });
  }
};