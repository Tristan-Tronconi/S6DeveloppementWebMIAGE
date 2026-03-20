export interface SaveState {
	playerPosition: {
		x: number;
		y: number;
		z: number;
	};
	puzzleStates: Record<string, number>;
	gameTimeSeconds: number;
	inventory: string[];
	unlockedNarrativeIds: string[];
}

const DEFAULT_STATE: SaveState = {
	playerPosition: { x: 0, y: 0, z: 0 },
	puzzleStates: {},
	gameTimeSeconds: 0,
	inventory: [],
	unlockedNarrativeIds: [],
};

export class SaveSystem {
	private readonly storagePrefix: string;

	public constructor(storagePrefix = "wwlo") {
		this.storagePrefix = storagePrefix;
	}

	public save(slot: number, state: SaveState): void {
		if (slot < 1 || slot > 3) {
			throw new Error("Save slot must be between 1 and 3.");
		}

		const key = this.toKey(slot);
		localStorage.setItem(key, JSON.stringify(state));
	}

	public load(slot: number): SaveState | null {
		const key = this.toKey(slot);
		const raw = localStorage.getItem(key);
		if (!raw) {
			return null;
		}

		try {
			const parsed = JSON.parse(raw) as Partial<SaveState>;
			return {
				playerPosition: parsed.playerPosition ?? DEFAULT_STATE.playerPosition,
				puzzleStates: parsed.puzzleStates ?? {},
				gameTimeSeconds: parsed.gameTimeSeconds ?? 0,
				inventory: parsed.inventory ?? [],
				unlockedNarrativeIds: parsed.unlockedNarrativeIds ?? [],
			};
		} catch {
			return null;
		}
	}

	public clear(slot: number): void {
		localStorage.removeItem(this.toKey(slot));
	}

	private toKey(slot: number): string {
		return `${this.storagePrefix}:save:${slot}`;
	}
}