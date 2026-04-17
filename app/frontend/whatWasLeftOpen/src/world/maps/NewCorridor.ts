import { Color3, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";
import { MaterialFactory } from "../../rendering/MaterialFactory";

export class NewCorridor {
	private readonly width = 6;
	private readonly length = 80;
	private readonly wallHeight = 3;
	private readonly wallThickness = 0.25;

	public build(scene: Scene, position: Vector3 = Vector3.Zero()): void {
		const centerX = position.x;
		const centerZ = position.z;

		// Sol moderne
		const floor = MeshBuilder.CreateGround("newCorridorFloor", { width: this.width, height: this.length }, scene);
		floor.position = new Vector3(centerX, 0, centerZ);
		floor.checkCollisions = true;

		const floorMat = MaterialFactory.createFloorMaterial(
			scene,
			"newCorridorFloorMat",
			MaterialFactory.getMainFloorTexture(true),
			Math.max(1, this.width / 2),
			Math.max(1, this.length / 2),
		);
		floor.material = floorMat;

		// Murs
		const wallMaterial = MaterialFactory.createWallMaterial(
			scene,
			"newCorridorWallMat",
			MaterialFactory.getMainWallTexture(true),
			Math.max(1, this.length / 3),
			Math.max(1, this.wallHeight / 2),
		);

		// Mur gauche
		const leftWall = MeshBuilder.CreateBox("newCorridorLeftWall", { width: this.wallThickness, height: this.wallHeight, depth: this.length }, scene);
		leftWall.position = new Vector3(centerX - this.width/2, this.wallHeight/2, centerZ);
		leftWall.material = wallMaterial;
		leftWall.checkCollisions = true;

		// Mur droit
		const rightWall = MeshBuilder.CreateBox("newCorridorRightWall", { width: this.wallThickness, height: this.wallHeight, depth: this.length }, scene);
		rightWall.position = new Vector3(centerX + this.width/2, this.wallHeight/2, centerZ);
		rightWall.material = wallMaterial;
		rightWall.checkCollisions = true;

		// Plafond
		const ceiling = MeshBuilder.CreateGround("newCorridorCeiling", { width: this.width, height: this.length }, scene);
		ceiling.position = new Vector3(centerX, this.wallHeight, centerZ);
		ceiling.rotation.z = Math.PI;
		ceiling.checkCollisions = true;

		const ceilingMatWithTexture = MaterialFactory.createCeilingMaterial(
			scene,
			"newCorridorCeilingMat",
			MaterialFactory.getMainCeilingTexture(),
			Math.max(1, this.width / 2),
			Math.max(1, this.length / 2),
		);
		ceiling.material = ceilingMatWithTexture;

		// Des fenêtres le long du couloir (sur les murs gauche et droit)
		this.createWindowsAlongCorridor(scene, centerX, centerZ, wallMaterial);
	}

	private createWindowsAlongCorridor(scene: Scene, centerX: number, centerZ: number, wallMat: StandardMaterial): void {
		const windowMat = new StandardMaterial("corridorWindowMat", scene);
		windowMat.diffuseColor = new Color3(0.5, 0.7, 1.0);
		windowMat.alpha = 0.3;
		windowMat.backFaceCulling = false;

		const windowWidth = 1.2;
		const windowHeight = 1.5;
		const spacing = 8;
		const numWindows = Math.floor(this.length / spacing) - 1;

		for (let i = 1; i <= numWindows; i++) {
			const zPos = centerZ + (this.length/2) - i * spacing;

			// Fenêtre mur gauche
			const winLeft = MeshBuilder.CreatePlane(`newCorrWindowLeft_${i}`, { width: windowWidth, height: windowHeight }, scene);
			winLeft.position = new Vector3(centerX - this.width/2 - 0.05, 1.8, zPos);
			winLeft.rotation.y = Math.PI / 2;
			winLeft.material = windowMat;

			// Fenêtre mur droit
			const winRight = MeshBuilder.CreatePlane(`newCorrWindowRight_${i}`, { width: windowWidth, height: windowHeight }, scene);
			winRight.position = new Vector3(centerX + this.width/2 + 0.05, 1.8, zPos);
			winRight.rotation.y = -Math.PI / 2;
			winRight.material = windowMat;
		}
	}
}
