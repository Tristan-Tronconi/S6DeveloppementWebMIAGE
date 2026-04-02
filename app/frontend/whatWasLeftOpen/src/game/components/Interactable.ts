import { BinaryState, Stateful } from "./Stateful";

export interface InteractResult {
	consumed: boolean;
	state: BinaryState;
	hudTextKey: string;
}

export class Interactable extends Stateful {
	public readonly hudTextKey: string;
	public visible = true;
	public canBePicked = true;

	public constructor(hudTextKey: string, initialState: BinaryState = "off") {
		super(initialState);
		this.hudTextKey = hudTextKey;
	}

	public interact(): InteractResult {
		const nextState = this.toggle();
		const consumed = this.canBePicked;

		if (consumed) {
			this.visible = false;
		}

		return {
			consumed,
			state: nextState,
			hudTextKey: this.hudTextKey,
		};
	}
}