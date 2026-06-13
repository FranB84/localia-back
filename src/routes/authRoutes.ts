import { Router } from "express";
import { z } from "zod";

import { login, register } from "../controllers/authController";
import { validateBody } from "../middleware/validations";

const router = Router();

// Schemas de validación
const registerSchema = z.object({
	name: z.string(),
	email: z.string(),
	password: z.string(),
	role: z.enum(["tourist", "seller", "guest"]),
});

const loginSchema = z.object({
	email: z.string(),
	password: z.string(),
});

// POST /auth/register
router.post("/register", validateBody(registerSchema), register);

// POST /auth/login
router.post("/login", validateBody(loginSchema), login);

// GET /auth/me
// Header: Authorization: Bearer <token>
// Devuelve: datos del usuario autenticado (para NavBar y rutas protegidas)

export default router;
