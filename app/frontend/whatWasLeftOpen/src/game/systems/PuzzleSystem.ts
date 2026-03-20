import { Puzzle } from "../entities/Puzzle";

export class PuzzleSystem {
	private readonly puzzles = new Map<string, Puzzle>();
	private paused = false;

	public register(puzzle: Puzzle): void {
		this.puzzles.set(puzzle.id, puzzle);
	}

	public unregister(puzzleId: string): void {
		this.puzzles.delete(puzzleId);
	}

	public setPaused(paused: boolean): void {
		this.paused = paused;
	}

	public isPaused(): boolean {
		return this.paused;
	}

	public tryInteract(
		puzzleId: string,
		inventory: Iterable<string>,
	): { success: boolean; state?: string } {
		if (this.paused) {
			return { success: false };
		}

		const puzzle = this.puzzles.get(puzzleId);
		if (!puzzle || !puzzle.canInteract(inventory)) {
			return { success: false };
		}

		const state = puzzle.advanceState();
		return { success: true, state };
	}
}