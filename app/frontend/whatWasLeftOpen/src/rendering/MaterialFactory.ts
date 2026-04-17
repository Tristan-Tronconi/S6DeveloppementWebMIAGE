import { Color3, Scene, StandardMaterial, Texture } from "@babylonjs/core";

export class MaterialFactory {
	private static texturePath(relativePath: string): string {
		return `${import.meta.env.BASE_URL}assets/textures/${relativePath}`;
	}

	private static configureTextureTiling(texture: Texture, tileX = 1, tileY = 1): void {
		texture.wrapU = Texture.WRAP_ADDRESSMODE;
		texture.wrapV = Texture.WRAP_ADDRESSMODE;
		texture.uScale = tileX;
		texture.vScale = tileY;
	}

	public static createBasicMaterial(
		scene: Scene,
		label: string,
		diffuseColor: Color3,
		specularColor?: Color3,
	): StandardMaterial {
		const mat = new StandardMaterial(label, scene);
		mat.diffuseColor = diffuseColor;
		mat.specularColor = specularColor ?? new Color3(0.1, 0.1, 0.1);
		mat.specularPower = 16;
		return mat;
	}

	public static createWallMaterial(
		scene: Scene,
		label: string,
		textureUrl?: string,
		tileX = 1,
		tileY = 1,
	): StandardMaterial {
		const mat = new StandardMaterial(label, scene);
		mat.diffuseColor = new Color3(0.55, 0.55, 0.58);
		mat.specularColor = new Color3(0.05, 0.05, 0.05);

		if (textureUrl) {
			const texture = new Texture(textureUrl, scene);
			this.configureTextureTiling(texture, tileX, tileY);
			mat.diffuseTexture = texture;
		}

		return mat;
	}

	public static createFloorMaterial(
		scene: Scene,
		label: string,
		textureUrl?: string,
		tileX = 1,
		tileY = 1,
	): StandardMaterial {
		const mat = new StandardMaterial(label, scene);
		mat.diffuseColor = new Color3(0.28, 0.28, 0.28);
		mat.specularColor = new Color3(0, 0, 0);

		if (textureUrl) {
			const texture = new Texture(textureUrl, scene);
			this.configureTextureTiling(texture, tileX, tileY);
			mat.diffuseTexture = texture;
		}

		return mat;
	}


	public static createCeilingMaterial(
		scene: Scene,
		label: string,
		textureUrl?: string,
		tileX = 1,
		tileY = 1,
	): StandardMaterial {
		const mat = new StandardMaterial(label, scene);
		mat.diffuseColor = new Color3(0.98, 0.95, 0.9);
		mat.specularColor = new Color3(0.02, 0.02, 0.02);
		mat.backFaceCulling = false;

		if (textureUrl) {
			const texture = new Texture(textureUrl, scene);
			this.configureTextureTiling(texture, tileX, tileY);
			mat.diffuseTexture = texture;
		}

		return mat;
	}

	public static getMainWallTexture(isNewBuilding: boolean = false): string {
		return isNewBuilding
			? this.texturePath("main_walls_used/Wood077_1K-JPG_Color.jpg")
			: this.texturePath("main_walls/Wood078_1K-JPG_Color.jpg");
	}

	public static getMainCeilingTexture(): string {
		return this.texturePath("main_ceilling/Plaster001_1K-JPG_Color.jpg");
	}

	public static getMainFloorTexture(isNewBuilding: boolean = false): string {
		return isNewBuilding
			? this.texturePath("main_floor_used/Planks037B_1K-JPG_Color.jpg")
			: this.texturePath("main_floor/Planks035B_1K-JPG_Color.jpg");
	}
} 