export class MainMenu {
	private readonly overlay: HTMLDivElement;
	private readonly startButton: HTMLButtonElement;

	public constructor(container: HTMLElement, onStart: () => void) {
		this.overlay = document.createElement("div");
		this.overlay.style.position = "fixed";
		this.overlay.style.inset = "0";
		this.overlay.style.display = "none";
		this.overlay.style.alignItems = "center";
		this.overlay.style.justifyContent = "center";
		this.overlay.style.background = "rgba(0, 0, 0, 0.7)";
		this.overlay.style.zIndex = "1000";

		this.startButton = document.createElement("button");
		this.startButton.textContent = "Lancer le jeu";
		this.startButton.style.padding = "12px 20px";
		this.startButton.style.border = "0";
		this.startButton.style.borderRadius = "8px";
		this.startButton.style.cursor = "pointer";
		this.startButton.style.fontSize = "16px";
		this.startButton.style.fontWeight = "600";

		this.startButton.addEventListener("click", onStart);
		this.overlay.appendChild(this.startButton);
		container.appendChild(this.overlay);
	}

	public show(): void {
		this.overlay.style.display = "flex";
	}

	public hide(): void {
		this.overlay.style.display = "none";
	}
}
