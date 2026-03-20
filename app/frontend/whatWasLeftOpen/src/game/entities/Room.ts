import { Vector3 } from "@babylonjs/core";
import { Entity } from "./Entity";

export interface RoomDimensions {
	width: number;
	length: number;
	height: number;
}

export class Room extends Entity {
	public readonly dimensions: RoomDimensions;
	public readonly doorIds: Set<string> = new Set();
	public readonly portalIds: Set<string> = new Set();

	public constructor(
		dimensions: RoomDimensions,
		position: Vector3 = Vector3.Zero(),
		id?: string,
	) {
		super(position, id);
		this.dimensions = dimensions;
		this.addTag("room");
	}

	public addDoor(doorId: string): void {
		this.doorIds.add(doorId);
	}

	public addPortal(portalId: string): void {
		this.portalIds.add(portalId);
	}
}