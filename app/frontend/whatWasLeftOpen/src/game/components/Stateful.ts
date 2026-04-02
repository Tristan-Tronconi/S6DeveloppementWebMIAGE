export type BinaryState = "off" | "on";

export class Stateful {
	private currentState: BinaryState;

	public constructor(initialState: BinaryState = "off") {
		this.currentState = initialState;
	}

	public get state(): BinaryState {
		return this.currentState;
	}

	public isOn(): boolean {
		return this.currentState === "on";
	}

	public setState(nextState: BinaryState): void {
		this.currentState = nextState;
	}

	public toggle(): BinaryState {
		this.currentState = this.currentState === "on" ? "off" : "on";
		return this.currentState;
	}
}