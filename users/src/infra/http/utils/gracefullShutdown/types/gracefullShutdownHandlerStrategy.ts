export interface GracefullShutdownHandlerStrategyType {
	exec(): Promise<boolean>;
}
