import { Vector3 } from "@babylonjs/core";
import { Entity } from "./Entity";

export class Puzzle extends Entity {
	public readonly requiredItemIds: Set<string>;
	public readonly states: string[];
	private stateIndex = 0;

	public constructor(
		states: string[] = ["idle", "active", "solved"],
		requiredItemIds: string[] = [],
		position: Vector3 = Vector3.Zero(),
	) {
		super(position);
		this.requiredItemIds = new Set(requiredItemIds);
		this.states = states.length > 0 ? states : ["idle"];
		this.addTag("puzzle");
	}

	public get state(): string {
		return this.states[this.stateIndex];
	}

	public canInteract(inventory: Iterable<string>): boolean {
		const owned = new Set(inventory);
		for (const itemId of this.requiredItemIds) {
			if (!owned.has(itemId)) {
				return false;
			}
		}

		return true;
	}

	public advanceState(): string {
		this.stateIndex = Math.min(this.stateIndex + 1, this.states.length - 1);
		return this.state;
	}

	public setState(state: string): void {
		const index = this.states.indexOf(state);
		if (index >= 0) {
			this.stateIndex = index;
		}
	}

	public isSolved(): boolean {
		return this.stateIndex === this.states.length - 1;
	}
}