import { Router } from "express";
import { z } from "zod";

import {
  getReviews,
  createReview,
  markHelpful,
} from "../controllers/reviewsController";
import { authenticateToken } from "../middleware/auth";
import { validateBody, validateParams, validateQuery } from "../middleware/validations";

const router = Router({ mergeParams: true });

// Schemas
const reviewIdSchema = z.object({
  reviewId: z.string(),
});

const businessIdSchema = z.object({
  id: z.string(),
});

const createReviewSchema = z.object({
  rating: z.number(),
  title: z.string(),
  body: z.string(),
});

const paginationSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});

// GET /businesses/:id/reviews
router.get(
  "/:id/reviews",
  validateParams(businessIdSchema),
  validateQuery(paginationSchema),
  getReviews
);

// POST /businesses/:id/reviews
router.post(
  "/:id/reviews",
  authenticateToken,
  validateParams(businessIdSchema),
  validateBody(createReviewSchema),
  createReview
);

// DELETE /reviews/:reviewId
router.delete(
  "/reviews/:reviewId",
  authenticateToken,
  validateParams(reviewIdSchema),
);

// POST /reviews/:reviewId/helpful
router.post(
  "/reviews/:reviewId/helpful",
  authenticateToken,
  validateParams(reviewIdSchema),
  markHelpful
);

export default router;