import { Engine, Scene, UniversalCamera } from "@babylonjs/core";
import { WorldBuilder } from "../WorldBuilder";

export class WorldFacade {
	private readonly engine: Engine;
	private readonly canvas: HTMLCanvasElement;
	private currentScene: Scene | null = null;

	public constructor(engine: Engine, canvas: HTMLCanvasElement) {
		this.engine = engine;
		this.canvas = canvas;
	}

	public getWorldScene(playerCamera?: UniversalCamera): Scene {
		const worldBuilder = new WorldBuilder(this.engine, this.canvas);
		const scene = worldBuilder.buildWorld("V_C");
		this.currentScene = scene;

		// Ajouter la caméra du joueur à la scène
		if (playerCamera) {
			scene.activeCamera = playerCamera;
			// Positionner le joueur au spawn du couloir vieux
			playerCamera.position = new (window as any).Vector3(0, 1.8, -(12/2) + 6);
			playerCamera.attachControl(this.canvas, true);
		}

		return scene;
	}

	public getCurrentScene(): Scene | null {
		return this.currentScene;
	}
}
