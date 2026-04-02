export type RoomType = "vieux" | "neuf" | "hub" | "link";

export type PortalColor =
	| "red"
	| "pink"
	| "green"
	| "yellow"
	| "purple"
	| "blue";

export interface PortalLink {
	color: PortalColor;
	target: string;
}

export interface RoomNode {
	id: string;
	type: RoomType;
	name?: string;
	portals: PortalLink[];
}

export interface RoomPortalGraph {
	rooms: RoomNode[];
}

export const ROOM_PORTAL_GRAPH: RoomPortalGraph = {
	rooms: [
		{
			id: "V_BR",
			type: "vieux",
			name: "Bedroom",
			portals: [{ color: "red", target: "V_KT" }],
		},
		{
			id: "V_KT",
			type: "vieux",
			name: "Kitchen",
			portals: [{ color: "red", target: "V_BR" }],
		},
		{
			id: "V_LR",
			type: "vieux",
			name: "LivingRoom",
			portals: [],
		},
		{
			id: "V_C",
			type: "vieux",
			name: "Corridor",
			portals: [],
		},
		{
			id: "V_WC",
			type: "vieux",
			name: "WC",
			portals: [],
		},
		{
			id: "N_BR",
			type: "neuf",
			name: "Bedroom",
			portals: [{ color: "pink", target: "N_KT" }],
		},
		{
			id: "N_KT",
			type: "neuf",
			name: "Kitchen",
			portals: [{ color: "pink", target: "N_BR" }],
		},
		{
			id: "N_LR",
			type: "neuf",
			name: "LivingRoom",
			portals: [],
		},
		{
			id: "N_C",
			type: "neuf",
			name: "Corridor",
			portals: [],
		},
		{
			id: "N_WC",
			type: "neuf",
			name: "WC",
			portals: [],
		},
		{
			id: "H1",
			type: "hub",
			portals: [
				{ color: "green", target: "LK2" },
				{ color: "yellow", target: "LK1" },
				{ color: "red", target: "V_KT" },
			],
		},
		{
			id: "H2",
			type: "hub",
			portals: [
				{ color: "purple", target: "LK1" },
				{ color: "blue", target: "LK2" },
				{ color: "pink", target: "N_KT" },
			],
		},
		{
			id: "LK1",
			type: "link",
			portals: [
				{ color: "purple", target: "H2" },
				{ color: "yellow", target: "H1" },
			],
		},
		{
			id: "LK2",
			type: "link",
			portals: [
				{ color: "green", target: "H1" },
				{ color: "blue", target: "H2" },
			],
		},
	],
};

const ROOM_BY_ID = new Map(ROOM_PORTAL_GRAPH.rooms.map((room) => [room.id, room]));

export function getRoomById(roomId: string): RoomNode | undefined {
	return ROOM_BY_ID.get(roomId);
}

export function getPortalTarget(roomId: string, color: PortalColor): RoomNode | undefined {
	const room = ROOM_BY_ID.get(roomId);
	if (!room) {
		return undefined;
	}

	const link = room.portals.find((portal) => portal.color === color);
	if (!link) {
		return undefined;
	}

	return ROOM_BY_ID.get(link.target);
}

export function validateRoomPortalGraph(): string[] {
	const errors: string[] = [];

	for (const room of ROOM_PORTAL_GRAPH.rooms) {
		for (const portal of room.portals) {
			if (!ROOM_BY_ID.has(portal.target)) {
				errors.push(`Room ${room.id} has portal ${portal.color} to missing target ${portal.target}.`);
			}
		}
	}

	return errors;
}
