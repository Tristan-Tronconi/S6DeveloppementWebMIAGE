import { Vector3 } from "@babylonjs/core";
import { Entity } from "./Entity";

export class Player extends Entity {
	public speed = 4;
	public lookSensitivity = 1;
	public canInteract = true;
	public readonly inventory: Set<string> = new Set();

	public constructor(position: Vector3 = Vector3.Zero()) {
		super(position, "player");
		this.addTag("player");
	}

	public addItem(itemId: string): void {
		this.inventory.add(itemId);
	}

	public hasItem(itemId: string): boolean {
		return this.inventory.has(itemId);
	}

	public removeItem(itemId: string): void {
		this.inventory.delete(itemId);
	}
}