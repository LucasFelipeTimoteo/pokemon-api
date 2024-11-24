import type { AppMachineType, NodeEnvs } from "./appEnvTypes";

export interface AppEnvValidator {
	stringValidation(envVar: unknown): string;
	numericStringValidation(envVar: unknown): string;
	appLocalValidation(machineLocalEnv: unknown): AppMachineType;
	nodeEnvValidation(nodeEnv: unknown): NodeEnvs;
}
