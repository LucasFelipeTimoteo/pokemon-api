import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "dotenv";
import type { EnvParser } from "../../../application/parsers/env/envParser";

class DotenvEnvParser implements EnvParser {
	parseEnvFileToObj(envFilePath: string) {
		const resolvedPath = resolve(envFilePath);
		const envFile = readFileSync(resolvedPath);
		const parsedEnv = parse(envFile);

		return parsedEnv;
	}

	parseEnvSecretsToObj(
		envFileRelativePath: string,
		runningLocal: unknown,
		IsPutOnDockerSecrets = false,
	) {
		const dockerSecretsPath = `${IsPutOnDockerSecrets ? "/run/secrets/" : ""}${envFileRelativePath}`;
		const localSecretsPath = envFileRelativePath;
		const path =
			runningLocal === "docker" ? dockerSecretsPath : localSecretsPath;

		const parsedEnvSecretsObj = this.parseEnvFileToObj(path);
		return parsedEnvSecretsObj;
	}
}

export const dotenvEnvParser = new DotenvEnvParser();
