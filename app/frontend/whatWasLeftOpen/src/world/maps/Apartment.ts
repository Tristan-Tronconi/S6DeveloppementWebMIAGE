// import { Engine, Scene } from "@babylonjs/core";
// import { Room } from "../../game/entities/Room";
// import { Item } from "../../game/entities/Item";
// import { Vector3 } from "@babylonjs/core";

// export class Apartment {
// 	private readonly engine: Engine;
// 	private readonly canvas: HTMLCanvasElement;

// 	public constructor(engine: Engine, canvas: HTMLCanvasElement) {
// 		this.engine = engine;
// 		this.canvas = canvas;
// 	}

// 	public createScene(): Scene {
// 		const scene = new Scene(this.engine);
// 		scene.collisionsEnabled = true;
// 		scene.gravity = new Vector3(0, -1, 0);

// 		const apartmentRoom = new Room(
// 			{ width: 10, length: 8, height: 3 },
// 			Vector3.Zero(),
// 			"apartment",
// 		);
// 		apartmentRoom.enabled = true;

// 		return scene;
// 	}
// }

import { Engine, Scene, Vector3, HemisphericLight, StandardMaterial, Color3 } from "@babylonjs/core";
import { Room } from "../../game/entities/Room";

export class Apartment {
    constructor(private readonly engine: Engine, private readonly canvas: HTMLCanvasElement) {}

    public createScene(): Scene {
        const scene = new Scene(this.engine);
        scene.collisionsEnabled = true;
        scene.gravity = new Vector3(0, -9.81, 0);
        new HemisphericLight("light", new Vector3(0, 1, 0), scene);

        const apartmentEntity = new Room(
            { width: 15, length: 10, height: 4 },
            new Vector3(0, 0, 0),
            "main-apartment",
        );

        const wallMat = new StandardMaterial("apartment-walls", scene);
        wallMat.diffuseColor = new Color3(0.9, 0.85, 0.8);

        apartmentEntity.instantiateProcedural(scene, wallMat);

        return scene;
    }
}