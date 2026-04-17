import { SaveSystem } from "../game/systems/SaveSystem";

export interface SlotInfo {
	slot: number;
	isEmpty: boolean;
	time?: string;
	details?: string;
}

export class SaveSlotsManager {
	private overlay: HTMLDivElement;
	private slotsContainer: HTMLDivElement;
	private onSlotSelected: (slot: number) => void;
	private onBack: () => void;
	private mode: "new" | "load";
	private slotsInfo: SlotInfo[] = [];
	private saveSystem: SaveSystem;

	public constructor(
		container: HTMLElement,
		onSlotSelected: (slot: number) => void,
		onBack: () => void,
		mode: "new" | "load"
	) {
		this.saveSystem = new SaveSystem();
		this.onSlotSelected = onSlotSelected;
		this.onBack = onBack;
		this.mode = mode;
		this.overlay = document.createElement("div");
		this.overlay.style.position = "fixed";
		this.overlay.style.inset = "0";
		this.overlay.style.display = "none";
		this.overlay.style.flexDirection = "column";
		this.overlay.style.alignItems = "center";
		this.overlay.style.justifyContent = "center";
		this.overlay.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
		this.overlay.style.zIndex = "300";
		this.overlay.style.padding = "20px";

		// Panel principal
		const panel = document.createElement("div");
		panel.style.textAlign = "center";
		panel.style.color = "white";
		panel.style.display = "flex";
		panel.style.flexDirection = "column";
		panel.style.alignItems = "center";
		panel.style.gap = "20px";

		const title = document.createElement("h2");
		title.textContent = mode === "new" ? "Nouvelle Partie" : "Charger une Partie";
		title.style.margin = "0";
		title.style.fontSize = "2rem";
		panel.appendChild(title);

		this.slotsContainer = document.createElement("div");
		this.slotsContainer.style.display = "flex";
		this.slotsContainer.style.flexDirection = "column";
		this.slotsContainer.style.gap = "15px";

		// Créer les 4 slots
		for (let i = 1; i <= 4; i++) {
			const slotBtn = this.createSlotButton(i);
			this.slotsContainer.appendChild(slotBtn);
		}

		panel.appendChild(this.slotsContainer);

		// Bouton retour en bas à droite
		const backButton = document.createElement("button");
		backButton.textContent = "Retour";
		backButton.style.padding = "10px 25px";
		backButton.style.fontSize = "16px";
		backButton.style.cursor = "pointer";
		backButton.style.border = "2px solid white";
		backButton.style.backgroundColor = "transparent";
		backButton.style.color = "white";
		backButton.style.borderRadius = "6px";
		backButton.style.marginTop = "20px";
		backButton.style.alignSelf = "flex-end";
		backButton.addEventListener("click", () => {
	this.hide();
	this.onBack();
});
		panel.appendChild(backButton);

		this.overlay.appendChild(panel);
		container.appendChild(this.overlay);
	}

	private createSlotButton(slot: number): HTMLButtonElement {
		const slotBtn = document.createElement("button");
		slotBtn.style.padding = "20px 40px";
		slotBtn.style.fontSize = "18px";
		slotBtn.style.cursor = "pointer";
		slotBtn.style.border = "2px solid white";
		slotBtn.style.backgroundColor = "transparent";
		slotBtn.style.color = "white";
		slotBtn.style.borderRadius = "8px";
		slotBtn.style.minWidth = "350px";
		slotBtn.style.transition = "all 0.3s ease";

		slotBtn.addEventListener("mouseenter", () => {
			if (!slotBtn.disabled) {
				slotBtn.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
				slotBtn.style.transform = "scale(1.02)";
			}
		});

		slotBtn.addEventListener("mouseleave", () => {
			slotBtn.style.backgroundColor = "transparent";
			slotBtn.style.transform = "scale(1)";
		});

		slotBtn.addEventListener("click", async () => {
			const slotInfo = this.slotsInfo.find(s => s.slot === slot);
			if (this.mode === "load" && (!slotInfo || slotInfo.isEmpty)) {
				return; // Slot vide désactivé en mode chargement
			}
			if (this.mode === "new" && slotInfo && !slotInfo.isEmpty) {
				// Confirmation d'écrasement
				if (!confirm(`La sauvegarde ${slot} existe déjà. Voulez-vous l'écraser ?`)) {
					return;
				}
			}
			this.onSlotSelected(slot);
		});

		return slotBtn;
	}

	public updateSlots(slots: SlotInfo[]): void {
		this.slotsInfo = slots;
		const buttons = this.slotsContainer.querySelectorAll("button");

		slots.forEach((slot, index) => {
			if (buttons[index]) {
				const btn = buttons[index] as HTMLButtonElement;
				if (slot.isEmpty) {
					btn.textContent = `Sauvegarde ${slot.slot} (vide)`;
					btn.disabled = this.mode === "load";
					btn.style.opacity = this.mode === "load" ? "0.5" : "1";
				} else {
					btn.textContent = `Sauvegarde ${slot.slot} - ${slot.time}`;
					btn.disabled = false;
					btn.style.opacity = "1";
				}
			}
		});
	}

	public show(): void {
		this.overlay.style.display = "flex";
		// Rafraîchir les infos des slots
		const slots: SlotInfo[] = [];
		for (let i = 1; i <= 4; i++) {
			const saveData = this.saveSystem.load(i);
			slots.push({
				slot: i,
				isEmpty: !saveData,
				time: saveData ? `Temps: ${Math.floor(saveData.gameTimeSeconds / 60)}min ${saveData.gameTimeSeconds % 60}s` : undefined,
				details: saveData ? `Objets: ${saveData.inventory.length} | Puzzles: ${Object.keys(saveData.puzzleStates).length}` : undefined,
			});
		}
		this.updateSlots(slots);
	}

	public hide(): void {
		this.overlay.style.display = "none";
	}
}
