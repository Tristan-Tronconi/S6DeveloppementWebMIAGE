import { DirectionalLight, Engine, HemisphericLight, Scene, Vector3 } from "@babylonjs/core";
import { Player } from "../entities/Player";
import { Corridor } from "../../world/maps/Corridor";
import { OldChamber } from "../../world/maps/OldChamber";

export class WorldFacade {
	private worldScene: Scene | null = null;

	public constructor(
		private readonly engine: Engine,
		private readonly canvas: HTMLCanvasElement,
	) {}

	public getWorldScene(player: Player): Scene {
		if (this.worldScene && this.worldScene.isDisposed) {
			this.worldScene = null;
		}

		if (!this.worldScene) {
			this.worldScene = new Scene(this.engine);
			this.worldScene.collisionsEnabled = true;
			this.worldScene.gravity = new Vector3(0, -1, 0);

			const corridor = new Corridor();
			player.createAndAttachCamera(this.worldScene, this.canvas, corridor.spawnPoint);

			const hemiLight = new HemisphericLight("ambient", new Vector3(0, 1, 0), this.worldScene);
			hemiLight.intensity = 0.65;

			const dirLight = new DirectionalLight("sun", new Vector3(0, -1, 1), this.worldScene);
			dirLight.position = new Vector3(0, 20, -25);
			dirLight.intensity = 0.4;

			const corridorConnection = corridor.build(this.worldScene);
			new OldChamber().build(this.worldScene, corridorConnection);

			this.worldScene.onPointerDown = () => {
				if (document.pointerLockElement !== this.canvas) {
					this.canvas.requestPointerLock();
				}
			};
		}

		return this.worldScene;
	}
}
