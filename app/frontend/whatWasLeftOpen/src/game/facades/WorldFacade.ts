import { Engine, Scene } from "@babylonjs/core";
import { Corridor } from "../../world/maps/Corridor";
import { Apartment } from "../../world/maps/Apartment";

export class WorldFacade {
	private corridorScene: Scene | null = null;
	private apartmentScene: Scene | null = null;
	public constructor(
		private readonly engine: Engine,
		private readonly canvas: HTMLCanvasElement,
	) {}

	public getCorridorScene(): Scene {
		if (this.corridorScene && this.corridorScene.isDisposed) {
			this.corridorScene = null;
		}
		if (!this.corridorScene) {
			this.corridorScene = new Corridor(this.engine, this.canvas).createScene();
		}
		return this.corridorScene;
	}

	public getApartmentScene(): Scene {
		if (this.apartmentScene && this.apartmentScene.isDisposed) {
			this.apartmentScene = null;
		}
		if (!this.apartmentScene) {
			this.apartmentScene = new Apartment(this.engine, this.canvas).createScene();
		}
		return this.apartmentScene;
	}
}
