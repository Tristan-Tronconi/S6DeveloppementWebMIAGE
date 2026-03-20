export class NarrativeOverlay {
	private readonly overlay: HTMLDivElement;
	private readonly textBox: HTMLDivElement;
	private enabled = true;

	public constructor(container: HTMLElement) {
		this.overlay = document.createElement("div");
		this.overlay.style.position = "fixed";
		this.overlay.style.bottom = "20px";
		this.overlay.style.left = "20px";
		this.overlay.style.right = "20px";
		this.overlay.style.maxWidth = "600px";
		this.overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
		this.overlay.style.border = "2px solid white";
		this.overlay.style.borderRadius = "8px";
		this.overlay.style.padding = "15px";
		this.overlay.style.zIndex = "150";
		this.overlay.style.display = "none";
		this.overlay.style.wordWrap = "break-word";

		this.textBox = document.createElement("div");
		this.textBox.style.color = "white";
		this.textBox.style.fontFamily = "Arial, sans-serif";
		this.textBox.style.fontSize = "16px";
		this.textBox.style.lineHeight = "1.4";

		this.overlay.appendChild(this.textBox);
		container.appendChild(this.overlay);
	}

	public show(text: string): void {
		if (!this.enabled) {
			return;
		}

		this.textBox.textContent = text;
		this.overlay.style.display = "block";
	}

	public hide(): void {
		this.overlay.style.display = "none";
	}

	public setEnabled(enabled: boolean): void {
		this.enabled = enabled;
		if (!enabled) {
			this.hide();
		}
	}

	public isEnabled(): boolean {
		return this.enabled;
	}
}