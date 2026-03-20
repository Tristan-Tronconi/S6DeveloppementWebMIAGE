import { Engine } from "@babylonjs/core";

export class EngineService {
	private readonly runtime: Engine;
	private isRenderLoopRunning = false;

	public constructor(canvas: HTMLCanvasElement, antialias = true) {
		this.runtime = new Engine(canvas, antialias);
	}

	public get engine(): Engine {
		return this.runtime;
	}

	public startRenderLoop(render: () => void): void {
		if (this.isRenderLoopRunning) {
			return;
		}

		this.runtime.runRenderLoop(render);
		this.isRenderLoopRunning = true;
	}

	public stopRenderLoop(): void {
		this.runtime.stopRenderLoop();
		this.isRenderLoopRunning = false;
	}

	public resize(): void {
		this.runtime.resize();
	}

	public dispose(): void {
		this.stopRenderLoop();
		this.runtime.dispose();
	}
}
