export class ItemsHUD {
	private static instance: ItemsHUD | null = null;
	private readonly overlay: HTMLDivElement;
	private readonly gridContainer: HTMLDivElement;
	private readonly closeButton: HTMLButtonElement;

	public static getInstance(container: HTMLElement): ItemsHUD {
		if (!ItemsHUD.instance) {
			ItemsHUD.instance = new ItemsHUD(container);
		}

		return ItemsHUD.instance;
	}

	private constructor(container: HTMLElement) {
		this.overlay = document.createElement("div");
		this.overlay.style.position = "fixed";
		this.overlay.style.inset = "0";
		this.overlay.style.display = "none";
		this.overlay.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
		this.overlay.style.zIndex = "200";

		const panel = document.createElement("div");
		panel.style.position = "fixed";
		panel.style.top = "50%";
		panel.style.left = "50%";
		panel.style.transform = "translate(-50%, -50%)";
		panel.style.width = "80%";
		panel.style.height = "80%";
		panel.style.backgroundColor = "rgba(20, 20, 20, 0.8)";
		panel.style.border = "2px solid white";
		panel.style.borderRadius = "8px";
		panel.style.overflow = "auto";
		panel.style.zIndex = "201";

		this.closeButton = document.createElement("button");
		this.closeButton.textContent = "✕";
		this.closeButton.style.position = "absolute";
		this.closeButton.style.top = "10px";
		this.closeButton.style.right = "10px";
		this.closeButton.style.width = "30px";
		this.closeButton.style.height = "30px";
		this.closeButton.style.cursor = "pointer";
		this.closeButton.addEventListener("click", () => this.hide());

		this.gridContainer = document.createElement("div");
		this.gridContainer.style.display = "grid";
		this.gridContainer.style.gridTemplateColumns = "repeat(auto-fit, minmax(80px, 1fr))";
		this.gridContainer.style.gap = "10px";
		this.gridContainer.style.padding = "20px";

		panel.appendChild(this.closeButton);
		panel.appendChild(this.gridContainer);
		this.overlay.appendChild(panel);
		container.appendChild(this.overlay);
	}

	public get style(): CSSStyleDeclaration {
		return this.overlay.style;
	}

	public show(): void {
		this.overlay.style.display = "block";
		console.log("ItemsHUD shown");
	}

	public hide(): void {
		this.overlay.style.display = "none";
		console.log("ItemsHUD hidden");
	}

	public clearItems(): void {
		this.gridContainer.innerHTML = "";
		console.log("ItemsHUD cleared");
	}

	public addItem(label: string, description?: string): void {
		const itemDiv = document.createElement("div");
		itemDiv.style.border = "1px solid white";
		itemDiv.style.padding = "10px";
		itemDiv.style.cursor = "pointer";
		itemDiv.style.textAlign = "center";

		const titleSpan = document.createElement("span");
		titleSpan.style.fontWeight = "bold";
		titleSpan.textContent = label;

		itemDiv.appendChild(titleSpan);
		if (description) {
			const descP = document.createElement("p");
			descP.style.fontSize = "12px";
			descP.style.margin = "5px 0 0 0";
			descP.textContent = description;
			itemDiv.appendChild(descP);
		}

		this.gridContainer.appendChild(itemDiv);
		console.log(`Item added: ${label}`);
	}
}