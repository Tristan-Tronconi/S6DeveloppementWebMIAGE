import { Color3, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";
import { MaterialFactory } from "../../rendering/MaterialFactory";

export class WC {
	private readonly width = 8;
	private readonly length = 6;
	private readonly wallHeight = 2.5;

	public build(scene: Scene, position: Vector3 = Vector3.Zero(), portalColor?: string): void {
		const centerX = position.x;
		const centerZ = position.z;

		// Sol carrelé
		const floor = MeshBuilder.CreateGround("wcFloor", { width: this.width, height: this.length }, scene);
		floor.position = new Vector3(centerX, 0, centerZ);
		floor.checkCollisions = true;

		const floorMat = MaterialFactory.createFloorMaterial(
			scene,
			"wcFloorMat",
			MaterialFactory.getMainFloorTexture(false),
			Math.max(1, this.width / 2),
			Math.max(1, this.length / 2),
		);
		floor.material = floorMat;

		// Murs carrelés blancs
		const wallMaterial = new StandardMaterial("wcWallMat", scene);
		wallMaterial.diffuseColor = new Color3(0.95, 0.95, 0.98);

		const wallThickness = 0.2;
		const halfWidth = this.width / 2;
		const halfLength = this.length / 2;

		// Tous les murs (WC fermé)
		const createWall = (name: string, size: [number, number, number], pos: [number, number, number]) => {
			const wall = MeshBuilder.CreateBox(`wc${name}Wall`, { width: size[0], height: size[1], depth: size[2] }, scene);
			wall.position = new Vector3(pos[0], pos[1], pos[2]);
			wall.material = wallMaterial;
			wall.checkCollisions = true;
		};

		createWall("back", [this.width, this.wallHeight, wallThickness], [centerX, this.wallHeight/2, centerZ + halfLength]);
		createWall("left", [wallThickness, this.wallHeight, this.length], [centerX - halfWidth, this.wallHeight/2, centerZ]);
		createWall("right", [wallThickness, this.wallHeight, this.length], [centerX + halfWidth, this.wallHeight/2, centerZ]);
		createWall("front", [this.width, this.wallHeight, wallThickness], [centerX, this.wallHeight/2, centerZ - halfLength]);

		// Plafond
		const ceiling = MeshBuilder.CreateGround("wcCeiling", { width: this.width, height: this.length }, scene);
		ceiling.position = new Vector3(centerX, this.wallHeight, centerZ);
		ceiling.rotation.z = Math.PI;
		ceiling.checkCollisions = true;

		const ceilingMatWithTexture = MaterialFactory.createCeilingMaterial(
			scene,
			"wcCeilingMat",
			MaterialFactory.getMainCeilingTexture(),
			Math.max(1, this.width / 2),
			Math.max(1, this.length / 2),
		);
		ceiling.material = ceilingMatWithTexture;

		// Portail
		if (portalColor) {
			this.createPortal(scene, portalColor, position.add(new Vector3(0, 1.3, halfLength - 0.4)), Vector3.Forward());
		}
	}

	private createPortal(scene: Scene, color: string, position: Vector3, direction: Vector3): void {
		const portal = MeshBuilder.CreatePlane(`wc_portal_${color}`, { width: 1.5, height: 2 }, scene);
		portal.position = position;
		portal.rotation = direction;

		const portalMat = new StandardMaterial(`wc_portal_${color}_mat`, scene);
		portalMat.diffuseColor = this.getPortalColorRGB(color);
		portalMat.emissiveColor = new Color3(this.getPortalColorRGB(color).r * 0.35, this.getPortalColorRGB(color).g * 0.35, this.getPortalColorRGB(color).b * 0.35);
		portal.material = portalMat;
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
