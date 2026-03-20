import { Engine, Scene } from "@babylonjs/core";
import { Corridor } from "../../world/maps/Corridor";

export class WorldFacade {
	public constructor(
		private readonly engine: Engine,
		private readonly canvas: HTMLCanvasElement,
	) {}

	public createCorridorScene(): Scene {
		const corridor = new Corridor(this.engine, this.canvas);
		return corridor.createScene();
	}

	public createApartmentScene(): Scene {

		const apartment = new Apartment(this.engine, this.canvas);
		return apartment.createScene();
	}
}
