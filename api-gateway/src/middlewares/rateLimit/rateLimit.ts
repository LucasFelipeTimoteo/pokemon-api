import rateLimit from "express-rate-limit";
import { appEnv } from "../../global/env/utils/appEnv/appEnv";

export const rateLimitMiddleware = rateLimit({
	windowMs: Number(appEnv.rateLimitTimeMinutes) * 60 * 1000,
	max: Number(appEnv.rateLimitMaxRequests),
	legacyHeaders: false,
	standardHeaders: "draft-7",
	message: `Too many requests from this IP, please try again after ${appEnv.rateLimitTimeMinutes} minutes.`,
});
