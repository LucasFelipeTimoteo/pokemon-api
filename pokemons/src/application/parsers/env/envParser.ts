import type { EnvValues } from "../../validation/env/appEnv/types/appEnvTypes";

export interface EnvParser {
	parseEnvFileToObj(envFilePath: string): EnvValues;
}
