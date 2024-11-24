import { appEnv } from "../../../../../global/utils/env/appEnv";

export const corsWhitelist = () => {
	const rawWhitelist = appEnv.corsWhitelist;
	const whitelist = rawWhitelist
		.trim()
		.split(",")
		.map((str) => str.trim());

	return whitelist;
};
