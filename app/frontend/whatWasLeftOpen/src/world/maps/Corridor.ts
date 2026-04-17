import {
	Color3,
	MeshBuilder,
	Scene,
	Vector3,
} from "@babylonjs/core";
import { MaterialFactory } from "../../rendering/MaterialFactory";
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

export interface CorridorOpenings {
	left?: number[];
	right?: number[];
	doorWidth?: number;
	doorHeight?: number;
}

export class Corridor {
	public constructor(private readonly layout: RoomLayout = new RoomLayout()) {}

	public get spawnPoint(): Vector3 {
		return this.layout.spawnPoint;
	}

	public build(scene: Scene, openings: CorridorOpenings = {}): CorridorConnection {
		const floor = MeshBuilder.CreateGround(
			"corridorFloor", { width: this.layout.floorWidth, height: this.layout.floorLength },
			scene,
		);
		floor.checkCollisions = true;

		const floorMaterial = MaterialFactory.createFloorMaterial(
			scene,
			"corridorFloorMat",
			MaterialFactory.getMainFloorTexture(false),
			Math.max(1, this.layout.floorWidth / 2),
			Math.max(1, this.layout.floorLength / 2),
		);
		floor.material = floorMaterial;

		const wallMaterial = MaterialFactory.createWallMaterial(
			scene,
			"corridorWallMat",
			MaterialFactory.getMainWallTexture(false),
			Math.max(1, this.layout.floorLength / 3),
			Math.max(1, this.layout.wallHeight / 2),
		);
		const width = this.layout.wallThickness;
		const height = this.layout.wallHeight;
		const length = this.layout.floorLength;
		const doorwayWidth = openings.doorWidth ?? 3;
		const doorwayHeight = openings.doorHeight ?? 3;

		const createSideWall = (namePrefix: string, x: number, openingCenters: number[] = []): void => {
			const sortedOpenings = [...openingCenters].sort((a, b) => a - b);
			let cursor = -(length / 2);

			for (const openingCenter of sortedOpenings) {
				const openingStart = Math.max(-(length / 2), openingCenter - doorwayWidth / 2);
				const openingEnd = Math.min(length / 2, openingCenter + doorwayWidth / 2);

				if (openingStart > cursor) {
					const segmentDepth = openingStart - cursor;
					const segment = MeshBuilder.CreateBox(
						`${namePrefix}Wall_${cursor.toFixed(2)}`,
						{ width, height, depth: segmentDepth },
						scene,
					);
					segment.position = new Vector3(x, height / 2, cursor + segmentDepth / 2);
					segment.material = wallMaterial;
					segment.checkCollisions = true;
				}

				const lintelHeight = Math.max(0.4, height - doorwayHeight);
				const lintel = MeshBuilder.CreateBox(
					`${namePrefix}Lintel_${openingCenter.toFixed(2)}`,
					{ width, height: lintelHeight, depth: doorwayWidth },
					scene,
				);
				lintel.position = new Vector3(x, doorwayHeight + lintelHeight / 2, openingCenter);
				lintel.material = wallMaterial;
				lintel.checkCollisions = true;

				cursor = openingEnd;
			}

			if (cursor < length / 2) {
				const segmentDepth = length / 2 - cursor;
				const segment = MeshBuilder.CreateBox(
					`${namePrefix}Wall_${cursor.toFixed(2)}_end`,
					{ width, height, depth: segmentDepth },
					scene,
				);
				segment.position = new Vector3(x, height / 2, cursor + segmentDepth / 2);
				segment.material = wallMaterial;
				segment.checkCollisions = true;
			}
		};

		createSideWall("corridorLeft", -(this.layout.floorWidth / 2), openings.left);

		createSideWall("corridorRight", this.layout.floorWidth / 2, openings.right);

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

		const ceilingMatWithTexture = MaterialFactory.createCeilingMaterial(
			scene,
			"corridorCeilingMat",
			MaterialFactory.getMainCeilingTexture(),
			Math.max(1, this.layout.floorWidth / 2),
			Math.max(1, this.layout.floorLength / 2),
		);
		ceiling.material = ceilingMatWithTexture;

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
