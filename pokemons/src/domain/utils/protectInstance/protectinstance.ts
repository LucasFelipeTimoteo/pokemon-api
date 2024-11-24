import { ProtectInstanceError } from "./errors/protectInstanceError/protectInstanceError";

export const protectInstance = (instance: unknown, isEnumerable?: boolean) => {
	if (typeof instance !== "object" || instance === null) {
		throw new ProtectInstanceError("Instance must be an object");
	}

	if (Object.keys(instance).length < 1) {
		throw new ProtectInstanceError(
			"Instance object must have at least one property",
		);
	}

	if (!isEnumerable) {
		for (const prop in instance) {
			Object.defineProperty(instance, prop, { enumerable: false });
		}
	}

	Object.freeze(instance);
};
