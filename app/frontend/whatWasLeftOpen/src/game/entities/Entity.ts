import { Vector3 } from "@babylonjs/core";

let entityCounter = 0;

export interface TransformLike {
	position: Vector3;
}

export class Entity implements TransformLike {
	public readonly id: string;
	public readonly tags: Set<string> = new Set();
	public enabled = true;
	public position: Vector3;

	public constructor(position: Vector3 = Vector3.Zero(), id?: string) {
		entityCounter += 1;
		this.id = id ?? `entity-${entityCounter}`;
		this.position = position.clone();
	}

	public setPosition(position: Vector3): void {
		this.position.copyFrom(position);
	}

	public move(delta: Vector3): void {
		this.position.addInPlace(delta);
	}

	public addTag(tag: string): void {
		this.tags.add(tag);
	}

	public hasTag(tag: string): boolean {
		return this.tags.has(tag);
	}
}