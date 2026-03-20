export class LoadingIntro {
	private readonly overlay: HTMLDivElement;
	private readonly progressBar: HTMLDivElement;

	public constructor(container: HTMLElement) {
		this.overlay = document.createElement("div");
		this.overlay.style.position = "fixed";
		this.overlay.style.inset = "0";
		this.overlay.style.display = "flex";
		this.overlay.style.alignItems = "center";
		this.overlay.style.justifyContent = "center";
		this.overlay.style.backgroundColor = "rgba(0, 0, 0, 0.95)";
		this.overlay.style.zIndex = "1000";
		this.overlay.style.flexDirection = "column";

		const title = document.createElement("h1");
		title.textContent = "What Was Left Open";
		title.style.color = "white";
		title.style.marginBottom = "40px";

		const barContainer = document.createElement("div");
		barContainer.style.width = "300px";
		barContainer.style.height = "20px";
		barContainer.style.border = "2px solid white";
		barContainer.style.borderRadius = "4px";
		barContainer.style.overflow = "hidden";

		this.progressBar = document.createElement("div");
		this.progressBar.style.height = "100%";
		this.progressBar.style.width = "0%";
		this.progressBar.style.backgroundColor = "white";
		this.progressBar.style.transition = "width 0.3s ease";

		barContainer.appendChild(this.progressBar);
		this.overlay.appendChild(title);
		this.overlay.appendChild(barContainer);
		container.appendChild(this.overlay);
	}

	public setProgress(percent: number): void {
		const clamped = Math.max(0, Math.min(100, percent));
		this.progressBar.style.width = `${clamped}%`;
	}

	public hide(): void {
		this.overlay.style.display = "none";
	}

	public show(): void {
		this.overlay.style.display = "flex";
		this.setProgress(0);
	}
}