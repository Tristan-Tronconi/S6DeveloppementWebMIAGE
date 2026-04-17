export class BackgroundAnimation {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private particles: Particle[] = [];
	private animationId: number = 0;

	constructor(container: HTMLElement) {
		this.canvas = document.createElement("canvas");
		this.canvas.style.position = "absolute";
		this.canvas.style.top = "0";
		this.canvas.style.left = "0";
		this.canvas.style.width = "100%";
		this.canvas.style.height = "100%";
		this.canvas.style.zIndex = "-1";
		this.canvas.style.pointerEvents = "none";

		container.appendChild(this.canvas);

		this.ctx = this.canvas.getContext("2d")!;
		this.resize();

		this.initParticles();
		this.animate();

		window.addEventListener("resize", () => this.resize());
	}

	private resize(): void {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}

	private initParticles(): void {
		this.particles = [];
		const particleCount = 50;

		for (let i = 0; i < particleCount; i++) {
			this.particles.push({
				x: Math.random() * this.canvas.width,
				y: Math.random() * this.canvas.height,
				size: Math.random() * 3 + 1,
				speedX: (Math.random() - 0.5) * 0.5,
				speedY: (Math.random() - 0.5) * 0.5,
				opacity: Math.random() * 0.5 + 0.2,
			});
		}
	}

	private animate(): void {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Dégradé de fond
		const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
		gradient.addColorStop(0, "#0a0a0a");
		gradient.addColorStop(1, "#1a1a2e");
		this.ctx.fillStyle = gradient;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		// Dessiner et mettre à jour les particules
		this.particles.forEach(particle => {
			particle.x += particle.speedX;
			particle.y += particle.speedY;

			// Rebond sur les bords
			if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
			if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;

			this.ctx.beginPath();
			this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
			this.ctx.fillStyle = `rgba(100, 200, 255, ${particle.opacity})`;
			this.ctx.fill();
		});

		// Lignes de connexion entre particules proches
		for (let i = 0; i < this.particles.length; i++) {
			for (let j = i + 1; j < this.particles.length; j++) {
				const dx = this.particles[i].x - this.particles[j].x;
				const dy = this.particles[i].y - this.particles[j].y;
				const distance = Math.sqrt(dx * dx + dy * dy);

				if (distance < 150) {
					this.ctx.beginPath();
					this.ctx.strokeStyle = `rgba(100, 200, 255, ${0.1 * (1 - distance / 150)})`;
					this.ctx.lineWidth = 1;
					this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
					this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
					this.ctx.stroke();
				}
			}
		}

		this.animationId = requestAnimationFrame(() => this.animate());
	}

	public dispose(): void {
		cancelAnimationFrame(this.animationId);
	}
}

interface Particle {
	x: number;
	y: number;
	size: number;
	speedX: number;
	speedY: number;
	opacity: number;
}
