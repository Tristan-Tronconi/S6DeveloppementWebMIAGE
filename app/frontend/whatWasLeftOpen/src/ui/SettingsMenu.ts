export interface SettingsState {
	mouseSensitivity: number;
	musicVolume: number;
	sfxVolume: number;
	subtitlesEnabled: boolean;
	language: string;
	hintsEnabled: boolean;
}

export class SettingsMenu {
	private readonly overlay: HTMLDivElement;
	private settings: SettingsState = {
		mouseSensitivity: 1,
		musicVolume: 1,
		sfxVolume: 1,
		subtitlesEnabled: true,
		language: "fr",
		hintsEnabled: true,
	};

	public constructor(
		container: HTMLElement,
		onClose: () => void,
		onQuit: () => void,
	) {
		this.overlay = document.createElement("div");
		this.overlay.style.position = "fixed";
		this.overlay.style.inset = "0";
		this.overlay.style.display = "none";
		this.overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
		this.overlay.style.zIndex = "350";
		this.overlay.style.overflow = "auto";

		const panel = document.createElement("div");
		panel.style.maxWidth = "500px";
		panel.style.margin = "50px auto";
		panel.style.padding = "30px";
		panel.style.backgroundColor = "rgba(30, 30, 30, 0.9)";
		panel.style.border = "2px solid white";
		panel.style.borderRadius = "8px";
		panel.style.color = "white";

		const title = document.createElement("h2");
		title.textContent = "Paramètres";
		panel.appendChild(title);

		const createSlider = (label: string, min: number, max: number, value: number) => {
			const div = document.createElement("div");
			div.style.marginBottom = "15px";

			const lbl = document.createElement("label");
			lbl.textContent = label;
			lbl.style.display = "block";
			lbl.style.marginBottom = "5px";

			const slider = document.createElement("input");
			slider.type = "range";
			slider.min = String(min);
			slider.max = String(max);
			slider.value = String(value);
			slider.style.width = "100%";

			div.appendChild(lbl);
			div.appendChild(slider);
			return { element: div, slider };
		};

		const sensitivityCtrl = createSlider("Sensibilité souris", 0.1, 3, 1);
		panel.appendChild(sensitivityCtrl.element);
		sensitivityCtrl.slider.addEventListener("change", (e) => {
			this.settings.mouseSensitivity = Number((e.target as HTMLInputElement).value);
		});

		const musicCtrl = createSlider("Volume musique", 0, 1, 1);
		panel.appendChild(musicCtrl.element);
		musicCtrl.slider.addEventListener("change", (e) => {
			this.settings.musicVolume = Number((e.target as HTMLInputElement).value);
		});

		const sfxCtrl = createSlider("Volume effets sonores", 0, 1, 1);
		panel.appendChild(sfxCtrl.element);
		sfxCtrl.slider.addEventListener("change", (e) => {
			this.settings.sfxVolume = Number((e.target as HTMLInputElement).value);
		});

		const checkboxContainer = document.createElement("div");
		checkboxContainer.style.marginBottom = "15px";

		const subtitlesChk = document.createElement("input");
		subtitlesChk.type = "checkbox";
		subtitlesChk.checked = true;
		subtitlesChk.addEventListener("change", (e) => {
			this.settings.subtitlesEnabled = (e.target as HTMLInputElement).checked;
		});

		const subtitlesLbl = document.createElement("label");
		subtitlesLbl.appendChild(subtitlesChk);
		subtitlesLbl.append(" Sous-titres activés");
		checkboxContainer.appendChild(subtitlesLbl);
		panel.appendChild(checkboxContainer);

		const buttonsContainer = document.createElement("div");
		buttonsContainer.style.display = "flex";
		buttonsContainer.style.gap = "10px";
		buttonsContainer.style.justifyContent = "flex-end";
		buttonsContainer.style.marginTop = "20px";

		const closeBtn = document.createElement("button");
		closeBtn.textContent = "Retour";
		closeBtn.style.padding = "8px 16px";
		closeBtn.style.cursor = "pointer";
		closeBtn.addEventListener("click", onClose);

		const quitBtn = document.createElement("button");
		quitBtn.textContent = "Quitter le jeu";
		quitBtn.style.padding = "8px 16px";
		quitBtn.style.cursor = "pointer";
		quitBtn.addEventListener("click", () => {
			if (confirm("Êtes-vous sûr de vouloir quitter ?")) {
				onQuit();
			}
		});

		buttonsContainer.appendChild(closeBtn);
		buttonsContainer.appendChild(quitBtn);
		panel.appendChild(buttonsContainer);

		this.overlay.appendChild(panel);
		container.appendChild(this.overlay);
	}

	public show(): void {
		this.overlay.style.display = "block";
	}

	public hide(): void {
		this.overlay.style.display = "none";
	}

	public getSettings(): SettingsState {
		return { ...this.settings };
	}
}