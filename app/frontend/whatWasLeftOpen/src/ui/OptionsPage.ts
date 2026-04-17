import { AudioManager } from "../core/AudioManager";

export interface OptionsState {
	masterVolume: number;
	musicVolume: number;
	voiceVolume: number;
	sfxVolume: number;
	mouseSensitivity: number;
	gamma: number;
	fov: number;
	textureQuality: "low" | "medium" | "high";
}

export class OptionsPage {
	private overlay: HTMLDivElement;
	private options: OptionsState;
	private audioManager: AudioManager;
	private onClose: () => void;

	private masterVolumeSlider!: { container: HTMLDivElement; slider: HTMLInputElement };
	private musicVolumeSlider!: { container: HTMLDivElement; slider: HTMLInputElement };
	private voiceVolumeSlider!: { container: HTMLDivElement; slider: HTMLInputElement };
	private sfxVolumeSlider!: { container: HTMLDivElement; slider: HTMLInputElement };
	private sensitivitySlider!: { container: HTMLDivElement; slider: HTMLInputElement };
	private gammaSlider!: { container: HTMLDivElement; slider: HTMLInputElement };
	private fovSlider!: { container: HTMLDivElement; slider: HTMLInputElement };
	private textureQualitySelect!: HTMLSelectElement;

	public constructor(
		container: HTMLElement,
		audioManager: AudioManager,
		onClose: () => void
	) {
		console.log("[OptionsPage] Constructor");
		this.audioManager = audioManager;
		this.onClose = onClose;
		this.options = this.loadOptions();

		this.overlay = document.createElement("div");
		this.overlay.style.position = "fixed";
		this.overlay.style.inset = "0";
		this.overlay.style.display = "none";
		this.overlay.style.flexDirection = "column";
		this.overlay.style.alignItems = "center";
		this.overlay.style.justifyContent = "center";
		this.overlay.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
		this.overlay.style.zIndex = "350";
		this.overlay.style.overflow = "auto";
		this.overlay.style.padding = "20px";

		this.buildUI();
		container.appendChild(this.overlay);
	}

	private buildUI(): void {
		const panel = document.createElement("div");
		panel.style.maxWidth = "700px";
		panel.style.width = "90%";
		panel.style.padding = "40px";
		panel.style.backgroundColor = "rgba(30, 30, 30, 0.95)";
		panel.style.border = "2px solid white";
		panel.style.borderRadius = "12px";
		panel.style.color = "white";

		const title = document.createElement("h2");
		title.textContent = "Options";
		title.style.textAlign = "center";
		title.style.marginBottom = "30px";
		title.style.fontSize = "2.5rem";
		panel.appendChild(title);

		// Deux colonnes
		const columnsContainer = document.createElement("div");
		columnsContainer.style.display = "flex";
		columnsContainer.style.gap = "40px";
		columnsContainer.style.flexWrap = "wrap";

		// Colonne gauche: Audio et Sensibilité
		const leftColumn = document.createElement("div");
		leftColumn.style.flex = "1";
		leftColumn.style.minWidth = "300px";

		// Section Audio
		const audioSection = this.createSection("Audio");
		audioSection.style.marginBottom = "30px";

		this.masterVolumeSlider = this.createSlider("Volume Global", 0, 1, this.options.masterVolume);
		this.musicVolumeSlider = this.createSlider("Volume Musique", 0, 1, this.options.musicVolume);
		this.voiceVolumeSlider = this.createSlider("Volume Voix", 0, 1, this.options.voiceVolume);
		this.sfxVolumeSlider = this.createSlider("Volume Bruitages", 0, 1, this.options.sfxVolume);

		audioSection.appendChild(this.masterVolumeSlider.container);
		audioSection.appendChild(this.musicVolumeSlider.container);
		audioSection.appendChild(this.voiceVolumeSlider.container);
		audioSection.appendChild(this.sfxVolumeSlider.container);

		leftColumn.appendChild(audioSection);

		// Section Contrôles
		const controlsSection = this.createSection("Contrôles");
		this.sensitivitySlider = this.createSlider("Sensibilité Souris", 0.1, 5, this.options.mouseSensitivity);
		controlsSection.appendChild(this.sensitivitySlider.container);

		leftColumn.appendChild(controlsSection);

		// Colonne droite: Affichage et Graphismes
		const rightColumn = document.createElement("div");
		rightColumn.style.flex = "1";
		rightColumn.style.minWidth = "300px";

		// Section Affichage
		const displaySection = this.createSection("Affichage");
		this.gammaSlider = this.createSlider("Luminosité / Gamma", 0.5, 1.5, this.options.gamma);
		this.fovSlider = this.createSlider("FOV", 60, 110, this.options.fov);
		displaySection.appendChild(this.gammaSlider.container);
		displaySection.appendChild(this.fovSlider.container);

		rightColumn.appendChild(displaySection);

		// Section Graphismes
		const graphicsSection = this.createSection("Graphismes");
		this.textureQualitySelect = this.createSelect("Qualité des Textures", [
			{ value: "low", label: "Basse" },
			{ value: "medium", label: "Moyenne" },
			{ value: "high", label: "Élevée" },
		], this.options.textureQuality);
		graphicsSection.appendChild(this.textureQualitySelect);

		rightColumn.appendChild(graphicsSection);

		columnsContainer.appendChild(leftColumn);
		columnsContainer.appendChild(rightColumn);
		panel.appendChild(columnsContainer);

		// Boutons
		const buttonsContainer = document.createElement("div");
		buttonsContainer.style.display = "flex";
		buttonsContainer.style.gap = "15px";
		buttonsContainer.style.justifyContent = "flex-end";
		buttonsContainer.style.marginTop = "30px";

		const applyBtn = document.createElement("button");
		applyBtn.textContent = "Appliquer";
		applyBtn.style.padding = "12px 30px";
		applyBtn.style.fontSize = "16px";
		applyBtn.style.cursor = "pointer";
		applyBtn.style.border = "2px solid #4CAF50";
		applyBtn.style.backgroundColor = "#4CAF50";
		applyBtn.style.color = "white";
		applyBtn.style.borderRadius = "6px";
		applyBtn.addEventListener("click", () => this.applyOptions());

		const defaultBtn = document.createElement("button");
		defaultBtn.textContent = "Réinitialiser";
		defaultBtn.style.padding = "12px 30px";
		defaultBtn.style.fontSize = "16px";
		defaultBtn.style.cursor = "pointer";
		defaultBtn.style.border = "2px solid #ff9800";
		defaultBtn.style.backgroundColor = "transparent";
		defaultBtn.style.color = "white";
		defaultBtn.style.borderRadius = "6px";
		defaultBtn.addEventListener("click", () => this.resetToDefaults());

		const closeBtn = document.createElement("button");
		closeBtn.textContent = "Retour";
		closeBtn.style.padding = "12px 30px";
		closeBtn.style.fontSize = "16px";
		closeBtn.style.cursor = "pointer";
		closeBtn.style.border = "2px solid white";
		closeBtn.style.backgroundColor = "transparent";
		closeBtn.style.color = "white";
		closeBtn.style.borderRadius = "6px";
		closeBtn.addEventListener("click", () => {
			this.saveOptions();
			this.onClose();
		});

		buttonsContainer.appendChild(applyBtn);
		buttonsContainer.appendChild(defaultBtn);
		buttonsContainer.appendChild(closeBtn);
		panel.appendChild(buttonsContainer);

		this.overlay.appendChild(panel);
	}

	private createSection(title: string): HTMLDivElement {
		const section = document.createElement("div");
		section.style.marginBottom = "20px";

		const sectionTitle = document.createElement("h3");
		sectionTitle.textContent = title;
		sectionTitle.style.marginBottom = "15px";
		sectionTitle.style.fontSize = "1.3rem";
		sectionTitle.style.color = "#4CAF50";
		section.appendChild(sectionTitle);

		return section;
	}

	private createSlider(
		label: string,
		min: number,
		max: number,
		value: number
	): { container: HTMLDivElement; slider: HTMLInputElement } {
		const container = document.createElement("div");
		container.style.marginBottom = "15px";

		const labelDiv = document.createElement("div");
		labelDiv.style.display = "flex";
		labelDiv.style.justifyContent = "space-between";
		labelDiv.style.marginBottom = "5px";

		const lbl = document.createElement("label");
		lbl.textContent = label;
		lbl.style.fontSize = "14px";

		const valueSpan = document.createElement("span");
		valueSpan.style.fontSize = "14px";
		valueSpan.style.color = "#4CAF50";
		valueSpan.textContent = this.formatSliderValue(value, min, max);

		labelDiv.appendChild(lbl);
		labelDiv.appendChild(valueSpan);

		const slider = document.createElement("input");
		slider.type = "range";
		slider.min = String(min);
		slider.max = String(max);
		slider.step = min < 1 ? "0.1" : "1";
		slider.value = String(value);
		slider.style.width = "100%";
		slider.style.accentColor = "#4CAF50";

		slider.addEventListener("input", () => {
			valueSpan.textContent = this.formatSliderValue(Number(slider.value), min, max);
		});

		container.appendChild(labelDiv);
		container.appendChild(slider);

		return { container, slider };
	}

	private createSelect<T extends string>(
		label: string,
		options: { value: T; label: string }[],
		selectedValue: T
	): HTMLSelectElement {
		const container = document.createElement("div");
		container.style.marginBottom = "15px";

		const lbl = document.createElement("label");
		lbl.textContent = label;
		lbl.style.display = "block";
		lbl.style.marginBottom = "8px";
		lbl.style.fontSize = "14px";
		container.appendChild(lbl);

		const select = document.createElement("select");
		select.style.padding = "8px";
		select.style.fontSize = "14px";
		select.style.borderRadius = "4px";
		select.style.border = "1px solid white";
		select.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
		select.style.color = "white";
		select.style.width = "100%";

		options.forEach(opt => {
			const option = document.createElement("option");
			option.value = opt.value;
			option.textContent = opt.label;
			if (opt.value === selectedValue) {
				option.selected = true;
			}
			select.appendChild(option);
		});

		container.appendChild(select);
		return select;
	}

	private formatSliderValue(value: number, min: number, max: number): string {
		if (min < 1 && max <= 1) {
			return `${Math.round(value * 100)}%`;
		}
		return `${value}${max > 100 ? "°" : ""}`;
	}

	private loadOptions(): OptionsState {
		const saved = localStorage.getItem("options");
		if (saved) {
			try {
				return JSON.parse(saved);
			} catch (e) {
				console.error("Erreur lecture options:", e);
			}
		}
		return {
			masterVolume: 1,
			musicVolume: 1,
			voiceVolume: 1,
			sfxVolume: 1,
			mouseSensitivity: 2,
			gamma: 1,
			fov: 90,
			textureQuality: "medium",
		};
	}

	private saveOptions(): void {
		const options = this.collectOptions();
		localStorage.setItem("options", JSON.stringify(options));
	}

	private collectOptions(): OptionsState {
		return {
			masterVolume: Number(this.masterVolumeSlider.slider.value),
			musicVolume: Number(this.musicVolumeSlider.slider.value),
			voiceVolume: Number(this.voiceVolumeSlider.slider.value),
			sfxVolume: Number(this.sfxVolumeSlider.slider.value),
			mouseSensitivity: Number(this.sensitivitySlider.slider.value),
			gamma: Number(this.gammaSlider.slider.value),
			fov: Number(this.fovSlider.slider.value),
			textureQuality: this.textureQualitySelect.value as "low" | "medium" | "high",
		};
	}

	private applyOptions(): void {
		const options = this.collectOptions();

		// Appliquer volumes audio
		this.audioManager.setMasterVolume(options.masterVolume);
		this.audioManager.setMusicVolume(options.musicVolume);
		this.audioManager.setSfxVolume(options.sfxVolume);
		// Note: voiceVolume pourrait être utilisé pour les dialogues

		// Sauvegarder
		this.saveOptions();

		// TODO: Appliquer gamma, FOV, texture quality au moteur Babylon
		// Ces paramètres nécessitent d'être propagés au moteur de jeu
		console.log("Options appliquées:", options);

		alert("Options appliquées !");
	}

	private resetToDefaults(): void {
		const defaults: OptionsState = {
			masterVolume: 1,
			musicVolume: 1,
			voiceVolume: 1,
			sfxVolume: 1,
			mouseSensitivity: 2,
			gamma: 1,
			fov: 90,
			textureQuality: "medium",
		};

		this.masterVolumeSlider.slider.value = String(defaults.masterVolume);
		this.musicVolumeSlider.slider.value = String(defaults.musicVolume);
		this.voiceVolumeSlider.slider.value = String(defaults.voiceVolume);
		this.sfxVolumeSlider.slider.value = String(defaults.sfxVolume);
		this.sensitivitySlider.slider.value = String(defaults.mouseSensitivity);
		this.gammaSlider.slider.value = String(defaults.gamma);
		this.fovSlider.slider.value = String(defaults.fov);
		this.textureQualitySelect.value = defaults.textureQuality;
		//reset affichage des valeurs
		this.masterVolumeSlider.container.querySelector("span")!.textContent = this.formatSliderValue(defaults.masterVolume, 0, 1);
		this.musicVolumeSlider.container.querySelector("span")!.textContent = this.formatSliderValue(defaults.musicVolume, 0, 1);
		this.voiceVolumeSlider.container.querySelector("span")!.textContent = this.formatSliderValue(defaults.voiceVolume, 0, 1);
		this.sfxVolumeSlider.container.querySelector("span")!.textContent = this.formatSliderValue(defaults.sfxVolume, 0, 1);
		this.sensitivitySlider.container.querySelector("span")!.textContent = this.formatSliderValue(defaults.mouseSensitivity, 0.1, 3);
		this.gammaSlider.container.querySelector("span")!.textContent = this.formatSliderValue(defaults.gamma, 0.5, 1.5);
		this.fovSlider.container.querySelector("span")!.textContent = this.formatSliderValue(defaults.fov, 60, 110);
	}

	public show(): void {
		this.overlay.style.display = "flex";
		this.options = this.loadOptions();
		this.masterVolumeSlider.slider.value = String(this.options.masterVolume);
		this.musicVolumeSlider.slider.value = String(this.options.musicVolume);
		this.voiceVolumeSlider.slider.value = String(this.options.voiceVolume);
		this.sfxVolumeSlider.slider.value = String(this.options.sfxVolume);
		this.sensitivitySlider.slider.value = String(this.options.mouseSensitivity);
		this.gammaSlider.slider.value = String(this.options.gamma);
		this.fovSlider.slider.value = String(this.options.fov);
		this.textureQualitySelect.value = this.options.textureQuality;
	}

	public hide(): void {
		this.overlay.style.display = "none";
	}
}
