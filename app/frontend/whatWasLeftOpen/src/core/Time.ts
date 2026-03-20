export class Time {
	private lastTimestampMs: number | null = null;
	private deltaSecondsValue = 0;
	private elapsedSecondsValue = 0;

	public tick(timestampMs: number): void {
		if (this.lastTimestampMs === null) {
			this.lastTimestampMs = timestampMs;
			this.deltaSecondsValue = 0;
			return;
		}

		const deltaMs = Math.max(0, timestampMs - this.lastTimestampMs);
		this.deltaSecondsValue = deltaMs / 1000;
		this.elapsedSecondsValue += this.deltaSecondsValue;
		this.lastTimestampMs = timestampMs;
	}

	public get deltaSeconds(): number {
		return this.deltaSecondsValue;
	}

	public get elapsedSeconds(): number {
		return this.elapsedSecondsValue;
	}

	public reset(): void {
		this.lastTimestampMs = null;
		this.deltaSecondsValue = 0;
		this.elapsedSecondsValue = 0;
	}
}