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
import { PauseMenu } from "./ui/PauseMenu";
import { SaveSystem } from "./game/systems/SaveSystem";
import { SaveState } from "./game/systems/SaveSystem";
import { Inspector } from "@babylonjs/inspector";

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
const saveSystem = new SaveSystem();
let currentSlot: number | null = null;
let gameStarted = false;
let pauseMenu: PauseMenu | null = null;

async function bootstrapCoreServices(): Promise<void> {
	await assetManager.loadManifest();
	audioManager.registerFromManifest(assetManager);
}

void bootstrapCoreServices();

// Fonction pour obtenir l'état de sauvegarde actuel
function getCurrentSaveState(): SaveState {
	const pos = player.position;
	return {
		playerPosition: { x: pos.x, y: pos.y, z: pos.z },
		puzzleStates: {}, // TODO: remplir depuis les systèmes de puzzles
		gameTimeSeconds: 0, // TODO: tracker le temps de jeu
		inventory: Array.from(player.inventory),
		unlockedNarrativeIds: [], // TODO: depuis NarrativeSystem
	};
}

const mainMenu = new MainMenu(document.body, async (slot: number) => {
	await bootstrapCoreServices();

	currentSlot = slot;
	gameStarted = true;
	console.log(`Démarrage avec le slot ${slot}`);

	const activeScene = worldFacade.getWorldScene(player);

	// Créer le menu pause
	pauseMenu = new PauseMenu(
		document.body,
		// onResume
		() => {
			if (pauseMenu) {
				pauseMenu.hide();
				inputManager.setPaused(false);
			}
		},
		// onSettings
		() => {
			alert("Options non disponible depuis le pause (à implémenter)");
		},
		// onMainMenu (quitter)
		async () => {
			if (currentSlot !== null) {
				const saveState = getCurrentSaveState();
				saveSystem.save(currentSlot, saveState);
				console.log(`Partie sauvegardée dans le slot ${currentSlot}`);
			}

			// Arrêter le rendu et nettoyer
			engineService.stopRenderLoop();
			audioManager.stopAll();
			sceneManager.dispose();

			// Cacher le HUD
			hud.hideControls();
			hud.hideFocusInteraction();

			// Réinitialiser l'état
			currentSlot = null;
			gameStarted = false;
			if (pauseMenu) {
				pauseMenu.hide();
				pauseMenu = null;
			}

			// Retourner au menu principal
			mainMenu.show();
		}
	);
	pauseMenu.hide();

	// Configurer le callback de pause sur l'InputManager
	inputManager.setTogglePauseMenuCallback(() => {
		if (!pauseMenu) return;
		if (pauseMenu.isVisible()) {
			pauseMenu.hide();
			inputManager.setPaused(false);
		} else {
			pauseMenu.show();
			inputManager.setPaused(true);
		}
	});

	// Attacher les contrôles du joueur
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
}, audioManager);

mainMenu.show();

window.addEventListener("resize", () => {
	engineService.resize();
});

