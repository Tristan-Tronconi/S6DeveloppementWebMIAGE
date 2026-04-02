import { BinaryState } from "./Stateful";
import { InteractResult, Interactable } from "./Interactable";

export interface InspectResult extends InteractResult {
	description: string;
	inspectionActive: boolean;
	pausesGameplay: boolean;
}

export class Inspectable extends Interactable {
	public readonly description: string;
	public readonly pausesGameplay: boolean;
	public readonly keepDefaultInteraction: boolean;
	private inspectionActive = false;

	public constructor(
		hudTextKey: string,
		description: string,
		options: {
			initialState?: BinaryState;
			pausesGameplay?: boolean;
			keepDefaultInteraction?: boolean;
		} = {},
	) {
		super(hudTextKey, options.initialState ?? "off");
		this.description = description;
		this.pausesGameplay = options.pausesGameplay ?? true;
		this.keepDefaultInteraction = options.keepDefaultInteraction ?? false;
	}

	public inspect(): InspectResult {
		this.inspectionActive = !this.inspectionActive;

		if (!this.keepDefaultInteraction) {
			this.canBePicked = false;
		}

		const baseResult = this.interact();
		return {
			...baseResult,
			description: this.description,
			inspectionActive: this.inspectionActive,
			pausesGameplay: this.pausesGameplay,
		};
	}

	public stopInspection(): void {
		this.inspectionActive = false;
	}
}