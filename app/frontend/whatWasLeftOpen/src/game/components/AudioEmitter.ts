import { AudioManager } from "../../core/AudioManager";

export type AudioEmitterKind = "music" | "soundEffect";

export class AudioEmitter {
	public readonly key: string;
	public readonly kind: AudioEmitterKind;
	private readonly audioManager: AudioManager;

	public constructor(audioManager: AudioManager, key: string, kind: AudioEmitterKind = "soundEffect") {
		this.audioManager = audioManager;
		this.key = key;
		this.kind = kind;
	}

	public play(volume?: number): void {
		if (this.kind === "music") {
			this.audioManager.playMusic(this.key, { volume, loop: true });
			return;
		}

		this.audioManager.playSoundEffect(this.key, { volume });
	}

	public stop(): void {
		if (this.kind === "music") {
			this.audioManager.stopMusic(this.key);
		}
	}
}