import { Scene, UniversalCamera, Vector3 } from "@babylonjs/core";
import { Entity } from "./Entity";

export class Player extends Entity {
	public speed = 4;
	public lookSensitivity = 1;
	public canInteract = true;
	public readonly inventory: Set<string> = new Set();
	private camera: UniversalCamera | null = null;

	public constructor(position: Vector3 = Vector3.Zero()) {
		super(position, "player");
		this.addTag("player");
	}

	public addItem(itemId: string): void {
		this.inventory.add(itemId);
	}

	public hasItem(itemId: string): boolean {
		return this.inventory.has(itemId);
	}

	public removeItem(itemId: string): void {
		this.inventory.delete(itemId);
	}

	public createAndAttachCamera(
		scene: Scene,
		canvas: HTMLCanvasElement,
		spawnPoint: Vector3,
	): UniversalCamera {
		if (this.camera && !this.camera.isDisposed()) {
			return this.camera;
		}

		const playerCamera = new UniversalCamera("playerCamera", spawnPoint.clone(), scene);
		playerCamera.attachControl(canvas, true);
		playerCamera.speed = 0.45;
		playerCamera.angularSensibility = 4000;
		playerCamera.inertia = 0.15;
		playerCamera.minZ = 0.1;
		playerCamera.applyGravity = true;
		playerCamera.checkCollisions = true;
		playerCamera.ellipsoid = new Vector3(0.5, 0.9, 0.5);
		playerCamera.keysUp = [];
		playerCamera.keysDown = [];
		playerCamera.keysLeft = [];
		playerCamera.keysRight = [];

		this.setPosition(playerCamera.position);
		this.camera = playerCamera;

		scene.onBeforeRenderObservable.add(() => {
			if (this.camera && !this.camera.isDisposed()) {
				this.setPosition(this.camera.position);
			}
		});

		return playerCamera;
	}

	public getCamera(): UniversalCamera | null {
		if (this.camera && this.camera.isDisposed()) {
			this.camera = null;
		}

		return this.camera;
	}
}