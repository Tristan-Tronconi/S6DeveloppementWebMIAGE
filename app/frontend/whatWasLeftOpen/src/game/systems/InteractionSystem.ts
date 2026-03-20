export interface InspectableTarget {
	id: string;
	label: string;
	description: string;
	interactable?: boolean;
}

export class InteractionSystem {
	private inspectables = new Map<string, InspectableTarget>();
	private focusedTargetId: string | null = null;

	public registerInspectable(target: InspectableTarget): void {
		this.inspectables.set(target.id, target);
	}

	public unregisterInspectable(targetId: string): void {
		this.inspectables.delete(targetId);
		if (this.focusedTargetId === targetId) {
			this.focusedTargetId = null;
		}
	}

	public setFocusedTarget(targetId: string | null): void {
		if (targetId && !this.inspectables.has(targetId)) {
			this.focusedTargetId = null;
			return;
		}

		this.focusedTargetId = targetId;
	}

	public getFocusedTarget(): InspectableTarget | null {
		if (!this.focusedTargetId) {
			return null;
		}

		return this.inspectables.get(this.focusedTargetId) ?? null;
	}

	public interactWithFocusedTarget(): InspectableTarget | null {
		const focused = this.getFocusedTarget();
		if (!focused || focused.interactable === false) {
			return null;
		}

		return focused;
	}
}