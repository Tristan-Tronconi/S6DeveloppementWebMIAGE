import { Engine, KeyboardEventTypes, Scene, UniversalCamera, Vector3 } from "@babylonjs/core";
import { WorldFacade } from "./game/facades/WorldFacade";
import { MainMenu } from "./ui/MainMenu";

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
const engine = new Engine(canvas, true);
const worldFacade = new WorldFacade(engine, canvas);

let activeScene: Scene | null = null;

function attachPlayerControls(scene: Scene): void {
	const playerCamera = scene.getCameraByName("playerCamera");
	if (!(playerCamera instanceof UniversalCamera)) {
		return;
	}

	playerCamera.keysUp = [];
	playerCamera.keysDown = [];
	playerCamera.keysLeft = [];
	playerCamera.keysRight = [];

	const jumpImpulse = 0.34;
	const moveState = {
		forward: false,
		backward: false,
		left: false,
		right: false,
	};

	let canJump = false;
	let jumpKeyDown = false;

	scene.onBeforeRenderObservable.add(() => {
		const grounded = playerCamera.position.y <= playerCamera.ellipsoid.y + 0.15;
		canJump = grounded && playerCamera.cameraDirection.y <= 0;

		const movement = Vector3.Zero();
		const forward = playerCamera.getDirection(Vector3.Forward());
		const right = playerCamera.getDirection(Vector3.Right());
		forward.y = 0;
		right.y = 0;

		if (forward.lengthSquared() > 0) {
			forward.normalize();
		}
		if (right.lengthSquared() > 0) {
			right.normalize();
		}

		if (moveState.forward) {
			movement.addInPlace(forward);
		}
		if (moveState.backward) {
			movement.subtractInPlace(forward);
		}
		if (moveState.right) {
			movement.addInPlace(right);
		}
		if (moveState.left) {
			movement.subtractInPlace(right);
		}

		if (movement.lengthSquared() > 0) {
			movement.normalize();
			const speed = playerCamera.speed * (scene.getEngine().getDeltaTime() / 16.6667);
			movement.scaleInPlace(speed);
			playerCamera.cameraDirection.addInPlace(movement);
		}
	});

	scene.onKeyboardObservable.add((keyboardInfo) => {
		if (
			keyboardInfo.type !== KeyboardEventTypes.KEYDOWN &&
			keyboardInfo.type !== KeyboardEventTypes.KEYUP
		) {
			return;
		}

		const isDown = keyboardInfo.type === KeyboardEventTypes.KEYDOWN;
		const { code } = keyboardInfo.event;

		switch (code) {
			case "ArrowUp":
			case "KeyW":
			case "KeyZ":
				moveState.forward = isDown;
				break;
			case "ArrowDown":
			case "KeyS":
				moveState.backward = isDown;
				break;
			case "ArrowLeft":
			case "KeyA":
			case "KeyQ":
				moveState.left = isDown;
				break;
			case "ArrowRight":
			case "KeyD":
				moveState.right = isDown;
				break;
			default:
				break;
		}

		if (code === "Space") {
			keyboardInfo.event.preventDefault();
			if (isDown && !jumpKeyDown && canJump) {
				playerCamera.cameraDirection.y = jumpImpulse;
				jumpKeyDown = true;
			} else if (!isDown) {
				jumpKeyDown = false;
			}
		}
	});
}

const mainMenu = new MainMenu(document.body, () => {
	if (activeScene) {
		activeScene.dispose();
	}

	activeScene = worldFacade.createCorridorScene();
	attachPlayerControls(activeScene);
	mainMenu.hide();

	engine.runRenderLoop(() => {
		activeScene?.render();
	});
});

mainMenu.show();

window.addEventListener("resize", () => {
	engine.resize();
});

window.addEventListener('keydown', (event) => {
	import("@babylonjs/inspector");
	if(event.key === "i" && event.altKey && event.shiftKey) {
		if (!activeScene) {
			return;
		}

		if (activeScene.debugLayer.isVisible()) {
			activeScene.debugLayer.hide();
		} else {
			activeScene.debugLayer.show();
		}
	}
	
});
