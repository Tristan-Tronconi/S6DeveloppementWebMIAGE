import {
	Color3,
	MeshBuilder,
	Scene,
	StandardMaterial,
	Vector3,
} from "@babylonjs/core";
import { RoomLayout } from "../layout/CorridorLayout";

export interface CorridorConnection {
	endZ: number;
	rightWallX: number;
	doorWidth: number;
	doorHeight: number;
	doorCenterX: number;
	wallHeight: number;
	wallThickness: number;
}

export class Corridor {
	public constructor(private readonly layout: RoomLayout = new RoomLayout()) {}

	public get spawnPoint(): Vector3 {
		return this.layout.spawnPoint;
	}

	public build(scene: Scene): CorridorConnection {
		const floor = MeshBuilder.CreateGround(
			"corridorFloor", { width: this.layout.floorWidth, height: this.layout.floorLength },
			scene,
		);
		floor.checkCollisions = true;

		const floorMaterial = new StandardMaterial("corridorFloorMat", scene);
		floorMaterial.diffuseColor = new Color3(0.28, 0.28, 0.28);
		floorMaterial.specularColor = new Color3(0, 0, 0);
		floor.material = floorMaterial;

		const wallMaterial = new StandardMaterial("corridorWallMat", scene);
		wallMaterial.diffuseColor = new Color3(0.55, 0.55, 0.58);
		wallMaterial.specularColor = new Color3(0, 0, 0);
		const width = this.layout.wallThickness;
		const height = this.layout.wallHeight;
		const length = this.layout.floorLength;
		const doorwayWidth = 3;
		const doorwayHeight = 3;

		const leftWall = MeshBuilder.CreateBox(
			"corridorLeftWall", { width, height, depth: length },
			scene,
		);
		leftWall.position = new Vector3(-(this.layout.floorWidth / 2), height / 2, 0);
		leftWall.material = wallMaterial;
		leftWall.checkCollisions = true;

		const rightWall = MeshBuilder.CreateBox(
			"corridorRightWall", { width, height, depth: length },
			scene,
		);
		rightWall.position = new Vector3(this.layout.floorWidth / 2, height / 2, 0);
		rightWall.material = wallMaterial;
		rightWall.checkCollisions = true;

		const sideWallWidth = (this.layout.floorWidth - doorwayWidth) / 2;
		const endLeftWall = MeshBuilder.CreateBox(
			"corridorEndWallLeft",
			{ width: sideWallWidth, height, depth: width },
			scene,
		);
		endLeftWall.position = new Vector3(-(doorwayWidth / 2) - (sideWallWidth / 2), height / 2, length / 2);
		endLeftWall.material = wallMaterial;
		endLeftWall.checkCollisions = true;

		const endRightWall = MeshBuilder.CreateBox(
			"corridorEndWallRight",
			{ width: sideWallWidth, height, depth: width },
			scene,
		);
		endRightWall.position = new Vector3((doorwayWidth / 2) + (sideWallWidth / 2), height / 2, length / 2);
		endRightWall.material = wallMaterial;
		endRightWall.checkCollisions = true;

		const lintelHeight = Math.max(0.4, height - doorwayHeight);
		const endTopWall = MeshBuilder.CreateBox(
			"corridorEndWallTop",
			{ width: doorwayWidth, height: lintelHeight, depth: width },
			scene,
		);
		endTopWall.position = new Vector3(0, doorwayHeight + lintelHeight / 2, length / 2);
		endTopWall.material = wallMaterial;
		endTopWall.checkCollisions = true;

		const startWall = MeshBuilder.CreateBox(
			"corridorStartWall",
			{ width: this.layout.floorWidth, height, depth: width },
			scene,
		);
		startWall.position = new Vector3(0, height / 2, -(length / 2));
		startWall.material = wallMaterial;
		startWall.checkCollisions = true;

		const ceiling = MeshBuilder.CreateGround(
			"corridorCeiling", { width: this.layout.floorWidth, height: length },
			scene,
		);
		ceiling.position = new Vector3(0, height, 0);
		ceiling.rotation.z = Math.PI;
		ceiling.checkCollisions = true;

		const ceilingMaterial = new StandardMaterial("corridorCeilingMat", scene);
		ceilingMaterial.diffuseColor = new Color3(0.3, 0.3, 0.3);
		ceilingMaterial.specularColor = new Color3(0, 0, 0);
		ceiling.material = ceilingMaterial;

		return {
			endZ: length / 2,
			rightWallX: this.layout.floorWidth / 2,
			doorWidth: doorwayWidth,
			doorHeight: doorwayHeight,
			doorCenterX: 0,
			wallHeight: height,
			wallThickness: width,
		};
	}
}
