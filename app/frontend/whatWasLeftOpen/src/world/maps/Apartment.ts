import { Engine, Scene } from "@babylonjs/core";
import { Room } from "../../game/entities/Room";
import { Item } from "../../game/entities/Item";
import { Vector3 } from "@babylonjs/core";

export class Apartment {
	private readonly engine: Engine;
	private readonly canvas: HTMLCanvasElement;

	public constructor(engine: Engine, canvas: HTMLCanvasElement) {
		this.engine = engine;
		this.canvas = canvas;
	}

	public createScene(): Scene {
		const scene = new Scene(this.engine);
		scene.collisionsEnabled = true;
		scene.gravity = new Vector3(0, -1, 0);

		const apartmentRoom = new Room(
			{ width: 10, length: 8, height: 3 },
			Vector3.Zero(),
			"apartment",
		);
		apartmentRoom.enabled = true;

		return scene;
	}
}