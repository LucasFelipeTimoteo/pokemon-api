export interface logger {
	debug: (msg: unknown) => void;
	info: (msg: unknown) => void;
	warn: (msg: unknown) => void;
	error: (msg: unknown) => void;
	fatal: (msg: unknown) => void;
}
