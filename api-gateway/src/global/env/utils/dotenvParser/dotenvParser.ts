import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "dotenv";
import type { EnvValues } from "../../types/appEnvType";
import type { EnvParser } from "./types/envParser";

class DotenvEnvParser implements EnvParser {
	parseEnvFileToObj(envFilePath: string) {
		const resolvedPath = resolve(envFilePath);
		const envFile = readFileSync(resolvedPath);
		const parsedEnv = parse(envFile);

		return parsedEnv as EnvValues; // validate this isn't really necessary once validation will be done on AppEnv
	}
}

export const dotenvEnvParser = new DotenvEnvParser();
