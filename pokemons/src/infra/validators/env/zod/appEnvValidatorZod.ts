import { z } from "zod";
import type {
	AppMachineType,
	NodeEnvs,
} from "../../../../application/validation/env/appEnv/types/appEnvTypes";
import type { AppEnvValidator } from "../../../../application/validation/env/appEnv/types/appEnvValidator";

class AppEnvValidatorZod implements AppEnvValidator {
	stringValidation(envVar: unknown): string {
		const schema = z.string().min(1);
		const validStringVar = schema.parse(envVar);

		return validStringVar;
	}

	numericStringValidation(envVar: unknown): string {
		const notNumericStringErrorMessage =
			"Must be a numeric string (only contain 0-9 digits)";
		const schema = z.string().regex(/^[0-9]+$/, notNumericStringErrorMessage);
		const validNumericStringVar = schema.parse(envVar);

		return validNumericStringVar;
	}

	appLocalValidation(machineLocalEnv: unknown): AppMachineType {
		const schema = z.enum(["docker", "local_machine"]);
		const validAppLocal = schema.parse(machineLocalEnv);

		return validAppLocal;
	}

	nodeEnvValidation(nodeEnv: unknown): NodeEnvs {
		const schema = z.enum(["development", "production", "test"]);
		const validNodeEnv = schema.parse(nodeEnv);

		return validNodeEnv;
	}
}

export const appEnvValidatorZod = new AppEnvValidatorZod();
