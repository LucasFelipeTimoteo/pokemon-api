import type { EnvValues } from "../../../types/appEnvType";

export interface EnvParser {
	parseEnvFileToObj(envFilePath: string): EnvValues;
}
