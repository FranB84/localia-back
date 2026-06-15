import { Router } from "express";
import { validateQuery } from "../middleware/validations";
import { z } from "zod";
import { categoryEnum } from "../db/schema";

// Importamos los controladores correspondientes
import { searchBusinesses, getCategories } from "../controllers/searchController";

// Mantenemos el esquema de validación en la capa de rutas/seguridad
const globalSearchQuerySchema = z.object({
	q: z.string().optional().default(""),
	category: z.enum(categoryEnum.enumValues as [string, ...string[]]).optional(),
	type: z.string().optional(),
	city: z.string().optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().default(10),
});

const router = Router();

// Rutas ultra compactas y legibles
router.get("/businesses", validateQuery(globalSearchQuerySchema), searchBusinesses);
router.get("/categories", getCategories);

export default router;