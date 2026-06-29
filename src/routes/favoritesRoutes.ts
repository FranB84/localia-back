import { Router } from "express";
import { z } from "zod";

import { getFavorites, addFavorite, removeFavorite } from "../controllers/favoritesController";

import { authenticateToken } from "../middleware/auth";
import { validateParams } from "../middleware/validations";

const router = Router();

const businessIdSchema = z.object({
  businessId: z.string().uuid(),
});

// GET /users/me/favorites
router.get("/me/favorites", authenticateToken, getFavorites);

// POST /users/me/favorites/:businessId
router.post("/me/favorites/:businessId", authenticateToken, validateParams(businessIdSchema), addFavorite);

// DELETE /users/me/favorites/:businessId
router.delete("/me/favorites/:businessId", authenticateToken, validateParams(businessIdSchema), removeFavorite);

export default router;