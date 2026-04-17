import { Color3, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";
import { MaterialFactory } from "../../rendering/MaterialFactory";

export class LivingRoom {
	private readonly width = 12;
	private readonly length = 18;
	private readonly wallHeight = 3;

	public build(
		scene: Scene,
		position: Vector3 = Vector3.Zero(),
		portalColor?: string,
		isNewBuilding = false,
	): void {
		const centerX = position.x;
		const centerZ = position.z;

		// Sol en bois
		const floor = MeshBuilder.CreateGround("livingFloor", { width: this.width, height: this.length }, scene);
		floor.position = new Vector3(centerX, 0, centerZ);
		floor.checkCollisions = true;

		const floorMat = MaterialFactory.createFloorMaterial(
			scene,
			"livingFloorMat",
			MaterialFactory.getMainFloorTexture(isNewBuilding),
			Math.max(1, this.width / 2),
			Math.max(1, this.length / 2),
		);
		floor.material = floorMat;

		// Murs
		const wallMaterial = MaterialFactory.createWallMaterial(
			scene,
			"livingWallMat",
			MaterialFactory.getMainWallTexture(isNewBuilding),
			Math.max(1, this.length / 2),
			Math.max(1, this.wallHeight / 2),
		);
		const wallThickness = 0.3;
		const halfWidth = this.width / 2;
		const halfLength = this.length / 2;

		// Murs
		const walls = [
			{ name: "back", dims: [this.width, this.wallHeight, wallThickness], pos: [centerX, this.wallHeight/2, centerZ + halfLength] },
			{ name: "left", dims: [wallThickness, this.wallHeight, this.length], pos: [centerX - halfWidth, this.wallHeight/2, centerZ] },
			{ name: "right", dims: [wallThickness, this.wallHeight, this.length], pos: [centerX + halfWidth, this.wallHeight/2, centerZ] },
			{ name: "front", dims: [this.width, this.wallHeight, wallThickness], pos: [centerX, this.wallHeight/2, centerZ - halfLength] },
		];

		walls.forEach(wall => {
			const mesh = MeshBuilder.CreateBox(`living${wall.name}Wall`, { width: wall.dims[0], height: wall.dims[1], depth: wall.dims[2] }, scene);
			mesh.position = new Vector3(wall.pos[0], wall.pos[1], wall.pos[2]);
			mesh.material = wallMaterial;
			mesh.checkCollisions = true;
		});

		// Plafond
		const ceiling = MeshBuilder.CreateGround("livingCeiling", { width: this.width, height: this.length }, scene);
		ceiling.position = new Vector3(centerX, this.wallHeight, centerZ);
		ceiling.rotation.z = Math.PI;
		ceiling.checkCollisions = true;

		const ceilingMatWithTexture = MaterialFactory.createCeilingMaterial(
			scene,
			"livingCeilingMat",
			MaterialFactory.getMainCeilingTexture(),
			Math.max(1, this.width / 2),
			Math.max(1, this.length / 2),
		);
		ceiling.material = ceilingMatWithTexture;

		// Portail
		if (portalColor) {
			this.createPortal(scene, portalColor, position.add(new Vector3(0, 1.5, halfLength - 0.5)), Vector3.Forward());
		}

		// Fenêtres
		this.createWindows(scene, centerX, centerZ, wallMaterial);
	}

	private createPortal(scene: Scene, color: string, position: Vector3, direction: Vector3): void {
		const portal = MeshBuilder.CreatePlane(`portal_${color}_living`, { width: 2, height: 2.5 }, scene);
		portal.position = position;
		portal.rotation = direction;

		const portalMat = new StandardMaterial(`portal_${color}_living_mat`, scene);
		portalMat.diffuseColor = this.getPortalColorRGB(color);
		portalMat.emissiveColor = new Color3(this.getPortalColorRGB(color).r * 0.3, this.getPortalColorRGB(color).g * 0.3, this.getPortalColorRGB(color).b * 0.3);
		portal.material = portalMat;
	}

	private createWindows(scene: Scene, centerX: number, centerZ: number, wallMat: StandardMaterial): void {
		// Grandes fenêtres
		const windowMat = new StandardMaterial("livingWindowMat", scene);
		windowMat.diffuseColor = new Color3(0.6, 0.8, 1.0);
		windowMat.alpha = 0.4;
		windowMat.backFaceCulling = false;

		// Fenêtre mur gauche
		const winLeft = MeshBuilder.CreatePlane("livingWindowLeft", { width: 2, height: 2 }, scene);
		winLeft.position = new Vector3(centerX - this.width/2 - 0.1, 1.8, centerZ);
		winLeft.rotation.y = Math.PI / 2;
		winLeft.material = windowMat;

		// Fenêtre mur droit
		const winRight = MeshBuilder.CreatePlane("livingWindowRight", { width: 2, height: 2 }, scene);
		winRight.position = new Vector3(centerX + this.width/2 + 0.1, 1.8, centerZ + 2);
		winRight.rotation.y = -Math.PI / 2;
		winRight.material = windowMat;
	}

	private getPortalColorRGB(color: string): Color3 {
		const colors: Record<string, [number, number, number]> = {
			red: [0.8, 0.2, 0.2],
			pink: [0.9, 0.4, 0.7],
			green: [0.2, 0.7, 0.3],
			yellow: [0.95, 0.9, 0.3],
			purple: [0.6, 0.3, 0.8],
			blue: [0.3, 0.6, 0.9],
		};
		const rgb = colors[color] || [1, 1, 1];
		return new Color3(rgb[0], rgb[1], rgb[2]);
	}
}
