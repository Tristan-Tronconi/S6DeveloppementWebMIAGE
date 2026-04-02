import { Scene } from "@babylonjs/core";

import { AssetManager } from "./core/AssetManager";
import { AudioManager } from "./core/AudioManager";
import { EngineService } from "./core/Engine";
import { InputManager } from "./core/InputManager";
import { SceneManager } from "./core/SceneManager";
import { Player } from "./game/entities/Player";
import { WorldFacade } from "./game/facades/WorldFacade";
import { MainMenu } from "./ui/MainMenu";
import { HUD } from "./ui/HUD";

console.log("Initializing game...");

function createFullscreenCanvas(): HTMLCanvasElement {
	const canvas = document.createElement("canvas");
	canvas.id = "renderCanvas";
	canvas.style.width = "100vw";
	canvas.style.height = "100vh";
	canvas.style.display = "block";

	document.body.style.margin = "0";
	document.body.style.overflow = "hidden";
	document.body.appendChild(canvas);

	return canvas;
}

const canvas = createFullscreenCanvas();
const engineService = new EngineService(canvas, true);
const sceneManager = new SceneManager();
const worldFacade = new WorldFacade(engineService.engine, canvas);
const hud = new HUD(document.body);
const inputManager = new InputManager(hud);
const player = new Player();

const assetManager = new AssetManager();
const audioManager = new AudioManager();

async function bootstrapCoreServices(): Promise<void> {
	await assetManager.loadManifest();
	audioManager.registerFromManifest(assetManager);
}

void bootstrapCoreServices();

const mainMenu = new MainMenu(document.body, async () => {
	await bootstrapCoreServices();

	const activeScene = worldFacade.getWorldScene(player);
	inputManager.attachPlayerControls(activeScene, player);
	sceneManager.setScene(activeScene);
	mainMenu.hide();
	
	hud.showControls();
	hud.showFocusInteraction();

	const firstMusic = assetManager.listMusics()[0];
	if (firstMusic) {
		audioManager.playMusic(firstMusic, { loop: true, restart: true, volume: 0.6 });
	}

	engineService.startRenderLoop(() => {
		sceneManager.render();
	});

	window.addEventListener("beforeunload", () => {
		audioManager.dispose();
		sceneManager.dispose();
		engineService.dispose();
	});

	if (!sceneManager.scene) {
		return;
	}

	const debugScene = sceneManager.scene;
	debugScene.onDisposeObservable.add(() => {
		audioManager.stopAll();
	});
});

mainMenu.show();

window.addEventListener("resize", () => {
	engineService.resize();
});

window.addEventListener('keydown', (event) => {
	setTimeout(() => {
	import("@babylonjs/inspector");
	import("@babylonjs/core/Debug/debugLayer")
	if(event.key === "i" || event.key === "I") {
		const activeScene = sceneManager.scene;

		if (activeScene?.debugLayer.isVisible()) {
			activeScene?.debugLayer.hide();
		} else {
			activeScene?.debugLayer.show();
		}
	}
},2000);
});