export type NarrativeTrigger =
	| "zone-enter"
	| "interaction"
	| "puzzle-progress"
	| "puzzle-solved";

export interface NarrativeLine {
	id: string;
	trigger: NarrativeTrigger;
	text: string;
	audioKey?: string;
	once?: boolean;
}

export interface NarrativePlayback {
	text: string;
	audioKey?: string;
}

export class NarrativeSystem {
	private readonly lines: NarrativeLine[] = [];
	private readonly playedOnceLineIds: Set<string> = new Set();

	public addLine(line: NarrativeLine): void {
		this.lines.push(line);
	}

	public addLines(lines: NarrativeLine[]): void {
		for (const line of lines) {
			this.addLine(line);
		}
	}

	public consumeByTrigger(trigger: NarrativeTrigger): NarrativePlayback[] {
		const matches: NarrativePlayback[] = [];

		for (const line of this.lines) {
			if (line.trigger !== trigger) {
				continue;
			}

			if (line.once && this.playedOnceLineIds.has(line.id)) {
				continue;
			}

			if (line.once) {
				this.playedOnceLineIds.add(line.id);
			}

			matches.push({ text: line.text, audioKey: line.audioKey });
		}

		return matches;
	}

	public reset(): void {
		this.playedOnceLineIds.clear();
	}
}