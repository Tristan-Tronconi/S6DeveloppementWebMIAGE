import {
	Color3,
	Engine,
	HemisphericLight,
	MeshBuilder,
	Scene,
	StandardMaterial,
	Vector3,
} from "@babylonjs/core";

export class NonEuclidianHiddenRoom {
	public constructor(private readonly engine: Engine, private readonly canvas: HTMLCanvasElement) {}

	public createScene(): Scene {
		const scene = new Scene(this.engine);
		scene.collisionsEnabled = true;

		new HemisphericLight("nonEuclidianLight", new Vector3(0, 1, 0), scene).intensity = 0.5;

		const dome = MeshBuilder.CreateSphere(
			"nonEuclidianDome",
			{ diameter: 14, slice: 0.5, sideOrientation: 1 },
			scene,
		);
		dome.position = new Vector3(0, 7, 0);
		dome.checkCollisions = true;

		const domeMat = new StandardMaterial("nonEuclidianDomeMat", scene);
		domeMat.diffuseColor = new Color3(0.14, 0.14, 0.17);
		domeMat.specularColor = new Color3(0, 0, 0);
		dome.material = domeMat;

		const floor = MeshBuilder.CreateGround("nonEuclidianFloor", { width: 14, height: 7 }, scene);
		floor.position = new Vector3(0, 0, -3.5);
		floor.checkCollisions = true;

		const portalMat = new StandardMaterial("nonEuclidianPortalMat", scene);
		portalMat.diffuseColor = new Color3(0.68, 0.56, 0.2);
		portalMat.emissiveColor = new Color3(0.3, 0.22, 0.07);

		const leftPortal = MeshBuilder.CreatePlane("nonEuclidianPortalLeft", { width: 1.8, height: 2.8 }, scene);
		leftPortal.position = new Vector3(-2.6, 1.6, 0);
		leftPortal.rotation.y = Math.PI;
		leftPortal.material = portalMat;

		const rightPortal = MeshBuilder.CreatePlane("nonEuclidianPortalRight", { width: 1.8, height: 2.8 }, scene);
		rightPortal.position = new Vector3(2.6, 1.6, 0);
		rightPortal.rotation.y = Math.PI;
		rightPortal.material = portalMat;

		scene.onPointerDown = () => {
			if (document.pointerLockElement !== this.canvas) {
				this.canvas.requestPointerLock();
			}
		};

		return scene;
	}
}