import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { validateBody, validateParams, validateQuery } from "../middleware/validations";
import { 
    createBusinessBodySchema, 
    updateBusinessBodySchema, 
    idParamSchema, 
    businessQuerySchema 
} from "../controllers/businessesController"; // O donde tengas guardados tus esquemas de Zod

// Importamos los controladores que manejan la lógica real
import {
    getBusinesses,
    getFeaturedBusinesses,
    getBusinessById,
    createBusiness,
    updateBusiness,
    deleteBusiness
} from "../controllers/businessesController";

const router = Router();

// Cada ruta se vuelve una sola línea hiper legible:
router.get("/", validateQuery(businessQuerySchema), getBusinesses);
router.get("/featured", getFeaturedBusinesses);
router.get("/:id", validateParams(idParamSchema), getBusinessById);

router.post("/", authenticateToken, validateBody(createBusinessBodySchema), createBusiness);
router.put("/:id", authenticateToken, validateParams(idParamSchema), validateBody(updateBusinessBodySchema), updateBusiness);
router.delete("/:id", authenticateToken, validateParams(idParamSchema), deleteBusiness);

export default router;