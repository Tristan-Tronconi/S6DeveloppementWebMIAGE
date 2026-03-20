import { Vector3 } from "@babylonjs/core";
import { Entity } from "./Entity";

export class Portal extends Entity {
	public readonly targetPortalId: string;
	public readonly oneWay: boolean;

	public constructor(
		targetPortalId: string,
		position: Vector3 = Vector3.Zero(),
		oneWay = false,
	) {
		super(position);
		this.targetPortalId = targetPortalId;
		this.oneWay = oneWay;
		this.addTag("portal");
	}
}