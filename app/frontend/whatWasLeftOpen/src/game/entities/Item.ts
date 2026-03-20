import { Vector3 } from "@babylonjs/core";
import { Entity } from "./Entity";

export class Item extends Entity {
	public readonly label: string;
	public readonly description: string;
	public pickable: boolean;

	public constructor(
		label: string,
		description: string,
		position: Vector3 = Vector3.Zero(),
		pickable = true,
	) {
		super(position);
		this.label = label;
		this.description = description;
		this.pickable = pickable;
		this.addTag("item");
	}
}