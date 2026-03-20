export interface SaveSlotData {
	slot: number;
	isEmpty: boolean;
	time?: string;
	details?: string;
}

export class LoadSave {
	private readonly overlay: HTMLDivElement;
	private readonly slotsContainer: HTMLDivElement;

	public constructor(
		container: HTMLElement,
		onSlotSelected: (slot: number) => void,
	) {
		this.overlay = document.createElement("div");
		this.overlay.style.position = "fixed";
		this.overlay.style.inset = "0";
		this.overlay.style.display = "none";
		this.overlay.style.alignItems = "center";
		this.overlay.style.justifyContent = "center";
		this.overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
		this.overlay.style.zIndex = "250";

		const panel = document.createElement("div");
		panel.style.textAlign = "center";
		panel.style.color = "white";

		const title = document.createElement("h2");
		title.textContent = "Charger une partie";
		title.style.marginBottom = "40px";
		panel.appendChild(title);

		this.slotsContainer = document.createElement("div");
		this.slotsContainer.style.display = "flex";
		this.slotsContainer.style.flexDirection = "column";
		this.slotsContainer.style.gap = "15px";

		for (let i = 1; i <= 3; i++) {
			const slotBtn = document.createElement("button");
			slotBtn.style.padding = "15px 20px";
			slotBtn.style.fontSize = "16px";
			slotBtn.style.cursor = "pointer";
			slotBtn.style.border = "2px solid white";
			slotBtn.style.backgroundColor = "transparent";
			slotBtn.style.color = "white";
			slotBtn.style.borderRadius = "4px";
			slotBtn.style.minWidth = "300px";
			slotBtn.textContent = `Sauvegarde ${i} (vide)`;
			slotBtn.addEventListener("click", () => onSlotSelected(i));
			this.slotsContainer.appendChild(slotBtn);
		}

		panel.appendChild(this.slotsContainer);
		this.overlay.appendChild(panel);
		container.appendChild(this.overlay);
	}

	public show(): void {
		this.overlay.style.display = "flex";
	}

	public hide(): void {
		this.overlay.style.display = "none";
	}

	public updateSlot(slot: number, label: string): void {
		const buttons = this.slotsContainer.querySelectorAll("button");
		if (buttons[slot - 1]) {
			(buttons[slot - 1] as HTMLButtonElement).textContent = label;
		}
	}
}