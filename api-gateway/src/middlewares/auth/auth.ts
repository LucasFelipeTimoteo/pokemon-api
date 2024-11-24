import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { appEnv } from "../../global/env/utils/appEnv/appEnv";

export interface AuthMiddlewareExpressResquest extends Request {
	user?: {
		userId: string;
	};
}

export const authMiddleware = (
	req: AuthMiddlewareExpressResquest,
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.get("Authorization");
	if (!authHeader) {
		return res
			.status(401)
			.json({ message: "Authorization header must be provided" });
	}
	const authType = authHeader.split(" ")[0];
	const token = authHeader.split(" ")[1];

	if (authType !== "Bearer") {
		return res.status(401).json({ message: "Auth type must be a Bearer" });
	}

	if (!token) {
		return res.status(401).json({ message: "Auth token not provided" });
	}

	try {
		const user = jwt.verify(token, appEnv.JWTAuthSecret) as { userId: string };

		if (typeof user.userId !== "string") {
			throw new Error(
				`Invalid token. token userId must be have type string, but received value was: ${user.userId}`,
			);
		}
		req.user = user;
		next();
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Invalid auth token" });
	}
};
