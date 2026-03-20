// import { Vector3, Mesh, MeshBuilder, Scene } from "@babylonjs/core";
// import { Entity } from "./Entity";

// export interface RoomDimensions {
// 	width: number;
// 	length: number;
// 	height: number;
// }

// export class Room extends Entity {
// 	public readonly dimensions: RoomDimensions;
// 	public readonly doorIds: Set<string> = new Set();
// 	public readonly portalIds: Set<string> = new Set();
// 	public mesh: Mesh | null = null;

// 	public constructor(
// 		dimensions: RoomDimensions,
// 		position: Vector3 = Vector3.Zero(),
// 		id?: string,
// 		mesh?: Mesh,
// 	) {
// 		super(position, id);
// 		this.dimensions = dimensions;
// 		this.addTag("room");
// 		this.mesh = mesh || null;
// 	}

// 	public addDoor(doorId: string): void {
// 		this.doorIds.add(doorId);
// 	}

// 	public addPortal(portalId: string): void {
// 		this.portalIds.add(portalId);
// 	}

// 	public instantiate(scene: Scene): void {
//         this.mesh = MeshBuilder.CreateBox(this.id, {
//             width: this.dimensions.width,
//             height: this.dimensions.height,
//             depth: this.dimensions.length
//         }, scene);
        
//         this.mesh.position = this.position;
//         this.mesh.checkCollisions = true;
//         this.mesh.flipFaces(true); 
//     }
// }

import { Mesh, MeshBuilder, Scene, StandardMaterial, Color3, Vector3, Texture } from "@babylonjs/core";
import { Entity } from "./Entity";

export interface RoomDimensions {
    width: number;
    length: number;
    height: number;
}

export class Room extends Entity {
    public readonly dimensions: RoomDimensions;
    public mesh: Mesh | null = null; 

    public constructor(
        dimensions: RoomDimensions,
        position: Vector3 = Vector3.Zero(),
        id?: string,
    ) {
        super(position, id);
        this.dimensions = dimensions;
        this.addTag("room");
    }

    /**
     * Crée la géométrie 3D de la pièce dans la scène donnée.
     * Cette méthode est appelée par la "Map" (ex: Apartment).
     */
    public instantiateProcedural(scene: Scene, material?: StandardMaterial): Mesh {
        this.mesh = MeshBuilder.CreateBox(
            `${this.id}-mesh`,
            {
                width: this.dimensions.width,
                height: this.dimensions.height,
                depth: this.dimensions.length,
                // Optionnel : Pour voir l'intérieur de la boîte
                sideOrientation: Mesh.BACKSIDE 
            },
            scene
        );

        // 2. Positionner le mesh selon l'entité
        // On lève le mesh de la moitié de sa hauteur pour que le sol soit à y=0
        this.mesh.position = this.position.add(new Vector3(0, this.dimensions.height / 2, 0));
        
        // 3. Activer les collisions
        this.mesh.checkCollisions = true;

        // 4. Appliquer un matériau par défaut si aucun n'est fourni
        if (material) {
            this.mesh.material = material;
        } else {
            const defaultMat = new StandardMaterial(`${this.id}-mat`, scene);
            defaultMat.diffuseColor = new Color3(0.5, 0.5, 0.5); // Gris
            defaultMat.specularColor = new Color3(0, 0, 0); // Pas de reflet
            this.mesh.material = defaultMat;
        }

        return this.mesh;
    }
}