import {
	Color3,
	MeshBuilder,
	Scene,
	StandardMaterial,
	Vector3,
} from "@babylonjs/core";
import { CorridorConnection } from "./Corridor";

export class OldChamber {
	private readonly width = 18;
	private readonly length = 10;

	public build(scene: Scene, corridor: CorridorConnection): void {
		const chamberCenterX = corridor.rightWallX - this.width / 2;
		const chamberCenterZ = corridor.endZ + this.length / 2;
		const wallHeight = corridor.wallHeight;
		const wallThickness = corridor.wallThickness;
		const doorwayCenterX = corridor.doorCenterX;

		const floor = MeshBuilder.CreateGround(
			"oldChamberFloor",
			{ width: this.width, height: this.length },
			scene,
		);
		floor.position = new Vector3(chamberCenterX, 0, chamberCenterZ);
		floor.checkCollisions = true;

		const floorMaterial = new StandardMaterial("oldChamberFloorMat", scene);
		floorMaterial.diffuseColor = new Color3(0.24, 0.22, 0.2);
		floorMaterial.specularColor = new Color3(0, 0, 0);
		floor.material = floorMaterial;

		const wallMaterial = new StandardMaterial("oldChamberWallMat", scene);
		wallMaterial.diffuseColor = new Color3(0.46, 0.44, 0.42);
		wallMaterial.specularColor = new Color3(0, 0, 0);

		const rightWall = MeshBuilder.CreateBox(
			"oldChamberRightWall",
			{ width: wallThickness, height: wallHeight, depth: this.length },
			scene,
		);
		rightWall.position = new Vector3(corridor.rightWallX, wallHeight / 2, chamberCenterZ);
		rightWall.material = wallMaterial;
		rightWall.checkCollisions = true;

		const leftWallX = chamberCenterX - this.width / 2;
		const leftWall = MeshBuilder.CreateBox(
			"oldChamberLeftWall",
			{ width: wallThickness, height: wallHeight, depth: this.length },
			scene,
		);
		leftWall.position = new Vector3(leftWallX, wallHeight / 2, chamberCenterZ);
		leftWall.material = wallMaterial;
		leftWall.checkCollisions = true;

		const frontWall = MeshBuilder.CreateBox(
			"oldChamberFrontWall",
			{ width: this.width, height: wallHeight, depth: wallThickness },
			scene,
		);
		frontWall.position = new Vector3(chamberCenterX, wallHeight / 2, corridor.endZ + this.length);
		frontWall.material = wallMaterial;
		frontWall.checkCollisions = true;

		const sharedWallLeftEdgeX = chamberCenterX - this.width / 2;
		const sharedWallRightEdgeX = chamberCenterX + this.width / 2;
		const doorwayLeftEdgeX = doorwayCenterX - corridor.doorWidth / 2;
		const doorwayRightEdgeX = doorwayCenterX + corridor.doorWidth / 2;
		const leftSegmentWidth = doorwayLeftEdgeX - sharedWallLeftEdgeX;
		const rightSegmentWidth = sharedWallRightEdgeX - doorwayRightEdgeX;

		const sharedWallLeft = MeshBuilder.CreateBox(
			"oldChamberSharedWallLeft",
			{ width: leftSegmentWidth, height: wallHeight, depth: wallThickness },
			scene,
		);
		sharedWallLeft.position = new Vector3(
			sharedWallLeftEdgeX + leftSegmentWidth / 2,
			wallHeight / 2,
			corridor.endZ,
		);
		sharedWallLeft.material = wallMaterial;
		sharedWallLeft.checkCollisions = true;

		const sharedWallRight = MeshBuilder.CreateBox(
			"oldChamberSharedWallRight",
			{ width: rightSegmentWidth, height: wallHeight, depth: wallThickness },
			scene,
		);
		sharedWallRight.position = new Vector3(
			doorwayRightEdgeX + rightSegmentWidth / 2,
			wallHeight / 2,
			corridor.endZ,
		);
		sharedWallRight.material = wallMaterial;
		sharedWallRight.checkCollisions = true;

		const lintelHeight = Math.max(0.4, wallHeight - corridor.doorHeight);
		const sharedWallTop = MeshBuilder.CreateBox(
			"oldChamberSharedWallTop",
			{ width: corridor.doorWidth, height: lintelHeight, depth: wallThickness },
			scene,
		);
		sharedWallTop.position = new Vector3(
			doorwayCenterX,
			corridor.doorHeight + lintelHeight / 2,
			corridor.endZ,
		);
		sharedWallTop.material = wallMaterial;
		sharedWallTop.checkCollisions = true;

		const ceiling = MeshBuilder.CreateGround(
			"oldChamberCeiling",
			{ width: this.width, height: this.length },
			scene,
		);
		ceiling.position = new Vector3(chamberCenterX, wallHeight, chamberCenterZ);
		ceiling.rotation.z = Math.PI;
		ceiling.checkCollisions = true;

		const ceilingMaterial = new StandardMaterial("oldChamberCeilingMat", scene);
		ceilingMaterial.diffuseColor = new Color3(0.27, 0.26, 0.25);
		ceilingMaterial.specularColor = new Color3(0, 0, 0);
		ceiling.material = ceilingMaterial;
	}
}
