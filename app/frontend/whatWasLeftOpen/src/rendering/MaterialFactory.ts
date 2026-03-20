import { Color3, Scene, StandardMaterial, Texture } from "@babylonjs/core";

export class MaterialFactory {
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
	): StandardMaterial {
		const mat = new StandardMaterial(label, scene);
		mat.diffuseColor = new Color3(0.55, 0.55, 0.58);
		mat.specularColor = new Color3(0.05, 0.05, 0.05);

		if (textureUrl) {
			mat.diffuseTexture = new Texture(textureUrl, scene);
		}

		return mat;
	}

	public static createFloorMaterial(
		scene: Scene,
		label: string,
		textureUrl?: string,
	): StandardMaterial {
		const mat = new StandardMaterial(label, scene);
		mat.diffuseColor = new Color3(0.28, 0.28, 0.28);
		mat.specularColor = new Color3(0, 0, 0);

		if (textureUrl) {
			mat.diffuseTexture = new Texture(textureUrl, scene);
		}

		return mat;
	}
} 