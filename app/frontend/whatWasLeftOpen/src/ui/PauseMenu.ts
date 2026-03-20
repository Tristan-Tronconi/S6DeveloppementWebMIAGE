export class PauseMenu {
	private readonly overlay: HTMLDivElement;
	private readonly resumeButton: HTMLButtonElement;
	private readonly settingsButton: HTMLButtonElement;
	private readonly mainMenuButton: HTMLButtonElement;

	public constructor(
		container: HTMLElement,
		onResume: () => void,
		onSettings: () => void,
		onMainMenu: () => void,
	) {
		this.overlay = document.createElement("div");
		this.overlay.style.position = "fixed";
		this.overlay.style.inset = "0";
		this.overlay.style.display = "none";
		this.overlay.style.alignItems = "center";
		this.overlay.style.justifyContent = "center";
		this.overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
		this.overlay.style.zIndex = "300";

		const panel = document.createElement("div");
		panel.style.textAlign = "center";
		panel.style.color = "white";

		const title = document.createElement("h1");
		title.textContent = "What Was Left Open";
		title.style.marginBottom = "40px";
		panel.appendChild(title);

		const buttonsContainer = document.createElement("div");
		buttonsContainer.style.display = "flex";
		buttonsContainer.style.flexDirection = "column";
		buttonsContainer.style.gap = "15px";

		this.resumeButton = this.createButton("Reprendre la partie");
		this.resumeButton.addEventListener("click", onResume);

		this.settingsButton = this.createButton("Options");
		this.settingsButton.addEventListener("click", onSettings);

		this.mainMenuButton = this.createButton("Retour au menu");
		this.mainMenuButton.addEventListener("click", onMainMenu);

		buttonsContainer.appendChild(this.resumeButton);
		buttonsContainer.appendChild(this.settingsButton);
		buttonsContainer.appendChild(this.mainMenuButton);
		panel.appendChild(buttonsContainer);

		this.overlay.appendChild(panel);
		container.appendChild(this.overlay);
	}

	private createButton(label: string): HTMLButtonElement {
		const btn = document.createElement("button");
		btn.textContent = label;
		btn.style.padding = "10px 20px";
		btn.style.fontSize = "16px";
		btn.style.cursor = "pointer";
		btn.style.border = "2px solid white";
		btn.style.backgroundColor = "transparent";
		btn.style.color = "white";
		btn.style.borderRadius = "4px";
		btn.style.minWidth = "200px";
		return btn;
	}

	public show(): void {
		this.overlay.style.display = "flex";
	}

	public hide(): void {
		this.overlay.style.display = "none";
	}

	public isVisible(): boolean {
		return this.overlay.style.display !== "none";
	}
}