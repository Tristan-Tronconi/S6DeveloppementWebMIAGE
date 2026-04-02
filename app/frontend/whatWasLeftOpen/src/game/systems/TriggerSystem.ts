export type TriggerType = "zone-enter" | "interaction" | "puzzle-solved" | "custom";

export interface TriggerEvent {
	id: string;
	type: TriggerType;
	payload?: Record<string, unknown>;
}

type TriggerHandler = (event: TriggerEvent) => void;

export class TriggerSystem {
	private readonly listeners = new Map<TriggerType, Set<TriggerHandler>>();

	public on(type: TriggerType, handler: TriggerHandler): () => void {
		const handlers = this.listeners.get(type) ?? new Set<TriggerHandler>();
		handlers.add(handler);
		this.listeners.set(type, handlers);

		return () => {
			handlers.delete(handler);
		};
	}

	public emit(event: TriggerEvent): void {
		const handlers = this.listeners.get(event.type);
		if (!handlers) {
			return;
		}

		for (const handler of handlers) {
			handler(event);
		}
	}
}

// compatible avec on enter trigger actiontrigger