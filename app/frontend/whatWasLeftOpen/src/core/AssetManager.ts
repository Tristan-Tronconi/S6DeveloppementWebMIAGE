type AssetRecord = Record<string, string>;

export interface AssetManifest {
	audio: {
		musics: AssetRecord;
		soundEffects: AssetRecord;
	};
	models: AssetRecord;
	textures: AssetRecord;
	images: AssetRecord;
}

const EMPTY_MANIFEST: AssetManifest = {
	audio: {
		musics: {},
		soundEffects: {},
	},
	models: {},
	textures: {},
	images: {},
};

function readAssetRecord(raw: unknown): AssetRecord {
	if (!raw || typeof raw !== "object") {
		return {};
	}

	const entries = Object.entries(raw as Record<string, unknown>)
		.filter(([, value]) => typeof value === "string")
		.map(([key, value]) => [key, value as string]);

	return Object.fromEntries(entries);
}

function parseManifest(raw: unknown): AssetManifest {
	const source = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
	const audio =
		source.audio && typeof source.audio === "object"
			? (source.audio as Record<string, unknown>)
			: {};

	return {
		audio: {
			musics: readAssetRecord(audio.musics),
			soundEffects: readAssetRecord(audio.soundEffects),
		},
		models: readAssetRecord(source.models),
		textures: readAssetRecord(source.textures),
		images: readAssetRecord(source.images),
	};
}

function withTrailingSlash(basePath: string): string {
	if (!basePath) {
		return "/";
	}

	return basePath.endsWith("/") ? basePath : `${basePath}/`;
}

export class AssetManager {
	private manifest: AssetManifest = EMPTY_MANIFEST;
	private readonly basePath: string;

	public constructor(basePath: string = import.meta.env.BASE_URL) {
		this.basePath = withTrailingSlash(basePath);
	}

	public async loadManifest(manifestPath = "assets/assetManifest.json"): Promise<void> {
		const response = await fetch(this.resolvePath(manifestPath), {
			cache: "no-cache",
		});

		if (!response.ok) {
			console.warn(`[AssetManager] Manifest not found: ${manifestPath}`);
			this.manifest = EMPTY_MANIFEST;
			return;
		}

		const json = (await response.json()) as unknown;
		this.manifest = parseManifest(json);
	}

	public getMusicUrl(key: string): string | null {
		return this.resolveFromRecord(this.manifest.audio.musics, key);
	}

	public getSoundEffectUrl(key: string): string | null {
		return this.resolveFromRecord(this.manifest.audio.soundEffects, key);
	}

	public getModelUrl(key: string): string | null {
		return this.resolveFromRecord(this.manifest.models, key);
	}

	public getTextureUrl(key: string): string | null {
		return this.resolveFromRecord(this.manifest.textures, key);
	}

	public getImageUrl(key: string): string | null {
		return this.resolveFromRecord(this.manifest.images, key);
	}

	public listMusics(): string[] {
		return Object.keys(this.manifest.audio.musics);
	}

	public listSoundEffects(): string[] {
		return Object.keys(this.manifest.audio.soundEffects);
	}

	private resolveFromRecord(record: AssetRecord, key: string): string | null {
		const relativePath = record[key];
		if (!relativePath) {
			return null;
		}

		return this.resolvePath(relativePath);
	}

	private resolvePath(path: string): string {
		if (/^(https?:)?\/\//.test(path)) {
			return path;
		}

		const normalized = path.startsWith("/") ? path.slice(1) : path;
		return `${this.basePath}${normalized}`;
	}
}
// est compatible avec barre d e progression
