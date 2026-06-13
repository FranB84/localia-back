import type { NextFunction, Request, Response } from "express";
import { type CustomJWTPayload, verifyToken } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
	user?: CustomJWTPayload;
}
export const authenticateToken = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) => {
	//get authorization header from the rrequest
	const authHeader = req.headers.authorization;
	const token = authHeader?.split(" ")[1];
	if (!token) {
		return res.status(401).json({
			message: "no token provided",
		});
	}

	const payload = await verifyToken(token);
	req.user = payload;
	next();
};
