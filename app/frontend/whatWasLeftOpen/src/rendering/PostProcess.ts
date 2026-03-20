import { PostProcess as BabylonPostProcess, Scene } from "@babylonjs/core";

export enum PostProcessType {
	BLUR = "blur",
	BLOOM = "bloom",
	GRAIN = "grain",
	SEPIA = "sepia",
}

export class PostProcess {
	private activeEffects: Map<PostProcessType, BabylonPostProcess> = new Map();

	public enableBlur(scene: Scene, amount = 1): void {
		if (this.activeEffects.has(PostProcessType.BLUR)) {
			return;
		}

		const pp = new BabylonPostProcess(
			"blur",
			"blur",
			["blurWidth"],
			["samplerPost"],
			amount / 8,
			null,
			2,
			scene.getEngine(),
		);
		pp.onApply = (effect) => {
			effect.setFloat("blurWidth", amount);
		};

		this.activeEffects.set(PostProcessType.BLUR, pp);
	}

	public disableBlur(): void {
		const pp = this.activeEffects.get(PostProcessType.BLUR);
		if (pp) {
			pp.dispose();
			this.activeEffects.delete(PostProcessType.BLUR);
		}
	}

	public dispose(): void {
		for (const [, pp] of this.activeEffects) {
			pp.dispose();
		}

		this.activeEffects.clear();
	}
} 