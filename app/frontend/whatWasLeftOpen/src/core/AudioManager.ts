import { Howl, Howler } from "howler";
import { AssetManager } from "./AssetManager";

type AudioMap = Map<string, Howl>;

interface MusicPlayOptions {
	loop?: boolean;
	volume?: number;
	restart?: boolean;
}

interface SoundEffectPlayOptions {
	volume?: number;
}

export class AudioManager {
	private readonly musics: AudioMap = new Map();
	private readonly soundEffects: AudioMap = new Map();
	private currentMusicKey: string | null = null;

	public registerMusic(key: string, src: string, defaultVolume = 1): void {
		const howl = new Howl({
			src: [src],
			loop: true,
			volume: defaultVolume,
			html5: false,
		});

		this.musics.set(key, howl);
	}

	public registerSoundEffect(key: string, src: string, defaultVolume = 1): void {
		const howl = new Howl({
			src: [src],
			loop: false,
			volume: defaultVolume,
			html5: false,
		});

		this.soundEffects.set(key, howl);
	}

	public registerFromManifest(assets: AssetManager): void {
		for (const key of assets.listMusics()) {
			const musicUrl = assets.getMusicUrl(key);
			if (musicUrl) {
				this.registerMusic(key, musicUrl);
			}
		}

		for (const key of assets.listSoundEffects()) {
			const soundUrl = assets.getSoundEffectUrl(key);
			if (soundUrl) {
				this.registerSoundEffect(key, soundUrl);
			}
		}
	}

	public playMusic(key: string, options: MusicPlayOptions = {}): void {
		const music = this.musics.get(key);
		if (!music) {
			console.warn(`[AudioManager] Music not found: ${key}`);
			return;
		}

		const shouldRestart = options.restart ?? true;
		const shouldLoop = options.loop ?? true;

		if (this.currentMusicKey && this.currentMusicKey !== key) {
			this.stopMusic(this.currentMusicKey);
		}

		music.loop(shouldLoop);
		if (typeof options.volume === "number") {
			music.volume(options.volume);
		}

		if (shouldRestart) {
			music.stop();
		}

		music.play();
		this.currentMusicKey = key;
	}

	public stopMusic(key?: string): void {
		const selectedKey = key ?? this.currentMusicKey;
		if (!selectedKey) {
			return;
		}

		const music = this.musics.get(selectedKey);
		music?.stop();

		if (this.currentMusicKey === selectedKey) {
			this.currentMusicKey = null;
		}
	}

	public playSoundEffect(key: string, options: SoundEffectPlayOptions = {}): void {
		const soundEffect = this.soundEffects.get(key);
		if (!soundEffect) {
			console.warn(`[AudioManager] Sound effect not found: ${key}`);
			return;
		}

		if (typeof options.volume === "number") {
			soundEffect.volume(options.volume);
		}

		soundEffect.play();
	}

	public setMasterVolume(volume: number): void {
		Howler.volume(volume);
	}

	public setMusicVolume(volume: number): void {
		for (const [, music] of this.musics) {
			music.volume(volume);
		}
	}

	public setSfxVolume(volume: number): void {
		for (const [, sfx] of this.soundEffects) {
			sfx.volume(volume);
		}
	}

	public setVoiceVolume(volume: number): void {
		// Si on a des voix séparées, on les gère ici
		// Pour l'instant, on applique aussi aux soundEffects si on les utilise pour les voix
		for (const [, sound] of this.soundEffects) {
			sound.volume(volume);
		}
	}

	public stopAll(): void {
		Howler.stop();
		this.currentMusicKey = null;
	}

	public dispose(): void {
		for (const [, music] of this.musics) {
			music.unload();
		}

		for (const [, sound] of this.soundEffects) {
			sound.unload();
		}

		this.musics.clear();
		this.soundEffects.clear();
		this.currentMusicKey = null;
	}
}
