import {
	Engine,
	HemisphericLight,
	MeshBuilder,
	Scene,
	Vector3,
} from "@babylonjs/core";
import { MaterialFactory } from "../../rendering/MaterialFactory";

export class Bathroom {
	public constructor(private readonly engine: Engine, private readonly canvas: HTMLCanvasElement) {}

	public createScene(): Scene {
		const scene = new Scene(this.engine);
		scene.collisionsEnabled = true;

		new HemisphericLight("bathroomLight", new Vector3(0, 1, 0), scene).intensity = 0.8;

		const floor = MeshBuilder.CreateGround("bathroomFloor", { width: 6, height: 6 }, scene);
		floor.checkCollisions = true;

		const floorMaterial = MaterialFactory.createFloorMaterial(
			scene,
			"bathroomFloorMat",
			MaterialFactory.getMainFloorTexture(false),
			3,
			3,
		);
		floor.material = floorMaterial;

		const wallMaterial = MaterialFactory.createWallMaterial(
			scene,
			"bathroomWallMat",
			MaterialFactory.getMainWallTexture(false),
			2,
			2,
		);

		const wallDepth = 0.4;
		const wallHeight = 3;

		const backWall = MeshBuilder.CreateBox("bathroomBackWall", { width: 6, height: wallHeight, depth: wallDepth }, scene);
		backWall.position = new Vector3(0, wallHeight / 2, 3);
		backWall.material = wallMaterial;
		backWall.checkCollisions = true;

		const leftWall = MeshBuilder.CreateBox("bathroomLeftWall", { width: wallDepth, height: wallHeight, depth: 6 }, scene);
		leftWall.position = new Vector3(-3, wallHeight / 2, 0);
		leftWall.material = wallMaterial;
		leftWall.checkCollisions = true;

		const rightWall = MeshBuilder.CreateBox("bathroomRightWall", { width: wallDepth, height: wallHeight, depth: 6 }, scene);
		rightWall.position = new Vector3(3, wallHeight / 2, 0);
		rightWall.material = wallMaterial;
		rightWall.checkCollisions = true;

		const frontWallLeft = MeshBuilder.CreateBox("bathroomFrontWallLeft", { width: 2.2, height: wallHeight, depth: wallDepth }, scene);
		frontWallLeft.position = new Vector3(-1.9, wallHeight / 2, -3);
		frontWallLeft.material = wallMaterial;
		frontWallLeft.checkCollisions = true;

		const frontWallRight = MeshBuilder.CreateBox("bathroomFrontWallRight", { width: 2.2, height: wallHeight, depth: wallDepth }, scene);
		frontWallRight.position = new Vector3(1.9, wallHeight / 2, -3);
		frontWallRight.material = wallMaterial;
		frontWallRight.checkCollisions = true;

		const ceiling = MeshBuilder.CreateGround("bathroomCeiling", { width: 6, height: 6 }, scene);
		ceiling.position = new Vector3(0, wallHeight, 0);
		ceiling.rotation.z = Math.PI;
		ceiling.checkCollisions = true;
		ceiling.material = MaterialFactory.createCeilingMaterial(
			scene,
			"bathroomCeilingMat",
			MaterialFactory.getMainCeilingTexture(),
			3,
			3,
		);

		scene.onPointerDown = () => {
			if (document.pointerLockElement !== this.canvas) {
				this.canvas.requestPointerLock();
			}
		};

		return scene;
	}
}