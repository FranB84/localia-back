import type { Response } from "express";
import { eq } from "drizzle-orm";

import db from "../db/connection";
import { reviews } from "../db/schema";
import type { AuthenticatedRequest } from "../middleware/auth";

// GET /businesses/:id/reviews
// Reviews paginadas de un negocio con rating promedio
export const getReviews = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const businessId = req.params.id as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const businessReviews = await db.query.reviews.findMany({
      where: eq(reviews.business_id, businessId),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            avatar: true,
            location: true,
            created_at: true,
          },
        },
      },
      limit,
      offset,
    });

    // Aplana la estructura para que calce con CommentProps del frontend
    const formattedReviews = businessReviews.map((r) => ({
      id: r.id,
      avatar: r.user.avatar,
      location: r.user.location,
      name: r.user.name,
      joinedDate: r.user.created_at,
      rating: r.rating,
      reviewDate: r.created_at,
      title: r.title,
      body: r.body,
      helpfulCount: r.helpful,
    }));

    // Calcula el rating promedio
    const allReviews = await db.query.reviews.findMany({
      where: eq(reviews.business_id, businessId),
      columns: { rating: true },
    });

    const avgRating =
      allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0;

    return res.status(200).json({
      reviews: formattedReviews,
      avgRating: Math.round(avgRating * 10) / 10,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching reviews", error);
    return res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

// POST /businesses/:id/reviews
// Crea una review. Body: rating, title, body
export const createReview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const businessId = req.params.id as string;
    const { rating, title, body } = req.body;

    const [review] = await db
      .insert(reviews)
      .values({
        user_id: userId,
        business_id: businessId,
        rating,
        title,
        body,
      })
      .returning();

    return res.status(201).json({ review });
  } catch (error) {
    console.error("Error creating review", error);
    return res.status(500).json({ message: "Failed to create review" });
  }
};

// POST /reviews/:reviewId/helpful
// Incrementa el contador helpful de una review
export const markHelpful = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const reviewId = req.params.reviewId as string;

    const existing = await db.query.reviews.findFirst({
      where: eq(reviews.id, reviewId),
      columns: { id: true, helpful: true },
    });

    if (!existing) {
      return res.status(404).json({ message: "Review not found" });
    }

    const [updated] = await db
      .update(reviews)
      .set({ helpful: existing.helpful + 1 })
      .where(eq(reviews.id, reviewId))
      .returning({ helpful: reviews.helpful });

    return res.status(200).json({ helpful: updated.helpful });
  } catch (error) {
    console.error("Error marking review as helpful", error);
    return res.status(500).json({ message: "Failed to mark as helpful" });
  }
};