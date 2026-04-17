import {
	AbstractMesh,
	Color3,
	DirectionalLight,
	Engine,
	FreeCamera,
	HemisphericLight,
	MeshBuilder,
	RenderTargetTexture,
	Scene,
	StandardMaterial,
	Texture,
	Vector3,
} from "@babylonjs/core";
import { Player } from "../entities/Player";
import { Corridor } from "../../world/maps/Corridor";
import { OldChamber } from "../../world/maps/OldChamber";
import { Kitchen } from "../../world/maps/Kitchen";
import { LivingRoom } from "../../world/maps/LivingRoom";
import { WC } from "../../world/maps/WC";
import { NewCorridor } from "../../world/maps/NewCorridor";
import { WorldLayout } from "../../world/layout/WorldLayout";

type PortalEndpoint = {
	position: Vector3;
	normal: Vector3;
	width?: number;
	height?: number;
};

type PortalTint = {
	diffuse: Color3;
	emissive: Color3;
};

type LinkedPortal = {
	entryMesh: AbstractMesh;
	entryNormal: Vector3;
	exitPosition: Vector3;
	exitNormal: Vector3;
	lastTeleportAt: number;
	renderTarget: RenderTargetTexture;
};

export class WorldFacade {
	private worldScene: Scene | null = null;
	private linkedPortals: LinkedPortal[] = [];
	private readonly portalTints: PortalTint[] = [
		{ diffuse: new Color3(0.95, 0.2, 0.2), emissive: new Color3(0.9, 0.15, 0.15) },
		{ diffuse: new Color3(0.2, 0.8, 0.35), emissive: new Color3(0.15, 0.65, 0.25) },
		{ diffuse: new Color3(0.25, 0.55, 0.95), emissive: new Color3(0.2, 0.45, 0.85) },
		{ diffuse: new Color3(0.95, 0.8, 0.25), emissive: new Color3(0.85, 0.7, 0.15) },
		{ diffuse: new Color3(0.7, 0.3, 0.95), emissive: new Color3(0.6, 0.25, 0.85) },
		{ diffuse: new Color3(0.95, 0.45, 0.2), emissive: new Color3(0.85, 0.35, 0.15) },
	];

	public constructor(
		private readonly engine: Engine,
		private readonly canvas: HTMLCanvasElement,
	) {}

	public getWorldScene(player: Player): Scene {
		if (this.worldScene && this.worldScene.isDisposed) {
			this.worldScene = null;
		}

		if (!this.worldScene) {
			this.worldScene = new Scene(this.engine);
			this.worldScene.collisionsEnabled = true;
			this.worldScene.gravity = new Vector3(0, -9.81, 0);

			const corridor = new Corridor();
			player.createAndAttachCamera(this.worldScene, this.canvas, corridor.spawnPoint);

			const hemiLight = new HemisphericLight("ambient", new Vector3(0, 1, 0), this.worldScene);
			hemiLight.intensity = 0.65;

			const dirLight = new DirectionalLight("sun", new Vector3(0, -1, 1), this.worldScene);
			dirLight.position = new Vector3(0, 20, -25);
			dirLight.intensity = 0.4;

			// ✅ Utiliser les VRAIES positions des portes calculées par WorldLayout
			const layout = new WorldLayout();
			const doorConfigs = layout.getCorridorDoors();

			const corridorConnection = corridor.build(this.worldScene, {
				left: [doorConfigs.get("livingRoom")!.z],
				right: [doorConfigs.get("wc")!.z, doorConfigs.get("kitchen")!.z],
				doorWidth: 3,
				doorHeight: 3,
			});
			console.log("🚪 Corridor doors configured at:", {
				left: [doorConfigs.get("livingRoom")!.z],
				right: [doorConfigs.get("wc")!.z, doorConfigs.get("kitchen")!.z],
			});

			new OldChamber().build(this.worldScene, corridorConnection);

			this.buildOldCluster(this.worldScene);
			this.buildNewCluster(this.worldScene);
			this.buildSeparatedRooms(this.worldScene);

			const playerCamera = player.getCamera();
			if (playerCamera) {
				this.createPortalNetwork(this.worldScene, playerCamera);
				this.enablePortalTeleport(playerCamera);
			}

			this.worldScene.onPointerDown = () => {
				if (document.pointerLockElement !== this.canvas) {
					this.canvas.requestPointerLock();
				}
			};
		}

		return this.worldScene;
	}

	private buildOldCluster(scene: Scene): void {
		const layout = new WorldLayout();
		const positions = layout.getOldClusterPositions();

		// ✅ Positions calculées cohéremment à partir des portes
		new LivingRoom().build(scene, positions.livingRoom, undefined, false);
		new Kitchen().build(scene, positions.kitchen, "yellow");
		new WC().build(scene, positions.wc, "green");

		// 🔍 DEBUG: Afficher les positions calculées
		console.log("📍 Old Cluster Positions:", {
			livingRoom: positions.livingRoom,
			kitchen: positions.kitchen,
			wc: positions.wc,
			doorConfigs: positions.doorConfigs,
		});

		// Optionnel: Marqueurs visuels des portes pour déboguer
		this.createDoorMarker(
			scene,
			"door_old_corridor_living",
			positions.livingRoom.clone(),
			new Vector3(0.35, 2.4, 3.2),
		);
		this.createDoorMarker(
			scene,
			"door_old_corridor_kitchen",
			positions.kitchen.clone(),
			new Vector3(0.35, 2.4, 3.0),
		);
		this.createDoorMarker(
			scene,
			"door_old_corridor_wc",
			positions.wc.clone(),
			new Vector3(0.35, 2.4, 2.0),
		);
	}

	private buildNewCluster(scene: Scene): void {
		const layout = new WorldLayout();
		const positions = layout.getOldClusterPositions();
		const newOffset = new Vector3(85, 0, 0);

		// ✅ Positions du NewCluster = positions du OldCluster + offset cohérent
		const newLivingPos = positions.livingRoom.add(newOffset);
		const newKitchenPos = positions.kitchen.add(newOffset);
		const newWcPos = positions.wc.add(newOffset);

		new NewCorridor().build(scene, newOffset.add(new Vector3(0, 0, 0)));
		new LivingRoom().build(scene, newLivingPos, undefined, true);
		new Kitchen().build(scene, newKitchenPos, "blue");
		new WC().build(scene, newWcPos, "purple");

		console.log("📍 New Cluster Positions (offset +85 on X):", {
			livingRoom: newLivingPos,
			kitchen: newKitchenPos,
			wc: newWcPos,
		});

		// Marqueurs visuels
		this.createDoorMarker(scene, "door_new_corridor_living", newLivingPos.clone(), new Vector3(0.35, 2.4, 3.2));
		this.createDoorMarker(scene, "door_new_corridor_kitchen", newKitchenPos.clone(), new Vector3(0.35, 2.4, 3.0));
		this.createDoorMarker(scene, "door_new_corridor_wc", newWcPos.clone(), new Vector3(0.35, 2.4, 2.0));
	}

	private buildSeparatedRooms(scene: Scene): void {
		this.buildHiddenRoom(scene, "H1", new Vector3(-55, 0, 20));
		this.buildHiddenRoom(scene, "H2", new Vector3(135, 0, 20));
		this.buildNonEuclidianRoom(scene, "NE1", new Vector3(-20, 0, 55));
		this.buildNonEuclidianRoom(scene, "NE2", new Vector3(100, 0, 55));
	}

	private buildHiddenRoom(scene: Scene, label: string, center: Vector3): void {
		const size = 16;
		const wallH = 4;
		const half = size / 2;

		const floor = MeshBuilder.CreateGround(`${label}_floor`, { width: size, height: size }, scene);
		floor.position = center.clone();
		floor.checkCollisions = true;

		const mat = new StandardMaterial(`${label}_mat`, scene);
		mat.diffuseColor = new Color3(0.2, 0.22, 0.26);

		const walls = [
			{ name: "N", w: size, d: 0.4, x: center.x, z: center.z + half },
			{ name: "S", w: size, d: 0.4, x: center.x, z: center.z - half },
			{ name: "E", w: 0.4, d: size, x: center.x + half, z: center.z },
			{ name: "W", w: 0.4, d: size, x: center.x - half, z: center.z },
		];

		for (const wall of walls) {
			const mesh = MeshBuilder.CreateBox(`${label}_wall_${wall.name}`, { width: wall.w, height: wallH, depth: wall.d }, scene);
			mesh.position = new Vector3(wall.x, wallH / 2, wall.z);
			mesh.material = mat;
			mesh.checkCollisions = true;
		}
	}

	private buildNonEuclidianRoom(scene: Scene, label: string, center: Vector3): void {
		const radius = 8;
		const curvedWall = MeshBuilder.CreateCylinder(
			`${label}_curvedWall`,
			{ diameter: radius * 2, height: 4, tessellation: 32, arc: 0.5 },
			scene,
		);
		curvedWall.position = center.add(new Vector3(0, 2, 0));
		curvedWall.rotation.z = Math.PI / 2;
		curvedWall.checkCollisions = true;

		const curvedMat = new StandardMaterial(`${label}_curvedMat`, scene);
		curvedMat.diffuseColor = new Color3(0.16, 0.16, 0.2);
		curvedMat.specularColor = new Color3(0, 0, 0);
		curvedWall.material = curvedMat;

		const floor = MeshBuilder.CreateGround(`${label}_floor`, { width: radius * 2, height: radius }, scene);
		floor.position = center.add(new Vector3(0, 0, 0));
		floor.checkCollisions = true;
		floor.material = new StandardMaterial(`${label}_floorMat`, scene);
		(floor.material as StandardMaterial).diffuseColor = new Color3(0.12, 0.12, 0.14);

		const ceiling = MeshBuilder.CreateGround(`${label}_ceiling`, { width: radius * 2, height: radius }, scene);
		ceiling.position = center.add(new Vector3(0, 4, 0));
		ceiling.rotation.z = Math.PI;
		ceiling.checkCollisions = true;
		ceiling.material = new StandardMaterial(`${label}_ceilingMat`, scene);
		(ceiling.material as StandardMaterial).diffuseColor = new Color3(0.12, 0.12, 0.14);

		const wall = MeshBuilder.CreateBox(`${label}_flat_wall`, { width: radius * 2, height: 4, depth: 0.4 }, scene);
		wall.position = center.add(new Vector3(0, 2, radius));
		wall.checkCollisions = true;
		wall.material = curvedMat;
	}

	private createDoorMarker(scene: Scene, name: string, position: Vector3, size: Vector3): void {
		const door = MeshBuilder.CreateBox(name, { width: size.x, height: size.y, depth: size.z }, scene);
		door.position = position;
		door.checkCollisions = false;

		const mat = new StandardMaterial(`${name}_mat`, scene);
		mat.diffuseColor = new Color3(0.25, 0.2, 0.15);
		mat.emissiveColor = new Color3(0.05, 0.03, 0.02);
		door.material = mat;
	}

	private createPortalNetwork(scene: Scene, playerCamera: FreeCamera): void {
		this.linkedPortals = [];

		this.createLinkedPortalPair(scene, "p1_oldBR_H1", playerCamera,
			{ position: new Vector3(11.5, 1.6, 40), normal: new Vector3(0, 0, 1) },
			{ position: new Vector3(-55, 1.6, 12), normal: new Vector3(0, 0, -1) },
		);

		this.createLinkedPortalPair(scene, "p2_H1_NE1", playerCamera,
			{ position: new Vector3(-59, 1.6, 12), normal: new Vector3(0, 0, -1) },
			{ position: new Vector3(-24, 1.6, 59), normal: new Vector3(0, 0, 1) },
		);

		this.createLinkedPortalPair(scene, "p3_H1_NE2", playerCamera,
			{ position: new Vector3(-51, 1.6, 12), normal: new Vector3(0, 0, -1) },
			{ position: new Vector3(104, 1.6, 59), normal: new Vector3(0, 0, 1) },
		);

		this.createLinkedPortalPair(scene, "p4_NE1_H2", playerCamera,
			{ position: new Vector3(-16, 1.6, 59), normal: new Vector3(0, 0, 1) },
			{ position: new Vector3(139, 1.6, 12), normal: new Vector3(0, 0, -1) },
		);

		this.createLinkedPortalPair(scene, "p5_NE2_H2", playerCamera,
			{ position: new Vector3(96, 1.6, 59), normal: new Vector3(0, 0, 1) },
			{ position: new Vector3(131, 1.6, 12), normal: new Vector3(0, 0, -1) },
		);

		this.createLinkedPortalPair(scene, "p6_newBR_H2", playerCamera,
			{ position: new Vector3(96.5, 1.6, 40), normal: new Vector3(0, 0, 1) },
			{ position: new Vector3(135, 1.6, 28), normal: new Vector3(0, 0, 1) },
		);

		this.refreshPortalRenderLists(scene);
	}

	private createLinkedPortalPair(
		scene: Scene,
		baseName: string,
		playerCamera: FreeCamera,
		a: PortalEndpoint,
		b: PortalEndpoint,
	): void {
		const tintIndex = this.linkedPortals.length / 2;
		const tint = this.portalTints[tintIndex % this.portalTints.length];
		const portalA = this.createPortalSurface(scene, `${baseName}_A`, a, b, tint);
		const portalB = this.createPortalSurface(scene, `${baseName}_B`, b, a, tint);

		this.linkedPortals.push({
			entryMesh: portalA,
			entryNormal: a.normal.normalize(),
			exitPosition: b.position.clone(),
			exitNormal: b.normal.normalize(),
			lastTeleportAt: 0,
			renderTarget: portalA.metadata.renderTarget as RenderTargetTexture,
		});

		this.linkedPortals.push({
			entryMesh: portalB,
			entryNormal: b.normal.normalize(),
			exitPosition: a.position.clone(),
			exitNormal: a.normal.normalize(),
			lastTeleportAt: 0,
			renderTarget: portalB.metadata.renderTarget as RenderTargetTexture,
		});
	}

	private createPortalSurface(
		scene: Scene,
		name: string,
		entry: PortalEndpoint,
		destination: PortalEndpoint,
		tint: PortalTint,
	): AbstractMesh {
		const width = entry.width ?? 1.8;
		const height = entry.height ?? 2.6;

		const portalPlane = MeshBuilder.CreatePlane(name, { width, height }, scene);
		portalPlane.position = entry.position.clone();
		portalPlane.rotation.y = Math.atan2(entry.normal.x, entry.normal.z);
		portalPlane.isPickable = false;
		portalPlane.metadata = { ...(portalPlane.metadata || {}), isPortal: true };

		const rt = new RenderTargetTexture(`${name}_rt`, { width: 512, height: 512 }, scene, false);
		const portalCam = new FreeCamera(`${name}_cam`, destination.position.add(destination.normal.scale(0.45)), scene);
		portalCam.minZ = 0.1;
		portalCam.fov = Math.PI / 2.4;
		portalCam.setTarget(destination.position.add(destination.normal));
		rt.activeCamera = portalCam;

		scene.customRenderTargets.push(rt);

		const mat = new StandardMaterial(`${name}_mat`, scene);
		mat.diffuseTexture = rt;
		mat.emissiveTexture = rt;
		mat.diffuseColor = tint.diffuse;
		mat.emissiveColor = tint.emissive;
		mat.specularColor = new Color3(0, 0, 0);
		mat.alpha = 0.95;
		mat.backFaceCulling = false;
		mat.diffuseTexture.wrapU = Texture.CLAMP_ADDRESSMODE;
		mat.diffuseTexture.wrapV = Texture.CLAMP_ADDRESSMODE;
		portalPlane.material = mat;
		portalPlane.metadata.renderTarget = rt;

		return portalPlane;
	}

	private refreshPortalRenderLists(scene: Scene): void {
		const visibleMeshes = scene.meshes.filter((mesh) => mesh.metadata?.isPortal !== true);
		for (const portal of this.linkedPortals) {
			portal.renderTarget.renderList = visibleMeshes.filter((mesh) => mesh !== portal.entryMesh);
		}
	}

	private enablePortalTeleport(playerCamera: FreeCamera): void {
		const cooldownMs = 600;

		playerCamera.getScene().onBeforeRenderObservable.add(() => {
			const now = Date.now();
			for (const portal of this.linkedPortals) {
				if (now - portal.lastTeleportAt < cooldownMs) {
					continue;
				}

				const toPortal = playerCamera.position.subtract(portal.entryMesh.position);
				const inFront = Vector3.Dot(toPortal, portal.entryNormal) < 0.7;
				if (toPortal.length() < 1.15 && inFront) {
					playerCamera.position = portal.exitPosition.add(portal.exitNormal.scale(1.3));
					portal.lastTeleportAt = now;

					for (const other of this.linkedPortals) {
						if (other !== portal) {
							other.lastTeleportAt = now;
						}
					}
					break;
				}
			}
		});
	}
}
