import { Scene } from "@babylonjs/core";

export class SceneManager {
	private activeScene: Scene | null = null;

	public get scene(): Scene | null {
		return this.activeScene;
	}

	public setScene(scene: Scene): void {
		if (this.activeScene && this.activeScene !== scene) {
			this.activeScene.dispose();
		}

		this.activeScene = scene;
	}

	public render(): void {
		this.activeScene?.render();
	}

	public dispose(): void {
		this.activeScene?.dispose();
		this.activeScene = null;
	}
}
