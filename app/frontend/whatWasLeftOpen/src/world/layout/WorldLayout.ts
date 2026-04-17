import { Vector3 } from "@babylonjs/core";

/**
 * Système de placement cohérent pour le monde
 * Calcule les positions des pièces à partir des connexions réelles
 */

export interface DoorConfig {
	position: number; // Z locale dans le corridor
	width: number;
	height: number;
}

export interface RoomPosition {
	worldPos: Vector3;
	doorConfig: DoorConfig;
}

export class WorldLayout {
	// Corridor dimensions
	readonly corridorLength = 120;
	readonly corridorWidth = 12;
	readonly corridorWallThickness = 0.6;
	readonly corridorHeight = 4;

	// Corridor origin
	readonly corridorPos = new Vector3(0, 0, 0);

	// Room dimensions
	readonly livingRoomWidth = 12;
	readonly livingRoomLength = 18;

	readonly kitchenWidth = 14;
	readonly kitchenLength = 12;

	readonly wcWidth = 8;
	readonly wcLength = 6;

	readonly hiddenRoomSize = 16;
	readonly nonEuclidianRoomDiameter = 12;

	constructor() {}

	/**
	 * Calcule la position d'une pièce adjacente au corridor
	 * @param doorZ - Position de la porte en Z (coordonnée locale du corridor)
	 * @param roomWidth - Largeur de la pièce à placer
	 * @param roomLength - Profondeur de la pièce
	 * @param side - "left" = X négatif, "right" = X positif
	 */
	public calculateAdjacentRoomPosition(
		doorZ: number,
		roomWidth: number,
		roomLength: number,
		side: "left" | "right",
	): Vector3 {
		// Vérifier que la porte est dans les limites du corridor
		const maxZ = this.corridorLength / 2;
		const minZ = -(this.corridorLength / 2);
		const validZ = Math.max(minZ, Math.min(maxZ, doorZ));

		if (validZ !== doorZ) {
			console.warn(
				`⚠️ Door Z=${doorZ} hors limites [${minZ}, ${maxZ}]. Clampée à ${validZ}`,
			);
		}

		// Position du corridor (centre + murs)
		const corridorRadius = this.corridorWidth / 2;
		const wallThickness = this.corridorWallThickness;
		const roomRadius = roomWidth / 2;

		let x: number;

		if (side === "left") {
			// Pièce à gauche : X = corridor.x - corridor.radius - wall - room.radius
			x = this.corridorPos.x - corridorRadius - wallThickness - roomRadius;
		} else {
			// Pièce à droite : X = corridor.x + corridor.radius + wall + room.radius
			x = this.corridorPos.x + corridorRadius + wallThickness + roomRadius;
		}

		// Le Z de la pièce = Z de la porte (alignement)
		const z = this.corridorPos.z + validZ;

		return new Vector3(x, 0, z);
	}

	/**
	 * Retourne les configs de toutes les portes du corridor
	 * Organisées de manière logique et symmétrique
	 */
	public getCorridorDoors(): Map<
		"livingRoom" | "kitchen" | "wc",
		{ z: number; side: "left" | "right"; width: number; height: number }
	> {
		return new Map([
			["livingRoom", { z: -30, side: "left", width: 3, height: 3 }],
			["wc", { z: 0, side: "right", width: 2.5, height: 2.5 }],
			["kitchen", { z: 30, side: "right", width: 3, height: 3 }],
		]);
	}

	/**
	 * Calcule toutes les positions du cluster "vieux"
	 */
	public getOldClusterPositions() {
		const doorConfigs = this.getCorridorDoors();

		const livingDoor = doorConfigs.get("livingRoom")!;
		const kitchenDoor = doorConfigs.get("kitchen")!;
		const wcDoor = doorConfigs.get("wc")!;

		return {
			livingRoom: this.calculateAdjacentRoomPosition(
				livingDoor.z,
				this.livingRoomWidth,
				this.livingRoomLength,
				livingDoor.side,
			),
			kitchen: this.calculateAdjacentRoomPosition(
				kitchenDoor.z,
				this.kitchenWidth,
				this.kitchenLength,
				kitchenDoor.side,
			),
			wc: this.calculateAdjacentRoomPosition(
				wcDoor.z,
				this.wcWidth,
				this.wcLength,
				wcDoor.side,
			),
			doorConfigs: {
				livingRoom: livingDoor,
				kitchen: kitchenDoor,
				wc: wcDoor,
			},
		};
	}
}
