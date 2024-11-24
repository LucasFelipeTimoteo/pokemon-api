export interface EnvParser {
	parseEnvFileToObj(envFilePath: string): object;
}
