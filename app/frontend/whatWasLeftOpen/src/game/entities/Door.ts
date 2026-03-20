import { Vector3 } from "@babylonjs/core";
import { Entity } from "./Entity";

export class Door extends Entity {
	public readonly roomAId: string;
	public readonly roomBId: string;
	public isOpen: boolean;
	public isLocked: boolean;

	public constructor(
		roomAId: string,
		roomBId: string,
		position: Vector3 = Vector3.Zero(),
		isOpen = false,
		isLocked = false,
	) {
		super(position);
		this.roomAId = roomAId;
		this.roomBId = roomBId;
		this.isOpen = isOpen;
		this.isLocked = isLocked;
		this.addTag("door");
	}

	public canPassThrough(): boolean {
		return this.isOpen && !this.isLocked;
	}

	public open(): void {
		if (!this.isLocked) {
			this.isOpen = true;
		}
	}

	public close(): void {
		this.isOpen = false;
	}
}
