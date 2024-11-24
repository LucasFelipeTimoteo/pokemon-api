import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "dotenv";
import type { EnvParser } from "../../../application/parsers/env/envParser";
import type { EnvValues } from "../../../application/validation/env/appEnv/types/appEnvTypes";

class DotenvEnvParser implements EnvParser {
	parseEnvFileToObj(envFilePath: string) {
		const resolvedPath = resolve(envFilePath);
		const envFile = readFileSync(resolvedPath);
		const parsedEnv = parse(envFile);

		return parsedEnv as EnvValues; // validate this isn't really necessary once validation will be done on AppEnv
	}
}

export const dotenvEnvParser = new DotenvEnvParser();
