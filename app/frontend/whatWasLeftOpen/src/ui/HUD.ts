import { ItemsHUD } from "./ItemsHUD";

export class HUD {
	private readonly container: HTMLDivElement;
	private readonly recentItemsPanel: HTMLDivElement;
	private readonly controlsPanel: HTMLDivElement;
	private readonly focusIndicator: HTMLDivElement;
	private controlsShown = true;

	public constructor(container: HTMLElement) {
		this.container = document.createElement("div");
		this.container.style.position = "fixed";
		this.container.style.inset = "0";
		this.container.style.pointerEvents = "none";
		this.container.style.zIndex = "100";

		this.recentItemsPanel = document.createElement("div");
		this.recentItemsPanel.style.position = "absolute";
		this.recentItemsPanel.style.bottom = "20px";
		this.recentItemsPanel.style.right = "20px";
		this.recentItemsPanel.style.display = "flex";
		this.recentItemsPanel.style.gap = "8px";

		this.controlsPanel = document.createElement("div");
		this.controlsPanel.style.position = "absolute";
		this.controlsPanel.style.top = "20px";
		this.controlsPanel.style.left = "20px";
		this.controlsPanel.style.opacity = "0.8";
		this.controlsPanel.style.fontFamily = "monospace";
		this.controlsPanel.innerHTML =
			"<p>Z/W: avancer | Q/A: gauche | D: droite<br>E: interagir | Tab: inventaire</p>";

		this.focusIndicator = document.createElement("div");
		this.focusIndicator.style.position = "absolute";
		this.focusIndicator.style.top = "50%";
		this.focusIndicator.style.left = "50%";
		this.focusIndicator.style.transform = "translate(-50%, -50%)";
		this.focusIndicator.style.fontSize = "14px";
		this.focusIndicator.style.color = "white";
		this.focusIndicator.style.display = "none";
		this.focusIndicator.textContent = "E pour interagir";

		this.container.appendChild(this.recentItemsPanel);
		this.container.appendChild(this.controlsPanel);
		this.container.appendChild(this.focusIndicator);
		container.appendChild(this.container);
	}

	public showControls(): void {
		this.controlsPanel.style.display = "block";
		this.controlsShown = true;
	}

	public hideControls(): void {
		this.controlsPanel.style.display = "none";
		this.controlsShown = false;
	}

	public toggleControls(): void {
		if (this.controlsShown) {
			this.hideControls();
		} else {
			this.showControls();
		}
	}

	public showFocusInteraction(): void {
		this.focusIndicator.style.display = "block";
	}

	public hideFocusInteraction(): void {
		this.focusIndicator.style.display = "none";
	}

	public addRecentItem(itemLabel: string): void {
		const tag = document.createElement("span");
		tag.style.padding = "4px 8px";
		tag.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
		tag.style.color = "white";
		tag.style.borderRadius = "4px";
		tag.textContent = itemLabel;
		this.recentItemsPanel.appendChild(tag);

		if (this.recentItemsPanel.children.length > 5) {
			this.recentItemsPanel.removeChild(this.recentItemsPanel.children[0]);
		}
	}

	public showInventory(): void {
		ItemsHUD.getInstance(this.container).show();
	}
	public hideInventory(): void {
		ItemsHUD.getInstance(this.container).hide();
	}
	public toggleInventory(): void {
		const inventory = ItemsHUD.getInstance(this.container);
		if (inventory) {
			if (inventory.style.display === "block") {
				this.hideInventory();
			} else {
				this.showInventory();
			}
		}
	}
}