import { Color3, HemisphericLight, PointLight, Scene, Vector3 } from "@babylonjs/core";

export interface LightingPreset {
	name: string;
	apply: (scene: Scene) => void;
}

export const LIGHTING_PRESETS = {
	apartment: {
		name: "Apartment",
		apply: (scene: Scene) => {
			const hemi = new HemisphericLight("apartment_hemi", new Vector3(0, 0, 1), scene);
			hemi.intensity = 0.7;
			hemi.groundColor = new Color3(0.9, 0.9, 0.95);
		},
	},
	hiddenRoom: {
		name: "Hidden Room",
		apply: (scene: Scene) => {
			const hemi = new HemisphericLight("hidden_hemi", new Vector3(0, 1, 0), scene);
			hemi.intensity = 0.5;
			hemi.groundColor = new Color3(0.6, 0.7, 0.9);

			const point = new PointLight("hidden_point", new Vector3(0, 3, 0), scene);
			point.intensity = 0.6;
			point.range = 20;
		},
	},
	dark: {
		name: "Dark",
		apply: (scene: Scene) => {
			const hemi = new HemisphericLight("dark_hemi", new Vector3(0, 1, 0), scene);
			hemi.intensity = 0.3;
			hemi.groundColor = new Color3(0.4, 0.4, 0.5);
		},
	},
}; 