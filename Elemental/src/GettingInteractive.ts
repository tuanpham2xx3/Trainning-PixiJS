import { Container, FederatedPointerEvent, Sprite, Assets } from "pixi.js";

export class GettingInteractive extends Container {
    private bunny?: Sprite;
    private keyState: Map<string, boolean>;

    constructor(screenWidth: number, screenHeight: number) {
        super();
        this.keyState = new Map<string, boolean>();
        this.initialize();
        // Load the bunny asset
        Assets.load("assets/bunny.png").then((texture) => {
            this.bunny = new Sprite(texture);
            this.bunny.anchor.set(0.5);
            this.bunny.x = screenWidth / 3;
            this.bunny.y = screenHeight / 3;
            
            // Enable interaction
            this.bunny.eventMode = 'static';
            this.bunny.cursor = 'pointer';
            
            this.addChild(this.bunny);

            // cham va chuot
            this.bunny.on("pointertap", this.onClicky, this);

            // chi chuot
            this.bunny.on("click", this.onClicky, this);
            // chi cham
            this.bunny.on("tap", this.onClicky, this);
        });
    }
    private initialize(): void {
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            this.keyState.set(event.code, true);
            this.handleKeyDown(event);
        });
        document.addEventListener('keyup', (event: KeyboardEvent) => {
            this.keyState.set(event.code, false);
            this.handleKeyUp(event);
        });
    }
    private handleKeyDown(event: KeyboardEvent): void {
        console.log(`Phim duoc nhan: ${event.key}, Ma phim: ${event.code}`);
    }
    private handleKeyUp(event: KeyboardEvent): void {
        console.log(`Phim duoc tha: ${event.key}, Ma phim: ${event.code}`);
    }
    onClicky(e: FederatedPointerEvent) {
        console.log("You interacted with bunny");
        console.log("The data of your interaction is super interesting", e);
    }
}