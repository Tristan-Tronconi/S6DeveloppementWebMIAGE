import { Vector3 } from "@babylonjs/core";

export class CorridorLayout {
	public readonly floorWidth = 12;
	public readonly floorLength = 120;
	public readonly wallHeight = 4;
	public readonly wallThickness = 0.6;

	public get spawnPoint(): Vector3 {
		return new Vector3(0, 1.8, -(this.floorLength / 2) + 6);
	}
}
