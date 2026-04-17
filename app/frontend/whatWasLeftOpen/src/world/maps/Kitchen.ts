import { Color3, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";
import { MaterialFactory } from "../../rendering/MaterialFactory";

export class Kitchen {
    private readonly width = 14;
    private readonly length = 12;
    private readonly wallHeight = 3;

    public build(scene: Scene, position: Vector3 = Vector3.Zero(), portalColor?: string): void {
        const centerX = position.x;
        const centerZ = position.z;

        // Sol carrelé cuisine
        const floor = MeshBuilder.CreateGround("kitchenFloor", { width: this.width, height: this.length }, scene);
        floor.position = new Vector3(centerX, 0, centerZ);
        floor.checkCollisions = true;

        const floorMat = MaterialFactory.createFloorMaterial(
            scene,
            "kitchenFloorMat",
            MaterialFactory.getMainFloorTexture(false),
            Math.max(1, this.width / 2),
            Math.max(1, this.length / 2),
        );
        floor.material = floorMat;

        // Murs
        const wallMaterial = new StandardMaterial("kitchenWallMat", scene);
        wallMaterial.diffuseColor = new Color3(0.95, 0.9, 0.8);

        const wallThickness = 0.3;
        const halfWidth = this.width / 2;
        const halfLength = this.length / 2;

        // Murs
        const walls = [
            { name: "back", dims: [this.width, this.wallHeight, wallThickness], pos: [centerX, this.wallHeight/2, centerZ + halfLength] },
            { name: "left", dims: [wallThickness, this.wallHeight, this.length], pos: [centerX - halfWidth, this.wallHeight/2, centerZ] },
            { name: "right", dims: [wallThickness, this.wallHeight, this.length], pos: [centerX + halfWidth, this.wallHeight/2, centerZ] },
            { name: "front", dims: [this.width, this.wallHeight, wallThickness], pos: [centerX, this.wallHeight/2, centerZ - halfLength] },
        ];

        walls.forEach(wall => {
            const mesh = MeshBuilder.CreateBox(`kitchen${wall.name}Wall`, { width: wall.dims[0], height: wall.dims[1], depth: wall.dims[2] }, scene);
            mesh.position = new Vector3(wall.pos[0], wall.pos[1], wall.pos[2]);
            mesh.material = wallMaterial;
            mesh.checkCollisions = true;
        });

        // Comptoir (simple bloque sur le mur du fond)
        const counter = MeshBuilder.CreateBox(
            "kitchenCounter",
            { width: this.width - 1, height: 0.9, depth: 0.6 },
            scene
        );
        counter.position = new Vector3(centerX, 0.45, centerZ + halfLength - 0.3);
        const counterMat = new StandardMaterial("kitchenCounterMat", scene);
        counterMat.diffuseColor = new Color3(0.6, 0.55, 0.5);
        counter.material = counterMat;
        counter.checkCollisions = true;

        // Évier (petit bloque blanc)
        const sink = MeshBuilder.CreateBox(
            "kitchenSink",
            { width: 0.4, height: 0.2, depth: 0.3 },
            scene
        );
        sink.position = new Vector3(centerX - 0.5, 0.1, centerZ + halfLength - 0.5);
        const sinkMat = new StandardMaterial("kitchenSinkMat", scene);
        sinkMat.diffuseColor = new Color3(0.9, 0.95, 1.0);
        sink.material = sinkMat;
        sink.checkCollisions = true;

        // Plafond
        const ceiling = MeshBuilder.CreateGround("kitchenCeiling", { width: this.width, height: this.length }, scene);
        ceiling.position = new Vector3(centerX, this.wallHeight, centerZ);
        ceiling.rotation.z = Math.PI;
        ceiling.checkCollisions = true;

        const ceilingMatWithTexture = MaterialFactory.createCeilingMaterial(
            scene,
            "kitchenCeilingMat",
            MaterialFactory.getMainCeilingTexture(),
            Math.max(1, this.width / 2),
            Math.max(1, this.length / 2),
        );
        ceiling.material = ceilingMatWithTexture;

        // Portail
        if (portalColor) {
            this.createPortal(scene, portalColor, position.add(new Vector3(0, 1.5, halfLength - 0.5)), Vector3.Forward());
        }

        // Fenêtres
        this.createWindows(scene, centerX, centerZ, halfLength, wallMaterial);
    }

    private createPortal(scene: Scene, color: string, position: Vector3, direction: Vector3): void {
        const portal = MeshBuilder.CreatePlane(`portal_${color}_kitchen`, { width: 2, height: 2.5 }, scene);
        portal.position = position;
        portal.rotation = direction;

        const portalMat = new StandardMaterial(`portal_${color}_kitchen_mat`, scene);
        portalMat.diffuseColor = this.getPortalColorRGB(color);
        portalMat.emissiveColor = new Color3(this.getPortalColorRGB(color).r * 0.3, this.getPortalColorRGB(color).g * 0.3, this.getPortalColorRGB(color).b * 0.3);
        portal.material = portalMat;
    }

    private createWindows(scene: Scene, centerX: number, centerZ: number, halfLength: number, wallMat: StandardMaterial): void {
        // Fenêtre au-dessus de l'évier
        const windowMat = new StandardMaterial("kitchenWindowMat", scene);
        windowMat.diffuseColor = new Color3(0.6, 0.8, 1.0);
        windowMat.alpha = 0.4;
        windowMat.backFaceCulling = false;

        const winSink = MeshBuilder.CreatePlane("kitchenWindowSink", { width: 1.5, height: 1 }, scene);
        winSink.position = new Vector3(centerX, 1.8, centerZ + halfLength - 0.1);
        winSink.material = windowMat;
    }

    private getPortalColorRGB(color: string): Color3 {
        const colors: Record<string, [number, number, number]> = {
            red: [0.8, 0.2, 0.2],
            pink: [0.9, 0.4, 0.7],
            green: [0.2, 0.7, 0.3],
            yellow: [0.95, 0.9, 0.3],
            purple: [0.6, 0.3, 0.8],
            blue: [0.3, 0.6, 0.9],
        };
        const rgb = colors[color] || [1, 1, 1];
        return new Color3(rgb[0], rgb[1], rgb[2]);
    }
}