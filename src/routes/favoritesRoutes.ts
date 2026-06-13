import { Router } from "express";
import { z } from "zod";

import { getFavorites, addFavorite, removeFavorite } from "../controllers/favoritesController";
import { authenticateToken } from "../middleware/auth";
import { validateParams } from "../middleware/validations";

const router = Router();

const bizIdSchema = z.object({
  bizId: z.string(),
});

// GET /users/me/favorites
// Devuelve los favoritos del usuario autenticado
router.get("/me/favorites", authenticateToken, getFavorites);

// POST /users/me/favorites/:bizId
// Agrega un negocio a favoritos
router.post("/me/favorites/:bizId", authenticateToken, validateParams(bizIdSchema), addFavorite);

// DELETE /users/me/favorites/:bizId
// Elimina un negocio de favoritos
router.delete("/me/favorites/:bizId", authenticateToken, validateParams(bizIdSchema), removeFavorite);

export default router;