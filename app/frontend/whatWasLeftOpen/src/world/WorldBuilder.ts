import { Engine, Scene, Vector3, MeshBuilder, StandardMaterial, Color3 } from "@babylonjs/core";
import { Corridor } from "./maps/Corridor";
import { OldChamber } from "./maps/OldChamber";
import { Bathroom } from "./maps/Bathroom";
import { HiddenRoom } from "./maps/HiddenRoom";
import { NonEuclidianHiddenRoom } from "./maps/NonEuclidianHiddenRoom";
import { Kitchen } from "./maps/Kitchen";
import { LivingRoom } from "./maps/LivingRoom";
import { WC } from "./maps/WC";
import { NewCorridor } from "./maps/NewCorridor";
import { RoomPortalGraph, getRoomById, ROOM_PORTAL_GRAPH } from "./layout/RoomPortalGraph";
import { Door } from "../game/entities/Door";

// Configuration des positions relatives basée sur le plan d'architecte (plen.png)
const ROOM_POSITIONS: Record<string, Vector3> = {
	// Vieux bâtiment - aligné sur X
	"V_C": new Vector3(0, 0, 0),  // Couloir central (origine)
	"V_KT": new Vector3(8, 0, 0), // Cuisine à droite du couloir
	"V_BR": new Vector3(-8, 0, 0), // Chambre à gauche
	"V_LR": new Vector3(0, 0, 12), // Salon au bout du couloir
	"V_WC": new Vector3(0, 0, -5), // WC avant le couloir (à l'opposé de l'entrée)

	// Nouveau bâtiment - aligné différemment
	"N_C": new Vector3(20, 0, 0),  // Couloir neuf à droite
	"N_KT": new Vector3(28, 0, 0), // Cuisine neuve
	"N_BR": new Vector3(12, 0, 0), // Chambre neuve
	"N_LR": new Vector3(20, 0, 8), // Salon neuf
	"N_WC": new Vector3(20, 0, -5), // WC neuf

	// Hubs (salles non-euclidiennes)
	"H1": new Vector3(0, 0, 20),  // Hub 1 au nord
	"H2": new Vector3(10, 0, 25), // Hub 2 au nord-est

	// Links (salles de transition)
	"LK1": new Vector3(5, 0, 22), // Link 1
	"LK2": new Vector3(15, 0, 22), // Link 2
};

export class WorldBuilder {
	private engine: Engine;
	private canvas: HTMLCanvasElement;

	constructor(engine: Engine, canvas: HTMLCanvasElement) {
		this.engine = engine;
		this.canvas = canvas;
	}

	public buildWorld(startRoomId: string = "V_C"): Scene {
		const scene = new Scene(this.engine);
		scene.collisionsEnabled = true;
		scene.gravity = new Vector3(0, -9.81, 0);

		// Construire toutes les pièces du graphe (hors apartment test)
		this.buildAllGraphRooms(scene, startRoomId);

		// Créer les portes entre les salles adjacentes
		this.createDoorsForAdjacentRooms(scene);

		return scene;
	}

	private buildAllGraphRooms(scene: Scene, startRoomId: string): void {
		const visited = new Set<string>();

		if (getRoomById(startRoomId)) {
			this.buildSceneRecursive(scene, startRoomId, visited);
		}

		for (const room of ROOM_PORTAL_GRAPH.rooms) {
			this.buildSceneRecursive(scene, room.id, visited);
		}
	}

	private buildSceneRecursive(scene: Scene, roomId: string, visited: Set<string>): void {
		if (visited.has(roomId)) {
			return;
		}
		visited.add(roomId);

		const roomNode = getRoomById(roomId);
		if (!roomNode) {
			console.warn(`Room ${roomId} not found in graph`);
			return;
		}

		const position = ROOM_POSITIONS[roomId] || Vector3.Zero();

		// Construire la pièce selon son type
		switch (roomNode.type) {
			case "vieux":
				if (roomId === "V_C") {
					// Couloir vieux + chambre ancienne
					const corridor = new Corridor();
						const connection = corridor.build(scene);
					const oldChamber = new OldChamber();
					oldChamber.build(scene, connection);
				}
				// Cuisine, chambre, salon, WC
				else if (roomId === "V_KT") {
					const kitchen = new Kitchen();
					kitchen.build(scene, position, "red");
				} else if (roomId === "V_BR") {
					// Utiliser Bathroom temporairement comme chambre
					const bedroom = new Bathroom(this.engine, this.canvas);
					const bedroomScene = bedroom.createScene();
					bedroomScene.meshes.forEach(mesh => {
						mesh.position = mesh.position.add(position);
					});
				} else if (roomId === "V_LR") {
					const living = new LivingRoom();
					living.build(scene, position);
				} else if (roomId === "V_WC") {
					const wc = new WC();
					wc.build(scene, position);
				}
				break;

			case "neuf":
				if (roomId === "N_C") {
					const newCorridor = new NewCorridor();
					newCorridor.build(scene, position);
				} else if (roomId === "N_KT") {
					const kitchen = new Kitchen();
					kitchen.build(scene, position, "pink");
				} else if (roomId === "N_BR") {
					const bedroom = new Bathroom(this.engine, this.canvas);
					const bedroomScene = bedroom.createScene();
					bedroomScene.meshes.forEach(mesh => {
						mesh.position = mesh.position.add(position);
					});
				} else if (roomId === "N_LR") {
					const living = new LivingRoom();
					living.build(scene, position, undefined, true);
				} else if (roomId === "N_WC") {
					const wc = new WC();
					wc.build(scene, position);
				}
				break;

			case "hub":
				if (roomId === "H1" || roomId === "H2") {
					// Salle non-euclidienne - créer une scène séparée et ajouter ses mesh à la scène principale
					// Pour l'instant, on place un marqueur
					this.addDebugMarker(scene, position, `Hub ${roomId}`);
				}
				break;

			case "link":
				if (roomId === "LK1" || roomId === "LK2") {
					// Salle de transition HiddenRoom
					// On ne peut pas facilement merger les scènes, donc on place un marqueur
					this.addDebugMarker(scene, position, `Link ${roomId}`);
				}
				break;
		}

		// Construire les pièces connectées
		for (const portal of roomNode.portals) {
			const targetRoom = getRoomById(portal.target);
			if (targetRoom) {
				this.buildSceneRecursive(scene, targetRoom.id, visited);
			}
		}
	}

	private addDebugMarker(scene: Scene, position: Vector3, label: string): void {
		// Sphère jaune pour marquer la position
		const sphere = MeshBuilder.CreateSphere(`${label}_marker`, { diameter: 0.5 }, scene);
		sphere.position = position.add(new Vector3(0, 0.25, 0));
		const mat = new StandardMaterial(`${label}_mat`, scene);
		mat.diffuseColor = new Color3(1, 1, 0);
		sphere.material = mat;
	}

	private createDoorsForAdjacentRooms(scene: Scene): void {
		// Définir les portes entre les salles adjacentes basées sur la géométrie
		// Format: [roomA_id, roomB_id, doorPosition]
		const adjacentRooms: Array<[string, string, Vector3]> = [
			// Connexions vieux bâtiment
			["V_C", "V_KT", new Vector3(8, 1.5, 0)],        // Couloir <-> Cuisine (mur droit couloir / mur gauche cuisine)
			["V_C", "V_BR", new Vector3(-8, 1.5, 0)],       // Couloir <-> Chambre (mur gauche couloir / mur droit chambre)
			["V_C", "V_LR", new Vector3(0, 1.5, 6)],        // Couloir <-> Salon (avant du salon)
			["V_C", "V_WC", new Vector3(0, 1.5, -2.5)],     // Couloir <-> WC (avant du WC)

			// Connexions nouveau bâtiment
			["N_C", "N_KT", new Vector3(28, 1.5, 0)],       // Couloir neuf <-> Cuisine neuve
			["N_C", "N_BR", new Vector3(12, 1.5, 0)],       // Couloir neuf <-> Chambre neuve (vers l'ouest)
			["N_C", "N_LR", new Vector3(20, 1.5, 8)],       // Couloir neuf <-> Salon neuf
			["N_C", "N_WC", new Vector3(20, 1.5, -2.5)],    // Couloir neuf <-> WC neuf
		];

		// Créer les portes
		for (const [roomA, roomB, position] of adjacentRooms) {
			const door = new Door(roomA, roomB, position, true, false);
			(scene as any).doors = (scene as any).doors || [];
			(scene as any).doors.push(door);
			console.log(`[WorldBuilder] Porte créée entre ${roomA} et ${roomB} à ${position}`);
		}
	}
}
