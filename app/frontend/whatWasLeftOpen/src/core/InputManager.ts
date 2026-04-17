import { KeyboardEventTypes, Scene, UniversalCamera, Vector3 } from "@babylonjs/core";
import { Player } from "../game/entities/Player";
import { Inspector } from "@babylonjs/inspector";
import { HUD } from "../ui/HUD";

type InputManagerOptions = {
	onTogglePauseMenu?: () => void;
	onToggleFlashlight?: () => void;
};

export class InputManager {
	private readonly hud: HUD;
	private readonly options: InputManagerOptions;
	private isPaused = false;
	private scene: Scene | null = null;
	private debugMode = false;

	public constructor(hud: HUD, options: InputManagerOptions = {}) {
		this.hud = hud;
		this.options = options;
	}

	public setPaused(paused: boolean): void {
		this.isPaused = paused;
	}

	public setTogglePauseMenuCallback(callback: () => void): void {
		this.options.onTogglePauseMenu = callback;
	}

	public setScene(scene: Scene): void {
		this.scene = scene;
	}

	public attachPlayerControls(scene: Scene, player: Player): void {
		this.scene = scene;
		const playerCamera = player.getCamera();
		if (!(playerCamera instanceof UniversalCamera)) {
			return;
		}

		playerCamera.keysUp = [];
		playerCamera.keysDown = [];
		playerCamera.keysLeft = [];
		playerCamera.keysRight = [];

		let jumpImpulse = 0.34;
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
			} if (right.lengthSquared() > 0) {
				right.normalize();
			}

			if (moveState.forward) {
				movement.addInPlace(forward);
			} if (moveState.backward) {
				movement.subtractInPlace(forward);
			} if (moveState.right) {
				movement.addInPlace(right);
			} if (moveState.left) {
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

			// Si en pause, ignorer tous les événements sauf Echap (pour quitter la pause)
			if (this.isPaused && keyboardInfo.event.code !== "Escape") {
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
				case "Tab":
					keyboardInfo.event.preventDefault();
					if (isDown) {
						this.hud.toggleInventory();
					}
					break;
				case "KeyE":
					if (isDown) {
						this.hud.showFocusInteraction();
					} else {
						this.hud.hideFocusInteraction();
					}
					break;
				case "Escape":
				case "Enter":
				case "NumpadEnter":
					if (isDown) {
						this.options.onTogglePauseMenu?.();
					}
					break;
				case "KeyF":
					if (isDown) {
						this.options.onToggleFlashlight?.();
					}
					break;
				case "KeyI":
					if (isDown && keyboardInfo.event.shiftKey) {
						this.toggleDebugMode();
					}
					break;
				case "Space":
					keyboardInfo.event.preventDefault();
					if (isDown && !jumpKeyDown && canJump) {
						if (jumpImpulse <= 0) {
							jumpImpulse = 0.34;
						}
						playerCamera.cameraDirection.y = jumpImpulse;
						jumpKeyDown = true;
					} else if (!isDown) {
						jumpKeyDown = false;
					}
					break;
				default:
					break;
			}
		});
	}

	private toggleDebugMode(): void {
		if (!this.scene) {
			console.warn("[InputManager] Scene not available for debug mode");
			return;
		}

		this.debugMode = !this.debugMode;

		if (this.debugMode) {
			console.log("[InputManager] Debug mode enabled");
			if (Inspector.IsVisible) {
				Inspector.Hide();
			} else {
				Inspector.Show(this.scene, {});
			}
		} else {
			console.log("[InputManager] Debug mode disabled");
			if (Inspector.IsVisible) {
				Inspector.Hide();
			}
		}
	}
}
