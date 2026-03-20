export interface PortalLightLink {
	sourcePortalId: string;
	targetPortalId: string;
	intensityFactor?: number;
}

export class NonEuclideanSystem {
	private readonly links = new Map<string, PortalLightLink>();

	public registerLink(link: PortalLightLink): void {
		this.links.set(link.sourcePortalId, link);
	}

	public unregisterLink(sourcePortalId: string): void {
		this.links.delete(sourcePortalId);
	}

	public getTransferredIntensity(sourcePortalId: string, sourceIntensity: number): number {
		const link = this.links.get(sourcePortalId);
		if (!link) {
			return sourceIntensity;
		}

		return sourceIntensity * (link.intensityFactor ?? 1);
	}
}