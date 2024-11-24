import cors from "cors";
import { corsWhitelist } from "../../../../utils/cors/whitelist/corsWhitelist";

export const corsConfigMiddleware = () => {
	const whitelist = corsWhitelist();

	return cors({
		origin: (origin, callback) => {
			if (
				(origin && whitelist.indexOf(origin) !== -1) ||
				whitelist.includes("*")
			) {
				callback(null, true);
			} else {
				callback(
					new Error(`CORS ERROR: origin [${origin}] is not whitelisted`),
				);
			}
		},
	});
};
