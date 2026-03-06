import {
	Color3,
	DirectionalLight,
	Engine,
	HemisphericLight,
	MeshBuilder,
	Scene,
	StandardMaterial,
	UniversalCamera,
	Vector3,
} from "@babylonjs/core";
import { CorridorLayout } from "../layout/CorridorLayout";

export class Corridor {
	public constructor(
		private readonly engine: Engine,
		private readonly canvas: HTMLCanvasElement,
		private readonly layout: CorridorLayout = new CorridorLayout(),
	) {}

	public createScene(): Scene {
		const scene = new Scene(this.engine);
		scene.collisionsEnabled = true;
		scene.gravity = new Vector3(0, -1, 0);

		const camera = new UniversalCamera("playerCamera", this.layout.spawnPoint, scene);
		camera.attachControl(this.canvas, true);
		camera.speed = 0.45;
		camera.angularSensibility = 4000;
		camera.inertia = 0.15;
		camera.minZ = 0.1;
		camera.applyGravity = true;
		camera.checkCollisions = true;
		camera.ellipsoid = new Vector3(0.5, 0.9, 0.5);
		camera.keysUp = [];
		camera.keysDown = [];
		camera.keysLeft = [];
		camera.keysRight = [];

		const hemiLight = new HemisphericLight("ambient", new Vector3(0, 1, 0), scene);
		hemiLight.intensity = 0.65;

		const dirLight = new DirectionalLight("sun", new Vector3(0, -1, 1), scene);
		dirLight.position = new Vector3(0, 20, -25);
		dirLight.intensity = 0.4;

		const floor = MeshBuilder.CreateGround(
			"floor",
			{
				width: this.layout.floorWidth,
				height: this.layout.floorLength,
			},
			scene,
		);
		floor.checkCollisions = true;

		const floorMaterial = new StandardMaterial("floorMat", scene);
		floorMaterial.diffuseColor = new Color3(0.28, 0.28, 0.28);
		floorMaterial.specularColor = new Color3(0, 0, 0);
		floor.material = floorMaterial;

		const wallMaterial = new StandardMaterial("wallMat", scene);
		wallMaterial.diffuseColor = new Color3(0.55, 0.55, 0.58);
		wallMaterial.specularColor = new Color3(0, 0, 0);

		const leftWall = MeshBuilder.CreateBox(
			"leftWall",
			{
				width: this.layout.wallThickness,
				height: this.layout.wallHeight,
				depth: this.layout.floorLength,
			},
			scene,
		);
		leftWall.position = new Vector3(-(this.layout.floorWidth / 2), this.layout.wallHeight / 2, 0);
		leftWall.material = wallMaterial;
		leftWall.checkCollisions = true;

		const rightWall = MeshBuilder.CreateBox(
			"rightWall",
			{
				width: this.layout.wallThickness,
				height: this.layout.wallHeight,
				depth: this.layout.floorLength,
			},
			scene,
		);
		rightWall.position = new Vector3(this.layout.floorWidth / 2, this.layout.wallHeight / 2, 0);
		rightWall.material = wallMaterial;
		rightWall.checkCollisions = true;

		const endWall = MeshBuilder.CreateBox(
			"endWall",
			{
				width: this.layout.floorWidth,
				height: this.layout.wallHeight,
				depth: this.layout.wallThickness,
			},
			scene,
		);
		endWall.position = new Vector3(0, this.layout.wallHeight / 2, this.layout.floorLength / 2);
		endWall.material = wallMaterial;
		endWall.checkCollisions = true;

		scene.onPointerDown = () => {
			if (document.pointerLockElement !== this.canvas) {
				this.canvas.requestPointerLock();
			}
		};

		return scene;
	}
}
