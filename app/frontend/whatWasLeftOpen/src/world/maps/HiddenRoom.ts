import {
	Color3,
	Engine,
	HemisphericLight,
	MeshBuilder,
	Scene,
	StandardMaterial,
	Vector3,
} from "@babylonjs/core";

export class HiddenRoom {
	public constructor(private readonly engine: Engine, private readonly canvas: HTMLCanvasElement) {}

	public createScene(): Scene {
		const scene = new Scene(this.engine);
		scene.collisionsEnabled = true;

		new HemisphericLight("hiddenRoomLight", new Vector3(0, 1, 0), scene).intensity = 0.45;

		const floor = MeshBuilder.CreateGround("hiddenRoomFloor", { width: 12, height: 12 }, scene);
		floor.checkCollisions = true;

		const floorMat = new StandardMaterial("hiddenRoomFloorMat", scene);
		floorMat.diffuseColor = new Color3(0.2, 0.2, 0.21);
		floorMat.specularColor = new Color3(0, 0, 0);
		floor.material = floorMat;

		const portalMat = new StandardMaterial("hiddenRoomPortalMat", scene);
		portalMat.diffuseColor = new Color3(0.2, 0.55, 0.72);
		portalMat.emissiveColor = new Color3(0.08, 0.3, 0.42);

		const portalA = MeshBuilder.CreatePlane("hiddenRoomPortalA", { width: 1.8, height: 2.6 }, scene);
		portalA.position = new Vector3(-5.8, 1.4, 0);
		portalA.rotation.y = Math.PI / 2;
		portalA.material = portalMat;

		const portalB = MeshBuilder.CreatePlane("hiddenRoomPortalB", { width: 1.8, height: 2.6 }, scene);
		portalB.position = new Vector3(5.8, 1.4, 0);
		portalB.rotation.y = -Math.PI / 2;
		portalB.material = portalMat;

		const decayedPortal = MeshBuilder.CreatePlane("hiddenRoomDecayedPortal", { width: 1.8, height: 2.6 }, scene);
		decayedPortal.position = new Vector3(0, 1.4, 5.8);
		decayedPortal.rotation.y = Math.PI;
		decayedPortal.material = portalMat;

		scene.onPointerDown = () => {
			if (document.pointerLockElement !== this.canvas) {
				this.canvas.requestPointerLock();
			}
		};

		return scene;
	}
}