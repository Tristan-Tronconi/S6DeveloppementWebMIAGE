export class CreditsPage {
	private overlay: HTMLDivElement;
	private onClose: () => void;

	public constructor(container: HTMLElement, onClose: () => void) {
		this.onClose = onClose;
		this.overlay = document.createElement("div");
		this.overlay.style.position = "fixed";
		this.overlay.style.inset = "0";
		this.overlay.style.display = "none";
		this.overlay.style.flexDirection = "column";
		this.overlay.style.alignItems = "center";
		this.overlay.style.justifyContent = "flex-start";
		this.overlay.style.backgroundColor = "rgba(0, 0, 0, 0.95)";
		this.overlay.style.zIndex = "350";
		this.overlay.style.overflow = "auto";
		this.overlay.style.padding = "40px 20px";
		this.overlay.style.paddingTop = "60px";

		this.buildUI();
		container.appendChild(this.overlay);
	}

	private buildUI(): void {
		const panel = document.createElement("div");
		panel.style.maxWidth = "800px";
		panel.style.width = "100%";
		panel.style.padding = "50px";
		panel.style.backgroundColor = "rgba(30, 30, 30, 0.95)";
		panel.style.border = "2px solid white";
		panel.style.borderRadius = "12px";
		panel.style.color = "white";
		panel.style.minHeight = "auto";
		panel.style.maxHeight = "none";
		panel.style.marginBottom = "60px";
		panel.style.display = "flex";
		panel.style.flexDirection = "column";

		const title = document.createElement("h1");
		title.textContent = "Crédits";
		title.style.textAlign = "center";
		title.style.fontSize = "3rem";
		title.style.marginBottom = "40px";
		title.style.background = "linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3)";
		title.style.webkitBackgroundClip = "text";
		title.style.backgroundClip = "text";
		title.style.color = "transparent";
		panel.appendChild(title);

		// Section Musiques
		const musicSection = this.createSection("🎵 Musiques");
		musicSection.appendChild(this.createCreditItem("Compositeur", "Jean-Michel Jarre-inspired"));
		musicSection.appendChild(this.createCreditItem("Sound Design", "Audio Network"));
		panel.appendChild(musicSection);

		// Section Modèles 3D / Mesh
		const meshSection = this.createSection("🎮 Modèles 3D & Mesh");
		meshSection.appendChild(this.createCreditItem("Character Design", "Mixamo"));
		meshSection.appendChild(this.createCreditItem("Environment Art", "OpenGameArt"));
		meshSection.appendChild(this.createCreditItem("Props & Assets", "Poly Haven"));
		panel.appendChild(meshSection);

		// Section Textures
		const textureSection = this.createSection("🖼️ Textures");
		textureSection.appendChild(this.createCreditItem("Texture Library", "https://ambientcg.com/"));
		panel.appendChild(textureSection);

		// Section Développement
		const devSection = this.createSection("💻 Développement");
		devSection.appendChild(this.createCreditItem("dev", " Tristan Tronconi (tt201955)"));
		devSection.appendChild(this.createCreditItem("Engine", "Babylon.js"));
		panel.appendChild(devSection);

		// Remerciements
		const thanksSection = this.createSection("🙏 Remerciements");
		thanksSection.appendChild(this.createCreditItem("Merci à", "Tous les testeurs et la communauté"));
		thanksSection.appendChild(this.createCreditItem("Special Thanks", "L'équipe pédagogique MIAGE"));
		panel.appendChild(thanksSection);

		// Bouton retour
		const backButton = document.createElement("button");
		backButton.textContent = "Retour";
		backButton.style.padding = "12px 35px";
		backButton.style.fontSize = "16px";
		backButton.style.cursor = "pointer";
		backButton.style.border = "2px solid white";
		backButton.style.backgroundColor = "transparent";
		backButton.style.color = "white";
		backButton.style.borderRadius = "6px";
		backButton.style.marginTop = "30px";
		backButton.style.marginRight = "0";
		backButton.style.marginLeft = "auto";
		backButton.addEventListener("click", () => {
			this.hide();
			this.onClose();
		});
		panel.appendChild(backButton);

		this.overlay.appendChild(panel);
	}

	private createSection(title: string): HTMLDivElement {
		const section = document.createElement("div");
		section.style.marginBottom = "30px";
		section.style.padding = "20px";
		section.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
		section.style.borderRadius = "8px";

		const sectionTitle = document.createElement("h3");
		sectionTitle.textContent = title;
		sectionTitle.style.marginBottom = "15px";
		sectionTitle.style.fontSize = "1.4rem";
		sectionTitle.style.color = "#feca57";
		section.appendChild(sectionTitle);

		return section;
	}

	private createCreditItem(role: string, name: string): HTMLDivElement {
		const item = document.createElement("div");
		item.style.display = "flex";
		item.style.justifyContent = "space-between";
		item.style.padding = "10px 0";
		item.style.borderBottom = "1px solid rgba(255, 255, 255, 0.1)";

		const roleSpan = document.createElement("span");
		roleSpan.textContent = role;
		roleSpan.style.fontWeight = "bold";
		roleSpan.style.color = "#48dbfb";

		const nameSpan = document.createElement("span");
		nameSpan.textContent = name;

		item.appendChild(roleSpan);
		item.appendChild(nameSpan);

		return item;
	}

	public show(): void {
		this.overlay.style.display = "flex";
	}

	public hide(): void {
		this.overlay.style.display = "none";
	}
}
