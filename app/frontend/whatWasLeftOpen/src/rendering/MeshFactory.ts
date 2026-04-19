import { Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";

export class MeshFactory {
	public static createWall(
		scene: Scene,
		label: string,
		width: number,
		height: number,
		depth: number,
		position: Vector3,
	): Mesh {
		const mesh = MeshBuilder.CreateBox(label, { width, height, depth }, scene);
		mesh.position = position;
		mesh.checkCollisions = true;
		return mesh;
	}

	public static createFloor(
		scene: Scene,
		label: string,
		width: number,
		depth: number,
		position?: Vector3,
	): Mesh {
		const mesh = MeshBuilder.CreateGround(label, { width, height: depth }, scene);
		if (position) {
			mesh.position = position;
		}

		mesh.checkCollisions = true;
		return mesh;
	}

	public static createColumn(
		scene: Scene,
		label: string,
		radius: number,
		height: number,
		position: Vector3,
	): Mesh {
		const mesh = MeshBuilder.CreateCylinder(label, { diameter: radius * 2, height }, scene);
		mesh.position = position;
		mesh.checkCollisions = true;
		return mesh;
	}

	public static createPillar(
		scene: Scene,
		label: string,
		radiusTop: number,
		radiusBottom: number,
		height: number,
		position: Vector3,
	): Mesh {
		const mesh = MeshBuilder.CreateCylinder(
			label,
			{ diameterTop: radiusTop * 2, diameterBottom: radiusBottom * 2, height },
			scene,
		);
		mesh.position = position;
		mesh.checkCollisions = true;
		return mesh;
	}
} 