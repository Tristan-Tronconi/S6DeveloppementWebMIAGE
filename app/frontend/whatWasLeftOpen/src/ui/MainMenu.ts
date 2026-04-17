import { AudioManager } from "../core/AudioManager";
import { BackgroundAnimation } from "./BackgroundAnimation";
import { SaveSlotsManager, SlotInfo } from "./SaveSlotsManager";
import { OptionsPage } from "./OptionsPage";
import { CreditsPage } from "./CreditsPage";

export type MenuPage = "main" | "new" | "load" | "options" | "credits";

export class MainMenu {
	private overlay: HTMLDivElement;
	private contentContainer: HTMLDivElement;
	private backgroundAnimation: BackgroundAnimation;
	private saveSlotsManager!: SaveSlotsManager;
	private optionsPage!: OptionsPage;
	private creditsPage!: CreditsPage;
	private currentPage: MenuPage = "main";

	private onStart: (slot: number) => Promise<void>;
	private audioManager: AudioManager;

	public constructor(
		container: HTMLElement,
		onStart: (slot: number) => Promise<void>,
		audioManager: AudioManager
	) {
		this.onStart = onStart;
		this.audioManager = audioManager;

		this.overlay = document.createElement("div");
		this.overlay.style.position = "fixed";
		this.overlay.style.inset = "0";
		this.overlay.style.display = "none";
		this.overlay.style.flexDirection = "column";
		this.overlay.style.alignItems = "center";
		this.overlay.style.justifyContent = "center";
		this.overlay.style.zIndex = "1000";
		this.overlay.style.overflow = "hidden";

		// Animation de fond
		this.backgroundAnimation = new BackgroundAnimation(this.overlay);

		// Conteneur principal du menu
		this.contentContainer = document.createElement("div");
		this.contentContainer.style.display = "flex";
		this.contentContainer.style.flexDirection = "column";
		this.contentContainer.style.alignItems = "center";
		this.contentContainer.style.gap = "20px";
		this.contentContainer.style.zIndex = "1";

		this.overlay.appendChild(this.contentContainer);
		container.appendChild(this.overlay);

		// Initialiser les pages
		this.saveSlotsManager = new SaveSlotsManager(
			container,
			this.handleSlotSelected.bind(this),
			() => this.navigateTo("main"),
			"new"
		);
		this.saveSlotsManager.hide();

		this.saveSlotsManager = new SaveSlotsManager(
			container,
			this.handleSlotSelected.bind(this),
			() => this.navigateTo("main"),
			"load"
		);
		this.saveSlotsManager.hide();

		this.optionsPage = new OptionsPage(this.overlay, this.audioManager, () => this.navigateTo("main"));
		this.optionsPage.hide();

		this.creditsPage = new CreditsPage(this.overlay, () => this.navigateTo("main"));
		this.creditsPage.hide();

		// Construire la page principale
		this.buildMainPage();
	}

	private buildMainPage(): void {
		this.contentContainer.innerHTML = "";

		// Titre jeu
		const title = document.createElement("h1");
		title.textContent = "What Was Left Open";
		title.style.fontSize = "4rem";
		title.style.margin = "0";
		title.style.textAlign = "center";
		title.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
		title.style.webkitBackgroundClip = "text";
		title.style.backgroundClip = "text";
		title.style.color = "transparent";
		title.style.textShadow = "0 0 30px rgba(102, 126, 234, 0.5)";
		this.contentContainer.appendChild(title);

		// Sous-titre
		const subtitle = document.createElement("p");
		subtitle.textContent = "Développé par TRONCONI Tristan";
		subtitle.style.fontSize = "1.2rem";
		subtitle.style.color = "rgba(255, 255, 255, 0.7)";
		subtitle.style.marginTop = "10px";
		this.contentContainer.appendChild(subtitle);

		// Conteneur de boutons
		const buttonsContainer = document.createElement("div");
		buttonsContainer.style.display = "flex";
		buttonsContainer.style.flexDirection = "column";
		buttonsContainer.style.gap = "15px";
		buttonsContainer.style.marginTop = "50px";
		buttonsContainer.style.width = "100%";
		buttonsContainer.style.maxWidth = "350px";

		// Boutons principaux
		const buttons = [
			{ text: "Nouvelle Partie", page: "new" as MenuPage },
			{ text: "Charger une Partie", page: "load" as MenuPage },
			{ text: "Options", page: "options" as MenuPage },
			{ text: "Crédits", page: "credits" as MenuPage },
		];

		buttons.forEach(btn => {
			const button = document.createElement("button");
			button.textContent = btn.text;
			button.style.padding = "18px 40px";
			button.style.fontSize = "18px";
			button.style.fontWeight = "600";
			button.style.cursor = "pointer";
			button.style.border = "2px solid rgba(255, 255, 255, 0.3)";
			button.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
			button.style.color = "white";
			button.style.borderRadius = "10px";
			button.style.transition = "all 0.3s ease";
			button.style.backdropFilter = "blur(10px)";

			button.addEventListener("mouseenter", () => {
				button.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
				button.style.borderColor = "rgba(255, 255, 255, 0.6)";
				button.style.transform = "translateY(-3px)";
				button.style.boxShadow = "0 10px 30px rgba(102, 126, 234, 0.4)";
			});

			button.addEventListener("mouseleave", () => {
				button.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
				button.style.borderColor = "rgba(255, 255, 255, 0.3)";
				button.style.transform = "translateY(0)";
				button.style.boxShadow = "none";
			});

			button.addEventListener("click", () => this.navigateTo(btn.page));
			buttonsContainer.appendChild(button);
		});

		this.contentContainer.appendChild(buttonsContainer);
	}

	private navigateTo(page: MenuPage): void {
		this.currentPage = page;

		switch (page) {
			case "main":
				this.contentContainer.style.display = "flex";
				this.saveSlotsManager.hide();
				this.optionsPage.hide();
				this.creditsPage.hide();
				break;
			case "new":
				this.contentContainer.style.display = "none";
				this.saveSlotsManager = new SaveSlotsManager(
					this.overlay,
					this.handleSlotSelected.bind(this),
					() => this.navigateTo("main"),
					"new"
				);
				this.saveSlotsManager.show();
				this.optionsPage.hide();
				this.creditsPage.hide();
				break;
			case "load":
				this.contentContainer.style.display = "none";
				this.saveSlotsManager = new SaveSlotsManager(
					this.overlay,
					this.handleSlotSelected.bind(this),
					() => this.navigateTo("main"),
					"load"
				);
				this.saveSlotsManager.show();
				this.optionsPage.hide();
				this.creditsPage.hide();
				break;
			case "options":
				this.contentContainer.style.display = "none";
				this.saveSlotsManager.hide();
				this.optionsPage.show();
				this.creditsPage.hide();
				break;
			case "credits":
				this.contentContainer.style.display = "none";
				this.saveSlotsManager.hide();
				this.optionsPage.hide();
				this.creditsPage.show();
				break;
		}
	}

	private async handleSlotSelected(slot: number): Promise<void> {
		// Si c'est un chargement, récupérer les données
		if (this.currentPage === "load") {
			// TODO: implémenter le chargement réel
			console.log(`Chargement de la partie slot ${slot}`);
			await this.onStart(slot);
		} else {
			// Nouvelle partie
			console.log(`Nouvelle partie slot ${slot}`);
			await this.onStart(slot);
		}
	}

	public show(): void {
		this.overlay.style.display = "flex";
		this.navigateTo("main");
	}

	public hide(): void {
		this.overlay.style.display = "none";
		this.currentPage = "main";
	}
}
